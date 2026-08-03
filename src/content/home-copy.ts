import type { Locale } from '../i18n/ui';

export interface HomeTeaser {
	slug: 'approche' | 'agentica' | 'dtgen';
	variant: 'entry' | 'default';
	eyebrow: string;
	title: string;
	body: string;
	linkLabel: string;
}

export interface AgenticaStats {
	tokenCount: number;
	adrCount: number;
	componentCount: number;
}

export interface HomeCopy {
	heroAnnotation: string;
	heroThesisLine1: string;
	heroThesisLine2Prefix: string;
	heroThesisAccent: string;
	footerYears: string;
	footerLine: string;
	transitionText: string;
	teasers: (stats: AgenticaStats) => HomeTeaser[];
	contextEyebrow: string;
	contextTitle: string;
	contextBody: string;
	contextLinkLabel: string;
	finalCtaBody: string;
	finalCtaLinkLabel: string;
}

export const homeCopy: Partial<Record<Locale, HomeCopy>> = {
	en: {
		heroAnnotation: 'UX Systems Designer / Systems Builder',
		heroThesisLine1: 'I design the decision systems that hold digital experiences together —',
		heroThesisLine2Prefix: 'for the humans who decide, and now for the ',
		heroThesisAccent: 'AI agents who execute',
		footerYears: '20+ years',
		footerLine: 'Design → Systems → Governance',
		transitionText:
			"Over 20 years, that means moving from screens to the infrastructure behind them — tokens, governance, and the workflows that keep decisions consistent long after the people who made them have moved on.",
		teasers: (stats) => [
			{
				slug: 'approche',
				variant: 'entry',
				eyebrow: 'Approach',
				title: 'How I think about design systems',
				body: "Design systems don't fail because people are careless — they fail because nothing preserves the reasoning behind what was built.",
				linkLabel: 'Read the approach',
			},
			{
				slug: 'agentica',
				variant: 'default',
				eyebrow: 'Agentica',
				title: 'Agentica — proof at scale',
				body: `${stats.tokenCount}+ tokens. ${stats.adrCount}+ versioned decisions. ${stats.componentCount} components shipped, more in progress. A personal system built to test a governance model most enterprise design systems are missing.`,
				linkLabel: 'Explore Agentica',
			},
			{
				slug: 'dtgen',
				variant: 'default',
				eyebrow: 'DTGen',
				title: 'DTGen — proof in practice',
				body: "A tool built from a real recurring frustration: generating a coherent token set shouldn't mean starting from a blank page every time.",
				linkLabel: 'See DTGen',
			},
		],
		contextEyebrow: 'Journey',
		contextTitle: 'Tested inside real organizations',
		contextBody:
			"Public health, insurance, manufacturing — this thinking has been shaped under real regulatory and technical constraints, not just in personal projects.",
		contextLinkLabel: 'See the context',
		finalCtaBody:
			"If you're evaluating how to make design decisions durable in your organization, I'd be glad to talk through what that looks like.",
		finalCtaLinkLabel: "Let's talk",
	},
	fr: {
		heroAnnotation: 'Designer de systèmes UX / Bâtisseur de systèmes',
		heroThesisLine1: 'Je conçois les systèmes de décision qui font tenir les expériences numériques —',
		heroThesisLine2Prefix: 'pour les humains qui décident, et maintenant pour les ',
		heroThesisAccent: 'agents IA qui exécutent',
		footerYears: '20+ ans',
		footerLine: 'Design → Systèmes → Gouvernance',
		transitionText:
			"Sur plus de 20 ans, ça veut dire passer des écrans à l'infrastructure derrière eux — tokens, gouvernance, et les processus qui gardent les décisions cohérentes longtemps après le départ des personnes qui les ont prises.",
		teasers: (stats) => [
			{
				slug: 'approche',
				variant: 'entry',
				eyebrow: 'Approche',
				title: 'Comment je pense les design systems',
				body: "Les design systems n'échouent pas parce que les gens sont négligents — ils échouent parce que rien ne préserve le raisonnement derrière ce qui a été construit.",
				linkLabel: "Lire l'approche",
			},
			{
				slug: 'agentica',
				variant: 'default',
				eyebrow: 'Agentica',
				title: 'Agentica — la preuve à grande échelle',
				body: `${stats.tokenCount}+ tokens. ${stats.adrCount}+ décisions versionnées. ${stats.componentCount} composants livrés, d'autres en cours. Un système personnel conçu pour tester un modèle de gouvernance qui manque à la plupart des design systems d'entreprise.`,
				linkLabel: 'Explorer Agentica',
			},
			{
				slug: 'dtgen',
				variant: 'default',
				eyebrow: 'DTGen',
				title: 'DTGen — la preuve en pratique',
				body: "Un outil né d'une vraie frustration récurrente : générer un ensemble de tokens cohérent ne devrait pas vouloir dire repartir de zéro à chaque fois.",
				linkLabel: 'Voir DTGen',
			},
		],
		contextEyebrow: 'Parcours',
		contextTitle: 'Éprouvé dans de vraies organisations',
		contextBody:
			"Santé publique, assurance, manufacturier — cette réflexion s'est construite sous de vraies contraintes réglementaires et techniques, pas seulement sur des projets personnels.",
		contextLinkLabel: 'Voir le contexte',
		finalCtaBody:
			'Si vous évaluez comment rendre les décisions de design durables dans votre organisation, ce sera un plaisir d’en discuter.',
		finalCtaLinkLabel: 'Parlons-en',
	},
};

export function getHomeCopy(locale: Locale): { copy: HomeCopy; contentLang: Locale } {
	const copy = homeCopy[locale];
	if (copy) return { copy, contentLang: locale };
	return { copy: homeCopy.en!, contentLang: 'en' };
}
