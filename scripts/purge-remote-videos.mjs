#!/usr/bin/env node
// One-off: delete the ~850MB of .mp4 files already sitting under
// gaspesie/fotos on the OVH server. The account's SFTP quota is 1GB and
// gaspesie alone (video + photos) exceeds it, which is why every write —
// even a few-KB CSS file — has been failing (0-byte file, then "Write
// stream error: Failure"). Freeing the video bytes lets the rest of the
// site deploy again. The videos stay safe in git/local dist/; deploy-sftp.mjs
// no longer uploads *.mp4 until a proper video host is chosen.

import SftpClient from 'ssh2-sftp-client';
import { readdirSync, statSync } from 'node:fs';
import { join, relative, posix, sep } from 'node:path';

const HOST = process.env.OVH_SFTP_HOST;
const PORT = Number(process.env.OVH_SFTP_PORT || '22');
const USERNAME = process.env.OVH_SFTP_USER;
const PASSWORD = process.env.OVH_SFTP_PASSWORD;
const REMOTE_ROOT = process.env.OVH_SFTP_REMOTE_DIR.replace(/\/+$/, '');
const LOCAL_ROOT = 'dist';

function walk(dir) {
	const out = [];
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const full = join(dir, entry.name);
		if (entry.isDirectory()) out.push(...walk(full));
		else out.push(full);
	}
	return out;
}

async function main() {
	const mp4RemotePaths = walk(LOCAL_ROOT)
		.filter((p) => p.toLowerCase().endsWith('.mp4'))
		.map((localPath) => {
			const rel = relative(LOCAL_ROOT, localPath).split(sep).join('/');
			return posix.join(REMOTE_ROOT, rel);
		});

	console.log(`Deleting ${mp4RemotePaths.length} remote .mp4 file(s) to free quota...`);

	const sftp = new SftpClient();
	await sftp.connect({ host: HOST, port: PORT, username: USERNAME, password: PASSWORD, retries: 0 });

	let deleted = 0;
	let missing = 0;
	for (const remotePath of mp4RemotePaths) {
		try {
			if (await sftp.exists(remotePath)) {
				await sftp.delete(remotePath);
				deleted++;
			} else {
				missing++;
			}
		} catch (err) {
			console.log(`could not delete ${remotePath}: ${err.message}`);
		}
	}

	await sftp.end();
	console.log(`Deleted ${deleted} file(s), ${missing} already absent.`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
