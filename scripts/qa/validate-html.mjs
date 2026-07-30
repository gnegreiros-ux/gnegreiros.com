// W3C HTML validation via the public Nu Html Checker API — no local Java
// runtime available on this machine, and the public service is free for
// occasional/local use. See instructions/CLAUDE EXECUTION PLAN — gnegreiros.md
// §9. Validates every file already in dist/, so run `npm run build` first.
import { readFileSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import path from 'node:path';

const DIST_DIR = new URL('../../dist/', import.meta.url);
const VALIDATOR_URL = 'https://validator.w3.org/nu/?out=json';
const DELAY_MS = 500; // be polite to the shared public service

async function findHtmlFiles(dir) {
	const entries = await readdir(dir, { withFileTypes: true });
	const files = [];
	for (const entry of entries) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			files.push(...(await findHtmlFiles(full)));
		} else if (entry.name.endsWith('.html')) {
			files.push(full);
		}
	}
	return files;
}

function sleep(ms) {
	return new Promise((r) => setTimeout(r, ms));
}

async function validateFile(filePath, attempt = 1) {
	const html = readFileSync(filePath, 'utf8');
	const res = await fetch(VALIDATOR_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'text/html; charset=utf-8',
			'User-Agent': 'gnegreiros.com-qa',
		},
		body: html,
	});
	if (res.status === 429 && attempt <= 3) {
		const backoffMs = 5000 * attempt;
		console.log(`    (rate limited, retrying in ${backoffMs / 1000}s...)`);
		await sleep(backoffMs);
		return validateFile(filePath, attempt + 1);
	}
	if (!res.ok) throw new Error(`Validator request failed (${res.status}) for ${filePath}`);
	const { messages } = await res.json();
	return messages.filter((m) => m.type === 'error');
}

async function main() {
	const distPath = path.resolve(DIST_DIR.pathname);
	const files = await findHtmlFiles(distPath);
	if (files.length === 0) {
		console.error('No HTML files found in dist/ — run `npm run build` first.');
		process.exit(1);
	}

	console.log(`Validating ${files.length} HTML file(s) against the W3C Nu Html Checker...\n`);

	let totalErrors = 0;
	for (const file of files) {
		const relPath = path.relative(distPath, file);
		const errors = await validateFile(file);
		if (errors.length === 0) {
			console.log(`  ✓ ${relPath}`);
		} else {
			totalErrors += errors.length;
			console.log(`  ✗ ${relPath} — ${errors.length} error(s)`);
			for (const err of errors) {
				console.log(`      L${err.lastLine ?? '?'}: ${err.message}`);
			}
		}
		await sleep(DELAY_MS);
	}

	console.log('');
	if (totalErrors > 0) {
		console.error(`✗ ${totalErrors} HTML validation error(s) across ${files.length} file(s).`);
		process.exit(1);
	}
	console.log(`✓ All ${files.length} file(s) are valid HTML.`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
