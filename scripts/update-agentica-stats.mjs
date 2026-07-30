#!/usr/bin/env node
// Refreshes src/data/agentica-stats.json from the live GitHub repo — the
// source of truth for the numbers shown on Home and the Agentica page
// (see instructions/CLAUDE EXECUTION PLAN — gnegreiros.md §8).
//
// Run only from the monthly scheduled workflow
// (.github/workflows/update-agentica-stats.yml), never at site-build time —
// astro build/dev read the committed JSON file, no network call. Guilherme
// confirmed on 2026-07-30 this must stay a monthly cadence, not per-build.
//
// Usage: node scripts/update-agentica-stats.mjs
// Optional env: GITHUB_TOKEN — raises the REST rate limit from 60/hr to 5,000/hr.

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const REPO = 'gnegreiros-ux/agentica-design-system';
const BRANCH = 'main';
const TOKEN_FILES = ['primitives.json', 'semantic.json', 'semantic.dark.json', 'component.json'];
const OUTPUT_PATH = fileURLToPath(new URL('../src/data/agentica-stats.json', import.meta.url));

function roundDownTo(value, step) {
	return Math.floor(value / step) * step;
}

function githubHeaders() {
	const headers = {
		'User-Agent': 'gnegreiros.com-build',
		Accept: 'application/vnd.github+json',
	};
	if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
	return headers;
}

// DTCG token tree: a node is a leaf token once it has a `$value`; any other
// key starting with `$` is metadata to skip. Mirrors extractTokenKeys() in
// the design system's own scripts/audit-tokens.js — same source of truth.
function countTokenLeaves(node) {
	if (typeof node !== 'object' || node === null) return 0;
	let count = 0;
	for (const [key, value] of Object.entries(node)) {
		if (key.startsWith('$')) continue;
		if (typeof value === 'object' && value !== null && '$value' in value) {
			count += 1;
		} else {
			count += countTokenLeaves(value);
		}
	}
	return count;
}

async function fetchTokenCount() {
	const files = await Promise.all(
		TOKEN_FILES.map(async (file) => {
			const url = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/tokens/${file}`;
			const res = await fetch(url);
			if (!res.ok) throw new Error(`Agentica tokens fetch failed: ${file} (${res.status})`);
			return res.json();
		}),
	);
	return files.reduce((total, tree) => total + countTokenLeaves(tree), 0);
}

async function fetchAdrAndComponentCounts() {
	const url = `https://api.github.com/repos/${REPO}/git/trees/${BRANCH}?recursive=1`;
	const res = await fetch(url, { headers: githubHeaders() });
	if (!res.ok) throw new Error(`Agentica repo tree fetch failed (${res.status})`);
	const { tree } = await res.json();

	const adrCount = tree.filter(
		(item) => item.type === 'blob' && /^decisions\/ADR-\d+.*\.md$/.test(item.path),
	).length;

	const componentCount = tree.filter(
		(item) =>
			item.type === 'blob' && /^components\/agtc-.*\.js$/.test(item.path) && !item.path.endsWith('.stories.js'),
	).length;

	return { adrCount, componentCount };
}

async function main() {
	const [tokenCount, { adrCount, componentCount }] = await Promise.all([
		fetchTokenCount(),
		fetchAdrAndComponentCounts(),
	]);

	const stats = {
		tokenCount: roundDownTo(tokenCount, 50),
		adrCount: roundDownTo(adrCount, 10),
		componentCount,
		updatedAt: new Date().toISOString(),
	};

	writeFileSync(OUTPUT_PATH, `${JSON.stringify(stats, null, '\t')}\n`);
	console.log(`Wrote ${OUTPUT_PATH}`);
	console.log(stats);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
