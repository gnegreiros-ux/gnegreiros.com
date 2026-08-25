#!/usr/bin/env node
// Uploads dist/ to the OVH mutualisé SFTP host, verifying each file's size
// after upload and retrying (with reconnect) on mismatch or error.
//
// The wlixcc/SFTP-Deploy-Action put mechanism silently truncates files when
// the OVH SFTP session drops mid-session (a reproducible ~25s dead window
// hits the same files every run) and reports "failed" without retrying,
// leaving corrupted (truncated) files live on production. This script
// verifies and retries instead.

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

async function ensureRemoteDir(sftp, remoteDir, cache) {
	if (cache.has(remoteDir)) return;
	const parts = remoteDir.split('/').filter(Boolean);
	let path = '';
	for (const part of parts) {
		path += '/' + part;
		if (cache.has(path)) continue;
		if (!(await sftp.exists(path))) {
			await sftp.mkdir(path, true);
		}
		cache.add(path);
	}
}

async function main() {
	const localFiles = walk(LOCAL_ROOT);
	const files = localFiles.map((localPath) => {
		const rel = relative(LOCAL_ROOT, localPath).split(sep).join('/');
		return { localPath, remotePath: posix.join(REMOTE_ROOT, rel), size: statSync(localPath).size };
	});

	console.log(`Uploading ${files.length} files to ${HOST}:${REMOTE_ROOT}`);

	let sftp = await connect();
	const dirCache = new Set();
	const failed = [];

	for (let i = 0; i < files.length; i++) {
		const { localPath, remotePath, size } = files[i];
		const remoteDir = remotePath.slice(0, remotePath.lastIndexOf('/'));
		let ok = false;

		for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
			try {
				await ensureRemoteDir(sftp, remoteDir, dirCache);
				await sftp.put(localPath, remotePath);
				const remoteStat = await sftp.stat(remotePath);
				if (remoteStat.size === size) {
					ok = true;
					break;
				}
				console.log(
					`size mismatch ${remotePath} (local ${size}, remote ${remoteStat.size}), attempt ${attempt}/${MAX_ATTEMPTS}`,
				);
			} catch (err) {
				console.log(`error uploading ${remotePath} (attempt ${attempt}/${MAX_ATTEMPTS}): ${err.message}`);
			}

			// Reconnect before retrying — a broken session keeps failing instantly otherwise.
			try {
				await sftp.end();
			} catch {
				/* ignore */
			}
			await sleep(Math.min(1000 * 2 ** attempt, 15000));
			sftp = await connect();
			dirCache.clear();
		}

		if (!ok) failed.push(remotePath);
		if ((i + 1) % 50 === 0 || i === files.length - 1) {
			console.log(`progress: ${i + 1}/${files.length}`);
		}
	}

	await sftp.end();

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
