import type { Locale } from '../../i18n/ui';

export interface ParcoursEngagement {
	logo: string;
	alt: string;
	current: boolean;
	role: string;
	dates: string;
	body: string;
}

export interface ParcoursCopy {
	currentLabel: string;
	engagements: ParcoursEngagement[];
}

const parcoursCopy: Partial<Record<Locale, ParcoursCopy>> = {
	en: {
		currentLabel: 'Current',
		engagements: [
			{
				logo: '/logos/ramq.png',
				alt: 'RAMQ',
				current: true,
				role: 'Client Experience Bureau (BXC)',
				dates: 'Nov. 2024 – present',
				body: "Building UX foundations for RAMQ's Client Experience Bureau (Bureau d'expérience client) — the groundwork that has to exist before consistent screens can. Confidential by nature of the mandate; the work itself is structural, not visual.",
			},
			{
				logo: '/logos/akinox.png',
				alt: 'Akinox',
				current: false,
				role: 'Design Systems & Public Health',
				dates: 'June 2023 – 2024',
				body: 'Designed multidisciplinary care journeys for public health platforms, and laid the foundations of a design-to-code system to close the gap between design intent and shipped product. This is where the thinking behind Agentica started taking shape — inside a real organization, under real constraints.',
			},
			{
				logo: '/logos/intact.png',
				alt: 'Intact Insurance',
				current: false,
				role: 'UX Designer',
				dates: 'April 2022 – April 2023',
				body: 'Redesigned an online insurance submission flow to reduce drop-off, working within strict regulatory compliance (AMF) alongside analytics and behavioral research teams. Proof that systems thinking holds up even inside heavily regulated environments.',
			},
			{
				logo: '/logos/ovation.png',
				alt: 'Réseau Ovation',
				current: false,
				role: 'UX/UI Specialist',
				dates: 'Sept. 2021 – April 2022',
				body: 'Supported the migration of a legacy VB6 platform to the web, designing the workflow between design and development to protect consistency through a high-risk technical transition — not just the interface on either side of it.',
			},
			{
				logo: '/logos/canadel.png',
				alt: 'Canadel',
				current: false,
				role: 'Graphic Designer → UI/UX Designer',
				dates: 'April 2012 – Sept. 2021',
				body: 'Started as a graphic designer in 2012 and organically grew into a UI/UX role by 2015, redesigning Canadel’s product configuration tool and building the first analytics foundations to guide design decisions with real usage data. Nine years — the long version of "systems thinking wasn’t a pivot, it was a progression."',
			},
		],
	},
	fr: {
		currentLabel: 'En cours',
		engagements: [
			{
				logo: '/logos/ramq.png',
				alt: 'RAMQ',
				current: true,
				role: "Bureau d'expérience client (BXC)",
				dates: 'Nov. 2024 – aujourd\'hui',
				body: "Je construis les fondations UX du Bureau d'expérience client de la RAMQ — le travail de fond qui doit exister avant que des écrans cohérents puissent l'être. Confidentiel de par la nature du mandat ; le travail lui-même est structurel, pas visuel.",
			},
			{
				logo: '/logos/akinox.png',
				alt: 'Akinox',
				current: false,
				role: 'Design Systems et santé publique',
				dates: 'Juin 2023 – 2024',
				body: "J'ai conçu des parcours de soins multidisciplinaires pour des plateformes de santé publique, et posé les fondations d'un système design-to-code pour combler l'écart entre l'intention de design et le produit livré. C'est là que la réflexion derrière Agentica a commencé à prendre forme — dans une vraie organisation, sous de vraies contraintes.",
			},
			{
				logo: '/logos/intact.png',
				alt: 'Intact Insurance',
				current: false,
				role: 'Designer UX',
				dates: 'Avril 2022 – avril 2023',
				body: "J'ai repensé un parcours de soumission d'assurance en ligne pour réduire l'abandon, en respectant une conformité réglementaire stricte (AMF), aux côtés des équipes d'analytique et de recherche comportementale. La preuve que la pensée systémique tient la route même dans des environnements fortement réglementés.",
			},
			{
				logo: '/logos/ovation.png',
				alt: 'Réseau Ovation',
				current: false,
				role: 'Spécialiste UX/UI',
				dates: 'Sept. 2021 – avril 2022',
				body: "J'ai accompagné la migration d'une plateforme VB6 héritée vers le web, en concevant le processus entre le design et le développement pour protéger la cohérence à travers une transition technique à haut risque — pas seulement l'interface de part et d'autre.",
			},
			{
				logo: '/logos/canadel.png',
				alt: 'Canadel',
				current: false,
				role: 'Designer graphique → Designer UI/UX',
				dates: 'Avril 2012 – sept. 2021',
				body: "J'ai commencé comme designer graphique en 2012 et j'ai évolué naturellement vers un rôle UI/UX dès 2015, en repensant l'outil de configuration de produits de Canadel et en posant les premières fondations analytiques pour guider les décisions de design avec de vraies données d'usage. Neuf ans — la version longue de « la pensée systémique n'était pas un virage, c'était une progression ».",
			},
		],
	},
	'pt-br': {
		currentLabel: 'Atual',
		engagements: [
			{
				logo: '/logos/ramq.png',
				alt: 'RAMQ',
				current: true,
				role: "Bureau d'expérience client (BXC)",
				dates: 'Nov. 2024 – atualmente',
				body: "Construindo as fundações de UX do Bureau d'expérience client (Bureau de Experiência do Cliente) da RAMQ — o trabalho de base que precisa existir antes que telas consistentes possam existir. Confidencial pela natureza do mandato; o trabalho em si é estrutural, não visual.",
			},
			{
				logo: '/logos/akinox.png',
				alt: 'Akinox',
				current: false,
				role: 'Design Systems e Saúde Pública',
				dates: 'Jun. 2023 – 2024',
				body: 'Projetei jornadas de cuidado multidisciplinares para plataformas de saúde pública, e lancei as fundações de um sistema design-to-code para reduzir a distância entre a intenção do design e o produto entregue. Foi aqui que o pensamento por trás da Agentica começou a tomar forma — dentro de uma organização real, sob restrições reais.',
			},
			{
				logo: '/logos/intact.png',
				alt: 'Intact Insurance',
				current: false,
				role: 'Designer UX',
				dates: 'Abr. 2022 – abr. 2023',
				body: 'Redesenhei um fluxo de submissão de seguros on-line para reduzir o abandono, trabalhando dentro de uma conformidade regulatória rígida (AMF) ao lado de equipes de analytics e pesquisa comportamental. Prova de que o pensamento sistêmico se sustenta mesmo em ambientes fortemente regulados.',
			},
			{
				logo: '/logos/ovation.png',
				alt: 'Réseau Ovation',
				current: false,
				role: 'Especialista em UX/UI',
				dates: 'Set. 2021 – abr. 2022',
				body: 'Apoiei a migração de uma plataforma legada em VB6 para a web, projetando o fluxo de trabalho entre design e desenvolvimento para proteger a consistência ao longo de uma transição técnica de alto risco — não apenas a interface de cada lado dela.',
			},
			{
				logo: '/logos/canadel.png',
				alt: 'Canadel',
				current: false,
				role: 'Designer Gráfico → Designer UI/UX',
				dates: 'Abr. 2012 – set. 2021',
				body: 'Comecei como designer gráfico em 2012 e evoluí organicamente para um papel de UI/UX em 2015, redesenhando a ferramenta de configuração de produtos da Canadel e construindo as primeiras fundações de analytics para guiar decisões de design com dados reais de uso. Nove anos — a versão longa de "o pensamento sistêmico não foi uma virada, foi uma progressão".',
			},
		],
	},
};

export function getParcoursCopy(locale: Locale): { copy: ParcoursCopy; contentLang: Locale } {
	const copy = parcoursCopy[locale];
	if (copy) return { copy, contentLang: locale };
	return { copy: parcoursCopy.en!, contentLang: 'en' };
}
