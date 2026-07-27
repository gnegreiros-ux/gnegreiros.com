// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://gnegreiros.com',
	i18n: {
		defaultLocale: 'en',
		locales: ['en', 'fr', 'pt-br'],
		routing: {
			prefixDefaultLocale: false,
		},
	},
});
