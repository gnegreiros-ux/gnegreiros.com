export interface LibraryBook {
	title: string;
	author: string;
	/** Edition, volume, or publisher note — omitted from the card when unknown. */
	edition?: string;
	href: string;
	/** ISBN-13 (digits only), used to source a cover from Open Library. Omitted for ISBN-less ebooks/guides. */
	isbn?: string;
	/** Direct cover image URL — used when the ISBN has no cover on Open Library. */
	coverUrl?: string;
}

// Sorted alphabetically by title — see instructions/Bibliotheque brief.
export const libraryBooks: LibraryBook[] = [
	{
		title: 'A practical guide to Design System components',
		author: 'Ness Grixti',
		href: 'https://www.amazon.ca/s?k=9798876499219',
		isbn: '9798876499219',
		// Not on Open Library — sourced from the Amazon.ca listing's product image.
		coverUrl: 'https://m.media-amazon.com/images/I/61-1WNELLPL._SL1000_.jpg',
	},
	{
		title: 'Atomic Design',
		author: 'Brad Frost',
		edition: '2016',
		href: 'https://shop.bradfrost.com/',
		isbn: '9780998296609',
	},
	{
		title: 'Bíblia Sagrada',
		author: 'trad. João Ferreira de Almeida',
		edition: 'Almeida Revista e Atualizada (ARA)',
		href: 'https://www.bible.com/versions/212-ara-almeida-revista-e-atualizada',
		coverUrl: '/covers/biblia-sagrada.jpg',
	},
	{
		title: 'Design Ops 001',
		author: 'Collectif Frontguys',
		edition: 'Vol. 001',
		href: 'https://designops.fr',
		coverUrl: '/covers/design-ops-001.jpg',
	},
	{
		title: 'DesignOps',
		author: 'Matthieu Aubusson, Marianne Diaz, Timothé Dufour, Valentin Saint Frison',
		edition: 'PwC Experience Center Paris, oct. 2021, CC BY-NC-SA 4.0',
		href: 'https://www.pwc.fr',
		coverUrl: '/covers/designops-pwc.jpg',
	},
	{
		title: 'DesignOps 101: Guide to Design Operations',
		author: 'UXPin',
		href: 'https://www.uxpin.com/studio/ebooks/designops-guide/',
		coverUrl: '/covers/designops-101-uxpin.jpg',
	},
	{
		title: 'DesignOps Handbook',
		author: 'Kate Battles, Meredith Black, Dave Malouf, Collin Whitehead, éd. Gregg Bernstein',
		edition: 'DesignBetter.Co',
		href: 'https://designbetterpodcast.com/p/designops-handbook',
		coverUrl: '/covers/designops-handbook.jpg',
	},
	{
		title: 'Design Systems (Smashing eBook)',
		author: 'Smashing Magazine',
		href: 'https://www.smashingmagazine.com/printed-books/design-systems/',
		coverUrl: '/covers/design-systems-smashing.jpg',
	},
	{
		title: 'InVision Collaborate Better Handbook',
		author: 'DesignBetter.Co / InVision',
		href: 'https://designbetterpodcast.com/p/collaboration-handbook',
		coverUrl: '/covers/invision-collaborate-better.jpg',
	},
	{
		title: 'InVision Design Engineering Handbook',
		author: 'Aarron Walter + contributeurs (Indeed, Mailchimp, NYT, Minted)',
		href: 'https://designbetterpodcast.com/p/design-engineering-handbook',
		coverUrl: '/covers/invision-design-engineering.jpg',
	},
	{
		title: 'InVision Design Leadership Handbook',
		author: 'DesignBetter.Co / InVision',
		edition: '73 pages',
		href: 'https://designbetterpodcast.com/p/design-leadership-handbook',
		coverUrl: '/covers/invision-design-leadership.jpg',
	},
	{
		title: 'InVision Design Systems Handbook',
		author: 'Marco Suarez, Jina Anne, Katie Sylor-Miller, Diana Mounter, Roy Stanfield',
		edition: 'DesignBetter.Co',
		href: 'https://designbetterpodcast.com/p/design-systems-handbook',
		coverUrl: '/covers/invision-design-systems.jpg',
	},
	{
		title: 'Laying the Foundations',
		author: 'Andrew Couldwell',
		edition: 'Autoédité',
		href: 'https://designsystemfoundations.com',
		coverUrl: '/covers/laying-the-foundations.jpg',
	},
	{
		title: 'Le Product Design dans une organisation Produit',
		author: 'Thiga',
		href: 'https://www.thiga.co/fr/nos-ressources/livre-product-design',
		isbn: '9782956072379',
		coverUrl: '/covers/le-product-design-thiga.jpg',
	},
	{
		title: 'Méthodes de design UX',
		author: 'Carine Lallemand, Guillaume Gronier',
		edition: '2e édition, Eyrolles',
		href: 'https://www.amazon.ca/s?k=9782212673982',
		isbn: '9782212673982',
		coverUrl: '/covers/methodes-design-ux.jpg',
	},
	{
		title: 'Testing Business Ideas',
		author: 'David J. Bland, Alexander Osterwalder',
		edition: 'Wiley/Strategyzer',
		href: 'https://www.amazon.ca/s?k=9781119551447',
		isbn: '9781119551447',
	},
	{
		title: 'The Design of Everyday Things',
		author: 'Don Norman',
		edition: 'Revised & Expanded Edition',
		href: 'https://www.amazon.ca/Design-Everyday-Things-Revised-Expanded/dp/0465050654/',
		isbn: '9780465050659',
	},
	{
		title: 'The Elements of User Experience',
		author: 'Jesse James Garrett',
		edition: '2e édition, New Riders',
		href: 'https://www.amazon.ca/s?k=9780321683687',
		isbn: '9780321683687',
		coverUrl: '/covers/elements-of-ux.jpg',
	},
	{
		title: 'The What, How & Why of Design Systems',
		author: 'Andrea Hock',
		edition: 'Adobe Creative Residency',
		href: 'https://xd.adobe.com/ideas/wp-content/uploads/2021/06/iv26Yz-the-what-how-and-why-of-design-systems.pdf',
		coverUrl: '/covers/the-what-how-why-design-systems.jpg',
	},
	{
		title: 'Think First',
		author: 'Joe Natoli',
		href: 'https://www.amazon.ca/s?k=9780986344824',
		isbn: '9780986344824',
	},
];
