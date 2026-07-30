// Performance audit via Lighthouse, checked against the plan's explicit
// targets (instructions/CLAUDE EXECUTION PLAN — gnegreiros.md §9):
// LCP < 2.5s, CLS < 0.1, INP < 200ms. Lighthouse is a lab tool and can't
// measure real INP (that needs field/CrUX data) — Total Blocking Time is
// the closest lab proxy for input responsiveness, checked as a soft
// (warn-only) signal against the same 200ms figure rather than a hard gate.
import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { startPreviewServer } from './server.mjs';
import { ROUTES } from './routes.mjs';

const THRESHOLDS = {
	lcpMs: 2500,
	cls: 0.1,
	tbtMs: 200, // soft — see header note
};

async function auditRoute(port, baseUrl, route) {
	const runnerResult = await lighthouse(`${baseUrl}${route}`, {
		port,
		output: 'json',
		logLevel: 'error',
		onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
	});
	const { audits, categories } = runnerResult.lhr;
	return {
		route,
		scores: {
			performance: categories.performance.score,
			accessibility: categories.accessibility.score,
			bestPractices: categories['best-practices'].score,
			seo: categories.seo.score,
		},
		lcpMs: audits['largest-contentful-paint'].numericValue,
		cls: audits['cumulative-layout-shift'].numericValue,
		tbtMs: audits['total-blocking-time'].numericValue,
	};
}

function pct(score) {
	return `${Math.round(score * 100)}`;
}

async function main() {
	const server = await startPreviewServer();
	const chrome = await launch({ chromeFlags: ['--headless=new'] });

	let hardFailures = 0;
	const softWarnings = [];

	try {
		for (const route of ROUTES) {
			const result = await auditRoute(chrome.port, server.baseUrl, route);
			const lcpOk = result.lcpMs < THRESHOLDS.lcpMs;
			const clsOk = result.cls < THRESHOLDS.cls;
			const tbtOk = result.tbtMs < THRESHOLDS.tbtMs;

			console.log(`\n${route === '/' ? '/ (home)' : route}`);
			console.log(
				`  scores — perf ${pct(result.scores.performance)}  a11y ${pct(result.scores.accessibility)}  best-practices ${pct(result.scores.bestPractices)}  seo ${pct(result.scores.seo)}`,
			);
			console.log(
				`  ${lcpOk ? '✓' : '✗'} LCP ${(result.lcpMs / 1000).toFixed(2)}s (target < ${THRESHOLDS.lcpMs / 1000}s)`,
			);
			console.log(`  ${clsOk ? '✓' : '✗'} CLS ${result.cls.toFixed(3)} (target < ${THRESHOLDS.cls})`);
			console.log(
				`  ${tbtOk ? '✓' : '⚠'} TBT ${Math.round(result.tbtMs)}ms (INP proxy, target < ${THRESHOLDS.tbtMs}ms)`,
			);

			if (!lcpOk || !clsOk) hardFailures++;
			if (!tbtOk) softWarnings.push(route);
		}
	} finally {
		chrome.kill();
		server.stop();
	}

	console.log('');
	if (softWarnings.length > 0) {
		console.warn(`⚠ TBT (INP proxy) above target on: ${softWarnings.join(', ')} — not a hard failure.`);
	}
	if (hardFailures > 0) {
		console.error(`✗ LCP/CLS target(s) missed on ${hardFailures} route(s).`);
		process.exit(1);
	}
	console.log(`✓ LCP and CLS within target on all ${ROUTES.length} route(s).`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
