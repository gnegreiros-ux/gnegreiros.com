export const defaultLang = 'en';

export const locales = ['en', 'fr', 'pt-br'] as const;

export type Locale = (typeof locales)[number];

export const languageNames: Record<Locale, string> = {
	en: 'English',
	fr: 'Français',
	'pt-br': 'Português (BR)',
};

// FR/PT-BR keys are filled in progressively as translations land (see
// instructions/Priorisation Phase 3 Technologie.md). Missing keys fall
// back to `en` via `useTranslations` in `./utils.ts`.
export const ui = {
	en: {
		'nav.approach': 'Approach',
		'nav.agentica': 'Agentica',
		'nav.dtgen': 'DTGen',
		'nav.parcours': 'Journey',
		'nav.about': 'About',
		'nav.contact': 'Contact',
		'footer.rights': 'All rights reserved.',
	},
	fr: {},
	'pt-br': {},
} as const satisfies Record<Locale, Partial<Record<string, string>>>;

export type UiKey = keyof (typeof ui)['en'];
