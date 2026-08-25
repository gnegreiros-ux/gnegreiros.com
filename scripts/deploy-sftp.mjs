#!/usr/bin/env node
// Uploads dist/ to the OVH mutualisé SFTP host, verifying each file's size
// after upload and retrying (with reconnect) on mismatch or error.
//
// The wlixcc/SFTP-Deploy-Action put mechanism silently truncates files when
// the OVH SFTP session drops mid-session (a reproducible ~25s dead window
// hits the same files every run) and reports "failed" without retrying,
// leaving corrupted (truncated) files live on production. A fully
// sequential rewrite (one connection, one file at a time) avoided the
// truncation but was far too slow (750+ files, two round trips each).
// This version uses a small pool of independent SFTP connections (each
// sequential on its own, so no single connection is pipelined hard enough
// to reproduce the original bug) to get useful throughput back.

import SftpClient from 'ssh2-sftp-client';
import { readdirSync, statSync } from 'node:fs';
import { join, relative, posix, sep } from 'node:path';

const HOST = process.env.OVH_SFTP_HOST;
const PORT = Number(process.env.OVH_SFTP_PORT || '22');
const USERNAME = process.env.OVH_SFTP_USER;
const PASSWORD = process.env.OVH_SFTP_PASSWORD;
const REMOTE_ROOT = process.env.OVH_SFTP_REMOTE_DIR.replace(/\/+$/, '');
const LOCAL_ROOT = 'dist';

const MAX_ATTEMPTS = 6;
const CONCURRENCY = 5;

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

		await sleep(Math.min(1000 * 2 ** attempt, 15000));
		sftp = await onReconnect();
	}

	return false;
}

async function main() {
	const localFiles = walk(LOCAL_ROOT);
	const files = localFiles.map((localPath) => {
		const rel = relative(LOCAL_ROOT, localPath).split(sep).join('/');
		return { localPath, remotePath: posix.join(REMOTE_ROOT, rel), size: statSync(localPath).size };
	});

	console.log(`Uploading ${files.length} files to ${HOST}:${REMOTE_ROOT} (concurrency ${CONCURRENCY})`);

	const remoteDirs = [...new Set(files.map((f) => f.remotePath.slice(0, f.remotePath.lastIndexOf('/'))))].sort();
	const setupSftp = await connect();
	await ensureRemoteDirs(setupSftp, remoteDirs);
	await setupSftp.end();

	let cursor = 0;
	let completed = 0;
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
			if (!ok) failed.push(files[i].remotePath);
			completed++;
			if (completed % 50 === 0 || completed === files.length) {
				console.log(`progress: ${completed}/${files.length}`);
			}
		}

		await sftp.end();
	}

	await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));

	if (failed.length) {
		console.error(`FAILED to upload ${failed.length} file(s) after ${MAX_ATTEMPTS} attempts each:`);
		for (const f of failed) console.error(`  ${f}`);
		process.exit(1);
	}

	console.log(`Successfully uploaded and verified ${files.length} files.`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
