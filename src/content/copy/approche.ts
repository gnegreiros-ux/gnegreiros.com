import type { Locale } from '../../i18n/ui';

export interface ApprocheCopy {
	problemTitle: string;
	problemBody: string;
	principlesTitle: string;
	principlesIntro: string;
	principles: { number: string; title: string; body: string }[];
	practiceTitle: string;
	practiceBody: string;
	aiTitle: string;
	aiBody: string;
}

const approcheCopy: Partial<Record<Locale, ApprocheCopy>> = {
	en: {
		problemTitle: 'The problem I keep solving',
		problemBody:
			"Across public health platforms, insurance systems, and manufacturing tools, I've seen the same failure repeat: design decisions get made once, then forgotten. A color changes without anyone remembering why the original one was chosen. A component gets rebuilt three times because nobody knew it already existed. The system doesn't fail because people are careless — it fails because nothing preserves the reasoning behind what was built.",
		principlesTitle: 'What I actually optimize for',
		principlesIntro:
			"My work sits at the intersection of design, development, and operations — what's often called DesignOps. Three principles guide it:",
		principles: [
			{
				number: '01',
				title: 'Decisions need memory.',
				body: "A design system isn't a component library; it's a record of trade-offs. If you can't explain why a decision was made, you can't safely change it later.",
			},
			{
				number: '02',
				title: 'Workflows are part of the design.',
				body: 'The handoff between design and development is where most systems quietly break down. I treat that pipeline — not just the interface — as something to be designed deliberately.',
			},
			{
				number: '03',
				title: 'Durability beats novelty.',
				body: 'Tools and frameworks turn over every few years. A system built to depend on one tool is a system with an expiration date. I build for standards that outlast the tooling around them.',
			},
		],
		practiceTitle: 'How this shows up in practice',
		practiceBody:
			"At RAMQ, this means building UX foundations for an organization before building screens. At Akinox, it meant designing the pipeline between design and development, not just the interface on top of it. In Agentica, my personal system, it means every meaningful decision is logged, versioned, and traceable — proof that this approach scales beyond a single project.",
		aiTitle: 'Where AI fits',
		aiBody:
			"AI agents can accelerate parts of this work — detecting inconsistencies, drafting documentation, proposing components. What they can't do is decide. Governance stays human, by design. My approach to AI in design systems isn't about automation for its own sake; it's about making sure automation never outruns accountability.",
	},
	fr: {
		problemTitle: 'Le problème que je résous sans cesse',
		problemBody:
			"À travers des plateformes de santé publique, des systèmes d'assurance et des outils manufacturiers, j'ai vu le même échec se répéter : les décisions de design sont prises une fois, puis oubliées. Une couleur change sans que personne ne se souvienne pourquoi l'originale avait été choisie. Un composant est reconstruit trois fois parce que personne ne savait qu'il existait déjà. Le système n'échoue pas parce que les gens sont négligents — il échoue parce que rien ne préserve le raisonnement derrière ce qui a été construit.",
		principlesTitle: "Ce que j'optimise réellement",
		principlesIntro:
			"Mon travail se situe à l'intersection du design, du développement et des opérations — ce qu'on appelle souvent le DesignOps. Trois principes le guident :",
		principles: [
			{
				number: '01',
				title: 'Les décisions ont besoin de mémoire.',
				body: "Un design system n'est pas une bibliothèque de composants ; c'est un registre de compromis. Si vous ne pouvez pas expliquer pourquoi une décision a été prise, vous ne pouvez pas la modifier en toute sécurité plus tard.",
			},
			{
				number: '02',
				title: 'Les processus font partie du design.',
				body: "Le passage de relais entre le design et le développement, c'est là où la plupart des systèmes s'effondrent en silence. Je traite ce pipeline — pas seulement l'interface — comme quelque chose à concevoir délibérément.",
			},
			{
				number: '03',
				title: 'La durabilité prime sur la nouveauté.',
				body: "Les outils et les frameworks se renouvellent tous les quelques années. Un système conçu pour dépendre d'un seul outil est un système avec une date d'expiration. Je construis pour des standards qui survivent aux outils qui les entourent.",
			},
		],
		practiceTitle: 'Comment ça se traduit en pratique',
		practiceBody:
			"Chez la RAMQ, ça veut dire construire les fondations UX d'une organisation avant de construire des écrans. Chez Akinox, ça voulait dire concevoir le pipeline entre le design et le développement, pas seulement l'interface qui le recouvre. Dans Agentica, mon système personnel, ça veut dire que chaque décision significative est consignée, versionnée et traçable — la preuve que cette approche fonctionne au-delà d'un seul projet.",
		aiTitle: "La place de l'IA",
		aiBody:
			"Les agents IA peuvent accélérer certaines parties de ce travail — détecter des incohérences, rédiger de la documentation, proposer des composants. Ce qu'ils ne peuvent pas faire, c'est décider. La gouvernance reste humaine, par design. Mon approche de l'IA dans les design systems n'est pas une question d'automatisation pour elle-même ; c'est de s'assurer que l'automatisation ne dépasse jamais la responsabilité.",
	},
	'pt-br': {
		problemTitle: 'O problema que eu continuo resolvendo',
		problemBody:
			'Em plataformas de saúde pública, sistemas de seguros e ferramentas de manufatura, eu vi a mesma falha se repetir: as decisões de design são tomadas uma vez, depois esquecidas. Uma cor muda sem que ninguém se lembre por que a original foi escolhida. Um componente é reconstruído três vezes porque ninguém sabia que ele já existia. O sistema não falha porque as pessoas são negligentes — ele falha porque nada preserva o raciocínio por trás do que foi construído.',
		principlesTitle: 'O que eu realmente otimizo',
		principlesIntro:
			'Meu trabalho está na interseção entre design, desenvolvimento e operações — o que costuma ser chamado de DesignOps. Três princípios o orientam:',
		principles: [
			{
				number: '01',
				title: 'Decisões precisam de memória.',
				body: 'Um design system não é uma biblioteca de componentes; é um registro de compromissos (trade-offs). Se você não consegue explicar por que uma decisão foi tomada, não pode alterá-la com segurança depois.',
			},
			{
				number: '02',
				title: 'Fluxos de trabalho fazem parte do design.',
				body: 'A passagem de bastão entre design e desenvolvimento é onde a maioria dos sistemas desmorona silenciosamente. Eu trato esse pipeline — não só a interface — como algo a ser projetado deliberadamente.',
			},
			{
				number: '03',
				title: 'Durabilidade vence novidade.',
				body: 'Ferramentas e frameworks são substituídos a cada poucos anos. Um sistema construído para depender de uma única ferramenta é um sistema com data de validade. Eu construo para padrões que sobrevivem às ferramentas ao seu redor.',
			},
		],
		practiceTitle: 'Como isso aparece na prática',
		practiceBody:
			'Na RAMQ, isso significa construir as fundações de UX de uma organização antes de construir telas. Na Akinox, significou projetar o pipeline entre design e desenvolvimento, não apenas a interface sobre ele. Na Agentica, meu sistema pessoal, significa que cada decisão significativa é registrada, versionada e rastreável — prova de que essa abordagem funciona além de um único projeto.',
		aiTitle: 'Onde a IA entra',
		aiBody:
			'Agentes de IA podem acelerar partes desse trabalho — detectando inconsistências, redigindo documentação, propondo componentes. O que eles não podem fazer é decidir. A governança permanece humana, por design. Minha abordagem para IA em design systems não é sobre automação pela automação; é sobre garantir que a automação nunca ultrapasse a responsabilidade.',
	},
};

export function getApprocheCopy(locale: Locale): { copy: ApprocheCopy; contentLang: Locale } {
	const copy = approcheCopy[locale];
	if (copy) return { copy, contentLang: locale };
	return { copy: approcheCopy.en!, contentLang: 'en' };
}
