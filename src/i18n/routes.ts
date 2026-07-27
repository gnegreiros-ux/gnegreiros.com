import { defaultLang, type Locale } from './ui';

// Slugs match the routes locked in `instructions/Portfolio Gnegreiros Phase 1.md`.
// 'home' is special-cased to the locale root ('/', '/fr', '/pt-br').
export const SLUGS = [
	'home',
	'approche',
	'agentica',
	'dtgen',
	'parcours',
	'a-propos',
	'contact',
] as const;

export type Slug = (typeof SLUGS)[number];

export function getLocalizedPath(locale: Locale, slug: Slug): string {
	const prefix = locale === defaultLang ? '' : `/${locale}`;
	if (slug === 'home') return prefix === '' ? '/' : prefix;
	return `${prefix}/${slug}`;
}

export function getContentId(locale: Locale, slug: Slug): string {
	return `${locale}/${slug}`;
}
