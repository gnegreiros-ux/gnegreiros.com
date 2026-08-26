#!/usr/bin/env node
// Uploads dist/ to the OVH mutualisé SFTP host, verifying each file's size
// after upload and retrying (with reconnect) on mismatch or error.
//
// The wlixcc/SFTP-Deploy-Action put mechanism silently truncates files when
// the OVH SFTP session drops mid-session and reports "failed" without
// retrying, leaving corrupted (truncated) files live on production. A
// fully sequential rewrite (one connection, one file at a time) avoided
// the truncation but took over an hour for ~750 files. A concurrent
// version (5 connections firing continuously) was fast but still lost
// ~55 files on one run. A batched version with short (5-15s) pauses and
// backoff got stuck for 55+ minutes without clearing the block on the
// very first batch — the OVH-side block plausibly lasts minutes, not
// seconds, and reconnecting every few seconds may extend it rather than
// wait it out. This version uses long, minutes-scale pauses (between
// batches and between retry attempts) and only two connections at a
// time, trading speed for actually finishing.
//
// Root cause found 2026-08-26: the account's SFTP quota is 1GB. Gaspésie's
// video files pushed dist/ past that, so every write started failing
// (0-byte file, then "Write stream error") — not a transient connection
// drop. *.mp4 is excluded from upload below until video has a proper
// external host; see purge-remote-videos.mjs for the one-off cleanup of
// video already sitting on the server.

import SftpClient from 'ssh2-sftp-client';
import { readdirSync, statSync } from 'node:fs';
import { join, relative, posix, sep } from 'node:path';

const HOST = process.env.OVH_SFTP_HOST;
const PORT = Number(process.env.OVH_SFTP_PORT || '22');
const USERNAME = process.env.OVH_SFTP_USER;
const PASSWORD = process.env.OVH_SFTP_PASSWORD;
const REMOTE_ROOT = process.env.OVH_SFTP_REMOTE_DIR.replace(/\/+$/, '');
const LOCAL_ROOT = 'dist';

const MAX_ATTEMPTS = 3;
const CONCURRENCY = 2;
const BATCH_SIZE = 50;
const BATCH_PAUSE_MS = 2 * 60 * 1000; // 2 min between batches
const RETRY_PAUSE_MS = 90 * 1000; // 90s before reconnecting after a failed attempt
const FINAL_RETRY_PAUSE_MS = 5 * 60 * 1000; // 5 min before the final cleanup pass

function walk(dir) {
	const out = [];
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const full = join(dir, entry.name);
		if (entry.isDirectory()) {
			out.push(...walk(full));
		} else {
			out.push(full);
		}
	}
	return out;
}

// The OVH mutualisé account's SFTP quota is 1GB. Gaspésie's videos alone are
// ~850MB, which pushed every deploy past quota and made every write fail
// (0-byte files, "Write stream error"), breaking the live site's CSS/fonts.
// Skip video until it has a proper external host (object storage/CDN).
function isExcluded(localPath) {
	return localPath.toLowerCase().endsWith('.mp4');
}

function chunk(arr, size) {
	const out = [];
	for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
	return out;
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function connect() {
	const sftp = new SftpClient();
	await sftp.connect({
		host: HOST,
		port: PORT,
		username: USERNAME,
		password: PASSWORD,
		retries: 0,
	});
	return sftp;
}

async function ensureRemoteDirs(sftp, remoteDirs) {
	// The jailed SFTP account can't stat/mkdir above its own root (permission
	// denied), and virtually every directory already exists from prior
	// deploys anyway — so treat mkdir failures as informational, not fatal.
	const cache = new Set();
	for (const remoteDir of remoteDirs) {
		const parts = remoteDir.split('/').filter(Boolean);
		let path = '';
		for (const part of parts) {
			path += '/' + part;
			if (cache.has(path)) continue;
			cache.add(path);
			try {
				if (!(await sftp.exists(path))) {
					await sftp.mkdir(path, true);
				}
			} catch (err) {
				console.log(`mkdir ${path} skipped: ${err.message}`);
			}
		}
	}
}

async function uploadWithRetry(getSftp, file, onReconnect) {
	const { localPath, remotePath, size } = file;
	let sftp = getSftp();

	for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
		try {
			await sftp.put(localPath, remotePath);
			const remoteStat = await sftp.stat(remotePath);
			if (remoteStat.size === size) return true;
			console.log(
				`size mismatch ${remotePath} (local ${size}, remote ${remoteStat.size}), attempt ${attempt}/${MAX_ATTEMPTS}`,
			);
		} catch (err) {
			console.log(`error uploading ${remotePath} (attempt ${attempt}/${MAX_ATTEMPTS}): ${err.message}`);
		}

		await sleep(RETRY_PAUSE_MS);
		sftp = await onReconnect();
	}

	return false;
}

// Uploads one batch of files with a small worker pool, returns the file
// objects that still failed after MAX_ATTEMPTS each.
async function uploadBatch(files) {
	let cursor = 0;
	const failed = [];

	async function worker() {
		let sftp = await connect();
		const reconnect = async () => {
			try {
				await sftp.end();
			} catch {
				/* ignore */
			}
			sftp = await connect();
			return sftp;
		};

		while (true) {
			const i = cursor++;
			if (i >= files.length) break;
			const ok = await uploadWithRetry(() => sftp, files[i], reconnect);
			if (!ok) failed.push(files[i]);
		}

		await sftp.end();
	}

	await Promise.all(Array.from({ length: Math.min(CONCURRENCY, files.length) }, () => worker()));
	return failed;
}

async function main() {
	const localFiles = walk(LOCAL_ROOT).filter((p) => !isExcluded(p));
	const files = localFiles.map((localPath) => {
		const rel = relative(LOCAL_ROOT, localPath).split(sep).join('/');
		return { localPath, remotePath: posix.join(REMOTE_ROOT, rel), size: statSync(localPath).size };
	});

	console.log(`Uploading ${files.length} files to ${HOST}:${REMOTE_ROOT} in batches of ${BATCH_SIZE}`);

	const remoteDirs = [...new Set(files.map((f) => f.remotePath.slice(0, f.remotePath.lastIndexOf('/'))))].sort();
	const setupSftp = await connect();
	await ensureRemoteDirs(setupSftp, remoteDirs);
	await setupSftp.end();

	const batches = chunk(files, BATCH_SIZE);
	let failed = [];
	let done = 0;

	for (let b = 0; b < batches.length; b++) {
		const batchFailed = await uploadBatch(batches[b]);
		failed.push(...batchFailed);
		done += batches[b].length;
		console.log(
			`batch ${b + 1}/${batches.length} done (${done}/${files.length} files, ${failed.length} failed so far)`,
		);
		if (b < batches.length - 1) await sleep(BATCH_PAUSE_MS);
	}

	if (failed.length) {
		console.log(`resting ${FINAL_RETRY_PAUSE_MS / 1000}s then retrying ${failed.length} file(s) that failed...`);
		await sleep(FINAL_RETRY_PAUSE_MS);
		failed = await uploadBatch(failed);
	}

	if (failed.length) {
		console.error(`FAILED to upload ${failed.length} file(s) after retries:`);
		for (const f of failed) console.error(`  ${f.remotePath}`);
		process.exit(1);
	}

	console.log(`Successfully uploaded and verified ${files.length} files.`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
