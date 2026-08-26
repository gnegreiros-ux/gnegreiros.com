#!/usr/bin/env node
// One-off: re-upload just the ~65 files known to still be broken (0 bytes)
// on production from yesterday's failed deploy attempts, instead of the
// full 887-file tree. Verifies size after upload, retries with reconnect.

import SftpClient from 'ssh2-sftp-client';
import { statSync, readFileSync } from 'node:fs';
import { posix } from 'node:path';

const HOST = process.env.OVH_SFTP_HOST;
const PORT = Number(process.env.OVH_SFTP_PORT || '22');
const USERNAME = process.env.OVH_SFTP_USER;
const PASSWORD = process.env.OVH_SFTP_PASSWORD;
const REMOTE_ROOT = process.env.OVH_SFTP_REMOTE_DIR.replace(/\/+$/, '');
const LOCAL_ROOT = 'dist';

const MAX_ATTEMPTS = 4;
const RETRY_PAUSE_MS = 15000;

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function connect() {
	const sftp = new SftpClient();
	await sftp.connect({ host: HOST, port: PORT, username: USERNAME, password: PASSWORD, retries: 0 });
	return sftp;
}

async function main() {
	const relPaths = readFileSync(process.argv[2], 'utf8')
		.split('\n')
		.map((l) => l.trim())
		.filter(Boolean);

	const files = relPaths.map((rel) => {
		const localPath = LOCAL_ROOT + rel;
		return { localPath, remotePath: posix.join(REMOTE_ROOT, rel), size: statSync(localPath).size };
	});

	console.log(`Targeted repair: ${files.length} files`);

	let sftp = await connect();
	const failed = [];

	for (const file of files) {
		let ok = false;
		for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
			try {
				await sftp.put(file.localPath, file.remotePath);
				const st = await sftp.stat(file.remotePath);
				if (st.size === file.size) {
					ok = true;
					console.log(`OK ${file.remotePath} (${file.size}B)`);
					break;
				}
				console.log(`mismatch ${file.remotePath}: local ${file.size} remote ${st.size}, attempt ${attempt}`);
			} catch (err) {
				console.log(`error ${file.remotePath}: ${err.message}, attempt ${attempt}`);
			}
			await sleep(RETRY_PAUSE_MS);
			try {
				await sftp.end();
			} catch {}
			sftp = await connect();
		}
		if (!ok) failed.push(file.remotePath);
	}

	await sftp.end();

	if (failed.length) {
		console.error(`STILL FAILED (${failed.length}):`);
		for (const f of failed) console.error(`  ${f}`);
		process.exit(1);
	}
	console.log('All targeted files fixed and verified.');
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
