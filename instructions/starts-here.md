# Start Here — gnegreiros.com

Ce fichier est le point d'entrée pour le développement du site **gnegreiros.com**. Lis les quatre documents ci-dessous, dans cet ordre, avant d'écrire la moindre ligne de code. Ils contiennent des décisions déjà verrouillées par Guilherme — ne les remets pas en question, implémente-les.

## 1. `portfolio-gnegreiros-contenu-phase1.md` — Contenu & storytelling
Contenu final validé pour les 7 pages du site (Home, Approche, Agentica, DTGen, Parcours, À propos, Contact), en anglais (langue par défaut). Définit l'arborescence, le positionnement ("systems builder", pas "screen designer"), et tout le texte à intégrer tel quel dans les Content Collections.

⚠️ Contient une note interne (chiffres Agentica) à ne pas publier telle quelle — voir section correspondante dans le document.

## 2. `portfolio-gnegreiros-seo-metadata.md` — Métadonnées SEO
Title tags et meta descriptions validés pour chacune des 7 pages, prêts à être injectés dans le `<head>` de chaque route Astro. Contient aussi les règles de rédaction à respecter si de nouvelles pages sont ajoutées plus tard (pas de répétition de mots-clés, pas de "Design Systems Expert", etc.).

## 3. `gnegreiros-design-reference.md` — Design (source unique, v0.3)
**Seul document de référence pour le design visuel** — remplace et rend obsolètes tous les documents Phase 2 précédents. Verrouille les tokens exacts : couleurs (`#FAF8F4` fond, `#4C49E2` accent), typographie (Fraunces / Inter / IBM Plex Mono), échelle d'espacement (8px, sections à 10rem), grille 12 colonnes, iconographie (Lucide), politique imagerie (pas de stock photo, pas de logos d'entreprise), anti-patterns explicites à éviter, et la composition pixel-près du hero Home. `instructions/Image ChatGPT Portfolio Juil 28 2026.png` est une référence d'inspiration visuelle, **non autoritaire** — ce document prime en cas de conflit.

## 4. `synthese-phase3-technologie-portfolio.md` — Décisions techniques
Le document de référence pour l'implémentation :
- **Stack :** Astro (SSG), zéro JS par défaut, Content Collections pour le contenu multilingue
- **Le site n'est PAS un pilote Agentica** — projet indépendant, repo Git séparé, propre stack (pivot déjà tranché, ne pas revenir dessus)
- **i18n :** `defaultLocale: "en"`, `locales: ["en", "fr", "pt-br"]`, `prefixDefaultLocale: false` ; architecture prête dès le jour 1, contenu FR/PT-BR ajouté progressivement avec fallback EN
- **Chiffres Agentica** (tokens, ADRs, composants) : lus au build via l'API GitHub publique du repo `agentica-design-system`, pas de valeurs en dur
- **Qualité :** W3C, WCAG 2.1 AA, Core Web Vitals (LCP < 2.5s, CLS < 0.1, INP < 200ms)
- **CI/CD :** GitHub Actions, déclenché sur push `main` + cron hebdomadaire (lundi 6h UTC)
- **Hébergement :** OVH mutualisé, déploiement SFTP/FTPS
- **Analytics :** GA4 avec Consent Mode natif + bannière de consentement (Loi 25 Québec)

## Ordre de travail suggéré pour Claude Code

1. ~~Scaffolding du projet Astro (config i18n, structure de dossiers, Content Collections)~~ ✅ fait
2. Fondations visuelles (tokens CSS, chargement des polices Fraunces/Inter/IBM Plex Mono, grille 12 colonnes, layout de base, composants partagés — voir `gnegreiros-design-reference.md` §4 et §7)
3. Intégration du contenu Phase 1 dans la structure de pages selon la hiérarchie de l'information verrouillée (pages EN uniquement au lancement)
4. Intégration des métadonnées SEO par page
5. Script de build pour lire les chiffres Agentica via l'API GitHub
6. Mise en place W3C / WCAG / Core Web Vitals (validation automatisée)
7. GA4 + bannière de consentement
8. Pipeline GitHub Actions (build + déploiement OVH)

Référence détaillée équivalente (check-list exhaustive, français) : `CLAUDE EXECUTION PLAN — gnegreiros.md`.

## Points encore ouverts (à confirmer avec Guilherme avant de bloquer dessus)

- Accès SSH/SFTP vs FTP sur l'hébergement OVH actuel
- Dossier exact de déploiement (`server-dir`) sur le serveur OVH
- Timing du post LinkedIn Agentica par rapport au lancement du site

## Hors périmètre de ce projet

- Correction de l'écart "70+ ADRs" vs "75 ADRs" sur agentica.design → relève du projet **Promotion Agentica**, pas de ce dépôt
- Traduction FR et PT-BR du contenu → après le lancement en anglais
- CV/Resume en tant que livrable → séparé, après le lancement du site
