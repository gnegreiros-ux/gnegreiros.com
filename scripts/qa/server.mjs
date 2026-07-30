import { spawn } from 'node:child_process';

// Pick a port well clear of Astro's own auto-increment range (4321, 4322,
// 4323, ...) so a manually-running `npm run dev`/`preview` never collides
// with QA runs.
const REQUESTED_PORT = 4949;

async function waitForServer(url, timeoutMs = 20000) {
	const start = Date.now();
	while (Date.now() - start < timeoutMs) {
		try {
			const res = await fetch(url);
			if (res.ok) return;
		} catch {
			// not up yet
		}
		await new Promise((r) => setTimeout(r, 250));
	}
	throw new Error(`Preview server did not respond at ${url} within ${timeoutMs}ms`);
}

export async function startPreviewServer() {
	const child = spawn('npx', ['astro', 'preview', '--port', String(REQUESTED_PORT)], {
		stdio: 'pipe',
		shell: process.platform === 'win32',
	});
	child.stderr.on('data', (chunk) => process.stderr.write(chunk));

	// Astro auto-increments past a busy port even when one is requested
	// explicitly — read the actual bound port back from its own stdout
	// rather than assuming REQUESTED_PORT was honored.
	const actualPort = await new Promise((resolve, reject) => {
		let buffer = '';
		const onData = (chunk) => {
			buffer += chunk.toString();
			const match = buffer.match(/localhost:(\d+)/);
			if (match) {
				child.stdout.off('data', onData);
				resolve(Number(match[1]));
			}
		};
		child.stdout.on('data', onData);
		child.once('exit', (code) => reject(new Error(`astro preview exited early (code ${code})`)));
		setTimeout(() => reject(new Error('Timed out waiting for astro preview to print its URL')), 20000);
	});

	const baseUrl = `http://localhost:${actualPort}`;
	await waitForServer(baseUrl);

	return {
		baseUrl,
		stop: () => child.kill(),
	};
}
