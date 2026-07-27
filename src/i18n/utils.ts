import { defaultLang, ui, type Locale, type UiKey } from './ui';

export function getLangFromUrl(url: URL): Locale {
	const [, maybeLocale] = url.pathname.split('/');
	if (maybeLocale && maybeLocale in ui) return maybeLocale as Locale;
	return defaultLang;
}

export function useTranslations(lang: Locale) {
	return function t(key: UiKey): string {
		return ui[lang][key as keyof (typeof ui)[typeof lang]] ?? ui[defaultLang][key];
	};
}
