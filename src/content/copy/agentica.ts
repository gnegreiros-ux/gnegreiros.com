import type { Locale } from '../../i18n/ui';

export interface AgenticaStats {
	tokenCount: number;
	adrCount: number;
	componentCount: number;
}

export interface AgenticaCopy {
	contextTitle: string;
	contextBody: string;
	governanceTitle: string;
	governanceBody1: string;
	governanceBody2: string;
	flowSteps: string[];
	architectureTitle: string;
	architectureBody: string;
	architectureTags: { label: string; icon?: 'w3c' }[];
	resultsTitle: string;
	results: (stats: AgenticaStats) => string[];
	resultLinks: { label: string; href: string; icon: 'laptop' | 'github' | 'storybook' }[];
}

const resultLinks: AgenticaCopy['resultLinks'] = [
	{ label: 'GitHub', href: 'https://github.com/gnegreiros-ux/agentica-design-system', icon: 'github' },
	{ label: 'Storybook', href: 'https://main--6a1c1e665ec5fe8fc0540983.chromatic.com/', icon: 'storybook' },
];

const agenticaCopy: Partial<Record<Locale, AgenticaCopy>> = {
	en: {
		contextTitle: 'Context / problem',
		contextBody:
			"Most design systems document what was built. Few preserve why. Teams lose decisions in Figma comments, Slack threads, and tribal knowledge, so the same debates repeat, documentation drifts out of date, and the system becomes dependent on the one person who remembers the reasoning. I built Agentica to test whether that problem is solvable, not for a client, but as proof of a governance model I believe enterprise design systems are missing.",
		governanceTitle: 'Decisions & governance',
		governanceBody1:
			"Every meaningful choice in Agentica is logged as a versioned Architecture Decision Record, context, alternatives considered, trade-offs, and the reasoning behind the final call. This isn't documentation after the fact; it's the mechanism that lets the system evolve without erasing its own history.",
		governanceBody2:
			'Agentica is also built with AI agents as a defined actor in the system, with an explicit boundary. Agents can detect inconsistencies, propose components, and draft documentation. They cannot approve, deploy, or bypass governance. The human keeps the final word, by design, not by convention.',
		flowSteps: ['Decide', 'Govern', 'Systematize', 'Execute'],
		architectureTitle: 'Architecture',
		architectureBody:
			'One source of truth feeds four levels: foundations (tokens), semantic contracts, components, and applications. Components are built as native Web Components, framework-independent, compiled to CSS, JS, Tailwind, Angular, iOS, and Android targets. If the AI tooling around it disappeared tomorrow, the system would keep running: documented, scripted, and tested to prove it.',
		architectureTags: [
			{ label: 'Web Components' },
			{ label: 'Design Tokens' },
			{ label: 'W3C Standards', icon: 'w3c' },
			{ label: 'Versioned ADRs' },
		],
		resultsTitle: 'Result / proof',
		results: (stats) => [
			`${stats.tokenCount}+ design tokens across light and dark modes`,
			`${stats.componentCount} components shipped, with more in active development`,
			`${stats.adrCount}+ ADRs capturing the reasoning behind every major decision`,
			'Automated quality gates for accessibility (WCAG 2.1), visual regression, documentation, and token consistency',
		],
		resultLinks: [
			{ label: 'Live site', href: 'https://designsystem.gnegreiros.com', icon: 'laptop' },
			...resultLinks,
		],
	},
	fr: {
		contextTitle: 'Contexte / problème',
		contextBody:
			"La plupart des design systems documentent ce qui a été construit. Peu préservent le pourquoi. Les équipes perdent leurs décisions dans des commentaires Figma, des fils Slack et le savoir tacite, alors les mêmes débats se répètent, la documentation devient obsolète, et le système devient dépendant de la seule personne qui se souvient du raisonnement. J'ai construit Agentica pour tester si ce problème est solvable, pas pour un client, mais comme preuve d'un modèle de gouvernance qui manque, selon moi, à la plupart des design systems d'entreprise.",
		governanceTitle: 'Décisions et gouvernance',
		governanceBody1:
			"Chaque choix significatif dans Agentica est consigné comme un Architecture Decision Record versionné, contexte, alternatives considérées, compromis, et le raisonnement derrière la décision finale. Ce n'est pas de la documentation après coup ; c'est le mécanisme qui permet au système d'évoluer sans effacer sa propre histoire.",
		governanceBody2:
			"Agentica est aussi construit avec les agents IA comme acteur défini du système, avec une limite explicite. Les agents peuvent détecter des incohérences, proposer des composants et rédiger de la documentation. Ils ne peuvent pas approuver, déployer, ou contourner la gouvernance. L'humain garde le dernier mot, par design, pas par convention.",
		flowSteps: ['Décider', 'Gouverner', 'Systématiser', 'Exécuter'],
		architectureTitle: 'Architecture',
		architectureBody:
			"Une seule source de vérité alimente quatre niveaux : fondations (tokens), contrats sémantiques, composants et applications. Les composants sont construits en Web Components natifs, indépendants du framework, compilés vers CSS, JS, Tailwind, Angular, iOS et Android. Si l'outillage IA autour disparaissait demain, le système continuerait de fonctionner : documenté, scripté et testé pour le prouver.",
		architectureTags: [
			{ label: 'Web Components' },
			{ label: 'Design Tokens' },
			{ label: 'Standards W3C', icon: 'w3c' },
			{ label: 'ADR versionnés' },
		],
		resultsTitle: 'Résultat / preuve',
		results: (stats) => [
			`${stats.tokenCount}+ tokens de design en mode clair et sombre`,
			`${stats.componentCount} composants livrés, d'autres en développement actif`,
			`${stats.adrCount}+ ADR capturant le raisonnement derrière chaque décision majeure`,
			"Portes de qualité automatisées pour l'accessibilité (WCAG 2.1), la régression visuelle, la documentation et la cohérence des tokens",
		],
		resultLinks: [
			{ label: 'Site en ligne', href: 'https://designsystem.gnegreiros.com', icon: 'laptop' },
			...resultLinks,
		],
	},
	'pt-br': {
		contextTitle: 'Contexto / problema',
		contextBody:
			'A maioria dos design systems documenta o que foi construído. Poucos preservam o porquê. As equipes perdem decisões em comentários do Figma, threads do Slack e conhecimento tácito, então os mesmos debates se repetem, a documentação fica desatualizada, e o sistema se torna dependente da única pessoa que se lembra do raciocínio. Eu construí a Agentica para testar se esse problema é solucionável, não para um cliente, mas como prova de um modelo de governança que, na minha opinião, falta na maioria dos design systems corporativos.',
		governanceTitle: 'Decisões e governança',
		governanceBody1:
			'Cada escolha significativa na Agentica é registrada como um Architecture Decision Record versionado, contexto, alternativas consideradas, trade-offs e o raciocínio por trás da decisão final. Isso não é documentação feita depois; é o mecanismo que permite ao sistema evoluir sem apagar sua própria história.',
		governanceBody2:
			'A Agentica também é construída com agentes de AI como um ator definido no sistema, com um limite explícito. Os agentes podem detectar inconsistências, propor componentes e redigir documentação. Eles não podem aprovar, implantar ou contornar a governança. O humano mantém a palavra final, por design, não por convenção.',
		flowSteps: ['Decidir', 'Governar', 'Sistematizar', 'Executar'],
		architectureTitle: 'Arquitetura',
		architectureBody:
			'Uma única fonte de verdade alimenta quatro níveis: fundações (tokens), contratos semânticos, componentes e aplicações. Os componentes são construídos como Web Components nativos, independentes de framework, compilados para CSS, JS, Tailwind, Angular, iOS e Android. Se o ferramental de AI ao redor desaparecesse amanhã, o sistema continuaria funcionando: documentado, com scripts e testado para provar isso.',
		architectureTags: [
			{ label: 'Web Components' },
			{ label: 'Design Tokens' },
			{ label: 'Padrões W3C', icon: 'w3c' },
			{ label: 'ADRs versionados' },
		],
		resultsTitle: 'Resultado / prova',
		results: (stats) => [
			`${stats.tokenCount}+ tokens de design nos modos claro e escuro`,
			`${stats.componentCount} componentes entregues, com mais em desenvolvimento ativo`,
			`${stats.adrCount}+ ADRs capturando o raciocínio por trás de cada decisão importante`,
			'Portões de qualidade automatizados para acessibilidade (WCAG 2.1), regressão visual, documentação e consistência de tokens',
		],
		resultLinks: [
			{ label: 'Site ao vivo', href: 'https://designsystem.gnegreiros.com', icon: 'laptop' },
			...resultLinks,
		],
	},
};

export function getAgenticaCopy(locale: Locale): { copy: AgenticaCopy; contentLang: Locale } {
	const copy = agenticaCopy[locale];
	if (copy) return { copy, contentLang: locale };
	return { copy: agenticaCopy.en!, contentLang: 'en' };
}
