import type { Locale } from '../../i18n/ui';

export interface DtgenCopy {
	contextTitle: string;
	contextBody: string;
	whatTitle: string;
	whatBody: string;
	sourceTags: string[];
	colorSpaceTags: string[];
	whyTitle: string;
	whyBody: string;
	statusTitle: string;
	status: string[];
	liveBetaLabel: string;
}

const dtgenCopy: Partial<Record<Locale, DtgenCopy>> = {
	en: {
		contextTitle: 'Context / problem',
		contextBody:
			"Every new design system starts the same way — a designer manually defining color scales, spacing units, and type ratios, one value at a time, with no consistent method for deriving them. I built DTGen to remove that friction: a tool that generates a complete, structured token set from a small set of inputs, instead of hours of manual guesswork.",
		whatTitle: 'What it does',
		whatBody:
			"DTGen imports primitives from established sources — Tailwind, Ant Design, Open Color, or a custom JSON file — and generates coherent palettes in HSL, LCH, or OKLCH from a handful of base colors. It also configures typographic scales using custom ratios, and saves configurations for reuse across projects. The goal isn't to replace design judgment; it's to remove the repetitive part of the work so that judgment can focus on what actually matters — consistency and intent.",
		sourceTags: ['Tailwind', 'Ant Design', 'Open Color', 'Custom JSON'],
		colorSpaceTags: ['HSL', 'LCH', 'OKLCH'],
		whyTitle: 'Why it matters',
		whyBody:
			"DTGen reflects the same instinct behind Agentica, at a smaller scale: don't solve the same foundational problem twice. It's a practical tool built from a real recurring frustration, not a theoretical exercise.",
		statusTitle: 'Status / proof',
		status: [
			'Supports Tailwind, Ant Design, Open Color, and custom JSON imports',
			'Color generation in HSL, LCH, and OKLCH',
		],
		liveBetaLabel: 'Live beta',
	},
	fr: {
		contextTitle: 'Contexte / problème',
		contextBody:
			"Chaque nouveau design system commence de la même façon — un designer définit manuellement des échelles de couleurs, des unités d'espacement et des ratios typographiques, une valeur à la fois, sans méthode cohérente pour les dériver. J'ai construit DTGen pour éliminer cette friction : un outil qui génère un ensemble de tokens complet et structuré à partir d'un petit nombre d'entrées, au lieu d'heures de tâtonnement manuel.",
		whatTitle: 'Ce qu\'il fait',
		whatBody:
			"DTGen importe des primitives depuis des sources reconnues — Tailwind, Ant Design, Open Color, ou un fichier JSON personnalisé — et génère des palettes cohérentes en HSL, LCH ou OKLCH à partir d'une poignée de couleurs de base. Il configure aussi des échelles typographiques avec des ratios personnalisés, et sauvegarde les configurations pour les réutiliser d'un projet à l'autre. L'objectif n'est pas de remplacer le jugement du designer ; c'est d'éliminer la partie répétitive du travail pour que ce jugement se concentre sur ce qui compte vraiment — la cohérence et l'intention.",
		sourceTags: ['Tailwind', 'Ant Design', 'Open Color', 'JSON personnalisé'],
		colorSpaceTags: ['HSL', 'LCH', 'OKLCH'],
		whyTitle: "Pourquoi c'est important",
		whyBody:
			"DTGen reflète le même instinct que celui derrière Agentica, à plus petite échelle : ne pas résoudre deux fois le même problème fondamental. C'est un outil pratique né d'une vraie frustration récurrente, pas un exercice théorique.",
		statusTitle: 'Statut / preuve',
		status: [
			'Prend en charge les imports Tailwind, Ant Design, Open Color et JSON personnalisé',
			'Génération de couleurs en HSL, LCH et OKLCH',
		],
		liveBetaLabel: 'Bêta en ligne',
	},
};

export function getDtgenCopy(locale: Locale): { copy: DtgenCopy; contentLang: Locale } {
	const copy = dtgenCopy[locale];
	if (copy) return { copy, contentLang: locale };
	return { copy: dtgenCopy.en!, contentLang: 'en' };
}
