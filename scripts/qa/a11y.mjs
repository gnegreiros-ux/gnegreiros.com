// WCAG 2.1 AA accessibility audit via axe-core, run against every canonical
// EN route. See instructions/CLAUDE EXECUTION PLAN — gnegreiros.md §9.
import { readFileSync } from 'node:fs';
import puppeteer from 'puppeteer-core';
import { Launcher } from 'chrome-launcher';
import { startPreviewServer } from './server.mjs';
import { ROUTES } from './routes.mjs';

const AXE_SOURCE = readFileSync(new URL('../../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');

function findChrome() {
	const installations = Launcher.getInstallations();
	if (installations.length === 0) {
		throw new Error('No local Chrome/Chromium installation found — install Google Chrome to run this check.');
	}
	return installations[0];
}

async function auditRoute(browser, baseUrl, route) {
	const page = await browser.newPage();
	await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle0' });
	await page.evaluate(AXE_SOURCE);
	const results = await page.evaluate(async () => {
		return await window.axe.run(document, {
			runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
		});
	});
	await page.close();
	return results.violations;
}

async function main() {
	const server = await startPreviewServer();
	const browser = await puppeteer.launch({ executablePath: findChrome(), headless: true });

	let totalViolations = 0;
	try {
		for (const route of ROUTES) {
			const violations = await auditRoute(browser, server.baseUrl, route);
			if (violations.length === 0) {
				console.log(`  ✓ ${route}`);
			} else {
				totalViolations += violations.length;
				console.log(`  ✗ ${route} — ${violations.length} violation(s)`);
				for (const v of violations) {
					console.log(`      [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node(s))`);
				}
			}
		}
	} finally {
		await browser.close();
		server.stop();
	}

	console.log('');
	if (totalViolations > 0) {
		console.error(`✗ ${totalViolations} accessibility violation(s) across ${ROUTES.length} route(s).`);
		process.exit(1);
	}
	console.log(`✓ No WCAG 2.1 AA violations across ${ROUTES.length} route(s).`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
