// Agentica metrics, computed at build time from the source of truth —
// see instructions/CLAUDE EXECUTION PLAN — gnegreiros.md §8: these numbers
// must never be hand-authored, always read from the GitHub repo.
const REPO = 'gnegreiros-ux/agentica-design-system';
const BRANCH = 'main';
const TOKEN_FILES = ['primitives.json', 'semantic.json', 'semantic.dark.json', 'component.json'];

export interface AgenticaStats {
	/** Rounded down to the nearest 50, e.g. 869 real tokens → "850+". */
	tokenCount: number;
	/** Rounded down to the nearest 10, e.g. 75 real ADRs → "70+". */
	adrCount: number;
	/** Exact — small enough to state plainly. */
	componentCount: number;
}

const CACHE_TTL_MS = 60 * 60 * 1000;
let cache: { data: AgenticaStats; timestamp: number } | null = null;

function roundDownTo(value: number, step: number): number {
	return Math.floor(value / step) * step;
}

function githubHeaders(): HeadersInit {
	const headers: HeadersInit = {
		'User-Agent': 'gnegreiros.com-build',
		Accept: 'application/vnd.github+json',
	};
	const token = import.meta.env.GITHUB_TOKEN;
	if (token) headers.Authorization = `Bearer ${token}`;
	return headers;
}

// DTCG token tree: a node is a leaf token once it has a `$value`; any other
// key starting with `$` is metadata to skip. Mirrors extractTokenKeys() in
// the design system's own scripts/audit-tokens.js — same source of truth.
function countTokenLeaves(node: unknown): number {
	if (typeof node !== 'object' || node === null) return 0;
	let count = 0;
	for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
		if (key.startsWith('$')) continue;
		if (typeof value === 'object' && value !== null && '$value' in value) {
			count += 1;
		} else {
			count += countTokenLeaves(value);
		}
	}
	return count;
}

async function fetchTokenCount(): Promise<number> {
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

async function fetchAdrAndComponentCounts(): Promise<{ adrCount: number; componentCount: number }> {
	const url = `https://api.github.com/repos/${REPO}/git/trees/${BRANCH}?recursive=1`;
	const res = await fetch(url, { headers: githubHeaders() });
	if (!res.ok) throw new Error(`Agentica repo tree fetch failed (${res.status})`);
	const { tree } = (await res.json()) as { tree: { path: string; type: string }[] };

	const adrCount = tree.filter(
		(item) => item.type === 'blob' && /^decisions\/ADR-\d+.*\.md$/.test(item.path),
	).length;

	const componentCount = tree.filter(
		(item) =>
			item.type === 'blob' && /^components\/agtc-.*\.js$/.test(item.path) && !item.path.endsWith('.stories.js'),
	).length;

	return { adrCount, componentCount };
}

async function fetchAgenticaStats(): Promise<AgenticaStats> {
	const [tokenCount, { adrCount, componentCount }] = await Promise.all([
		fetchTokenCount(),
		fetchAdrAndComponentCounts(),
	]);

	return {
		tokenCount: roundDownTo(tokenCount, 50),
		adrCount: roundDownTo(adrCount, 10),
		componentCount,
	};
}

export async function getAgenticaStats(): Promise<AgenticaStats> {
	if (cache && Date.now() - cache.timestamp < CACHE_TTL_MS) {
		return cache.data;
	}
	try {
		const data = await fetchAgenticaStats();
		cache = { data, timestamp: Date.now() };
		return data;
	} catch (err) {
		if (cache) {
			console.warn(`[agentica] Live fetch failed, serving stale cache: ${(err as Error).message}`);
			return cache.data;
		}
		throw err;
	}
}
