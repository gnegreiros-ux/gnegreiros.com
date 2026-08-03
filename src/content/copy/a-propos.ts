import type { Locale } from '../../i18n/ui';

export interface AProposCopy {
	trajectoryTitle: string;
	trajectoryBody1: string;
	trajectoryBody2: string;
	trajectorySteps: string[];
	builderTitle: string;
	builderBody: string;
	outsideBody: string;
}

const aProposCopy: Partial<Record<Locale, AProposCopy>> = {
	en: {
		trajectoryTitle: 'The trajectory',
		trajectoryBody1:
			"I started in 1997 designing print ads and logos in Brazil. By 2001, I was building websites by hand — HTML, CSS, one client at a time. Over two decades, that same instinct — build something that works, then figure out how to make it hold — carried me from graphic design, to web design, to UI, to UX, to what I do now: designing the systems and governance that keep design decisions consistent at scale.",
		trajectoryBody2: "It wasn't a pivot. Every step used what the last one taught me.",
		trajectorySteps: ['Graphic design', 'Web & UI', 'UX Design', 'Design Systems'],
		builderTitle: 'What "systems builder" actually means',
		builderBody:
			"I don't think of myself as someone who designs screens — I design the infrastructure that makes screens consistent, explainable, and durable over time: tokens, component architecture, decision governance, and the workflows that connect design to development. That's what colleagues have consistently pointed to when describing how I work — not as a designer producing artifacts, but as someone building the systems that let a team produce consistently, without reinventing the same decisions over and over.",
		outsideBody:
			"Trois-Rivières, Québec. Portuguese, French, and English. When I'm not working on design systems, I play drums at my church — a different kind of discipline: showing up, staying in time with other people, and trusting a structure you didn't build alone.",
	},
	fr: {
		trajectoryTitle: 'Le parcours',
		trajectoryBody1:
			"J'ai commencé en 1997 en concevant des publicités imprimées et des logos au Brésil. Dès 2001, je construisais des sites web à la main — HTML, CSS, un client à la fois. Sur plus de deux décennies, ce même instinct — construire quelque chose qui fonctionne, puis trouver comment le faire tenir — m'a mené du design graphique, au design web, à l'UI, à l'UX, jusqu'à ce que je fais maintenant : concevoir les systèmes et la gouvernance qui gardent les décisions de design cohérentes à grande échelle.",
		trajectoryBody2: "Ce n'était pas un virage. Chaque étape s'est appuyée sur ce que la précédente m'avait appris.",
		trajectorySteps: ['Design graphique', 'Web & UI', 'Design UX', 'Design Systems'],
		builderTitle: 'Ce que « bâtisseur de systèmes » veut vraiment dire',
		builderBody:
			"Je ne me vois pas comme quelqu'un qui conçoit des écrans — je conçois l'infrastructure qui rend les écrans cohérents, explicables et durables dans le temps : tokens, architecture de composants, gouvernance des décisions, et les processus qui relient le design au développement. C'est ce que mes collègues soulignent systématiquement quand ils décrivent ma façon de travailler — pas comme un designer qui produit des livrables, mais comme quelqu'un qui construit les systèmes permettant à une équipe de produire de façon cohérente, sans réinventer les mêmes décisions encore et encore.",
		outsideBody:
			"Trois-Rivières, Québec. Portugais, français et anglais. Quand je ne travaille pas sur des design systems, je joue de la batterie à mon église — une discipline différente : être présent, rester en rythme avec les autres, et faire confiance à une structure qu'on n'a pas bâtie seul.",
	},
};

export function getAProposCopy(locale: Locale): { copy: AProposCopy; contentLang: Locale } {
	const copy = aProposCopy[locale];
	if (copy) return { copy, contentLang: locale };
	return { copy: aProposCopy.en!, contentLang: 'en' };
}
