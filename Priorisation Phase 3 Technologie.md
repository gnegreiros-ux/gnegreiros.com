# Portfolio gnegreiros.com — Phase 3 : Technologie — Synthèse des décisions

**Statut :** Décisions techniques verrouillées, y compris l'architecture i18n.
**Document compagnon de :** `portfolio-gnegreiros-contenu-phase1.md`, `portfolio-gnegreiros-seo-metadata.md`
**Contexte :** Phase 1 (contenu, 7 pages EN) et Phase 2 (design) sont verrouillées. Ce document couvre les décisions de la Phase 3.

---

## Pivot important — relation avec Agentica

**Décision initiale (abandonnée) :** faire du site un "pilote" consommant directement les composants Angular d'Agentica, pour prouver que des équipes produits externes peuvent adopter Agentica avec leur propre thème visuel.

**Décision finale :** le site **n'est pas un pilote Agentica**. C'est un projet indépendant, avec son propre code, sa propre stack, son propre repo. Il s'inspire des **standards de qualité** d'Agentica (W3C, accessibilité, gouvernance des décisions) sans dépendre de son code ni de son style visuel.

**Raison du pivot :** conforme au positionnement déjà verrouillé en Phase 1 — le site parle de Guilherme en tant que systems builder ; Agentica est la preuve la plus forte de cette expertise, pas le mécanisme technique du site lui-même. Forcer un lien de dépendance technique créait une complexité et un narratif qui ne servaient pas cet objectif.

---

## Décisions techniques verrouillées

### Générateur de site
- **Astro** — générateur de site statique (SSG)
- Zéro JavaScript envoyé par défaut ; interactivité ponctuelle via "islands" si nécessaire
- Sortie 100 % HTML/CSS statique — aucun serveur applicatif requis en production
- Content Collections pour le contenu multilingue (Markdown/MDX), aligné sur le contenu déjà rédigé en Phase 1
- Choisi après comparaison avec Angular (retenu un temps pour incarner un "pilote" crédible en contexte gouvernemental, écarté une fois le pivot fait — trop lourd pour un site de 7 pages majoritairement statique) et Jekyll (même famille d'outils, mais i18n natif moins mature et écosystème moins actif)

### Standards de qualité (remplacent la gouvernance à la Agentica)
- **W3C** — HTML5 sémantique, validation automatisée (W3C Nu Html Checker)
- **Accessibilité WCAG 2.1 AA** — contraste, navigation clavier, ARIA minimal ; vérifié via axe-core et Lighthouse
- **Vitesse / Core Web Vitals** — cibles : LCP < 2.5s, CLS < 0.1, INP < 200ms ; images modernes (WebP/AVIF), lazy loading, `font-display: swap`
- **SEO** — métadonnées déjà rédigées (`portfolio-gnegreiros-seo-metadata.md`), sitemap.xml généré au build, robots.txt, hreflang pour EN/FR/PT-BR, données structurées `schema.org/Person`

### Affichage des chiffres Agentica (800+ tokens, 70+ ADRs, 14 composants, 10 quality gates)
- **Constat :** agentica.design n'expose pas ces chiffres via une source structurée (JSON/API) — ils apparaissent en texte dans le HTML de la page. Le site Agentica dispose cependant déjà d'un pipeline automatisé ("Rebuild du site") qui régénère ces chiffres depuis l'état réel du code à chaque build d'Agentica — donc la donnée source est fiable, seule l'exposition externe manque.
- **Écart repéré en passant (à corriger côté Agentica, hors périmètre de ce projet) :** la page agentica.design affiche "70+ ADRs" dans le hero, mais "75 ADRs" dans un lien plus bas sur la même page.
- **Décision :** le site portfolio lit directement le **dépôt GitHub public** d'Agentica (`github.com/gnegreiros-ux/agentica-design-system`) via l'API GitHub, au moment du build, pour compter les fichiers réels (ADRs, tokens, composants). Cette approche est privilégiée à la création d'un futur endpoint JSON côté Agentica, car elle est actionnable immédiatement et élimine structurellement le risque d'écart entre les chiffres affichés à deux endroits différents.
- Limite technique à prévoir si les builds deviennent fréquents : l'API GitHub non authentifiée est plafonnée à 60 requêtes/heure ; un jeton d'accès en secret CI lève cette limite si besoin.

### CI/CD et rebuild
- **GitHub Actions**, avec deux déclencheurs sur le même pipeline :
  - Push sur `main` (changement de contenu du portfolio)
  - Cron hebdomadaire (lundi 6h UTC) — reconstruit et republie même sans changement de contenu, pour garder les chiffres Agentica à jour
- Étapes : `npm ci` → `npm run build` (Astro génère `dist/`, requêtes à l'API GitHub d'Agentica incluses) → déploiement

### Hébergement et déploiement
- **OVH, hébergement mutualisé** (serveur actuel)
- Déploiement par transfert de fichiers (FTP/SFTP) depuis GitHub Actions vers OVH — SFTP à privilégier si l'accès SSH est activé sur l'hébergement (à vérifier dans l'espace client OVH), sinon FTPS
- Identifiants stockés comme secrets GitHub, jamais en clair dans le dépôt
- Dossier de destination exact (`server-dir`) à confirmer lors de l'implémentation avec Claude Code

### Repo et développement
- **Repo Git distinct** de celui d'Agentica — cohérent avec le pivot "projet indépendant"
- **Développement effectué via Claude Code**

### Analytics et conformité Loi 25
- **Google Analytics (GA4)**, avec **Consent Mode natif** — tracking désactivé/limité tant que le consentement n'est pas donné
- **Bannière de consentement minimaliste** (Accepter/Refuser), visuellement cohérente avec la direction éditoriale de la Phase 2, requise avant tout dépôt de cookie GA — conformité Loi 25 (Québec)
- Point de vigilance : ceci est un aperçu factuel des options techniques, pas un avis juridique — à valider avec un professionnel si doute sur la conformité exacte

### Langue(s) au lancement
- **Lancement en anglais seul.** L'architecture i18n (EN/FR/PT-BR) est prête dès le jour 1 dans le code — ce n'est pas une dette technique — mais le contenu FR et PT-BR sera traduit et ajouté progressivement après le lancement, sans bloquer la mise en ligne initiale
- Raison : l'audience prioritaire (décideurs de la communauté design systems) est majoritairement anglophone ; mieux vaut un anglais soigné au lancement qu'une traduction précipitée dans les 3 langues

### Architecture i18n (EN par défaut / FR / PT-BR)
- **Routing natif Astro** — `defaultLocale: "en"`, `locales: ["en", "fr", "pt-br"]`, `prefixDefaultLocale: false` → EN sans préfixe (`/approche`), FR (`/fr/approche`), PT-BR (`/pt-br/approche`)
- **Deux mécanismes de contenu distincts :**
  - Contenu de page (long, éditorial) → Content Collections, un dossier par langue (`src/content/pages/en|fr|pt-br/*.md`)
  - Texte d'interface (nav, boutons, footer) → dictionnaires courts séparés (`src/i18n/ui.ts`), pas des Content Collections
- **Slugs identiques dans les 3 langues** (ex. `/approche` reste `/approche` en FR et PT-BR, juste préfixé) — cohérent avec le routing natif d'Astro qui suppose une correspondance 1:1 entre langues, et avec l'arborescence déjà validée en Phase 1
- **Fallback EN si traduction manquante** — la route dynamique (`src/pages/[locale]/[slug].astro`) affiche la version anglaise plutôt qu'une 404 si la page FR/PT-BR n'existe pas encore, ce qui permet de déployer l'architecture i18n complète dès maintenant et d'ajouter les traductions progressivement (rappel : traduction FR/PT-BR du contenu déjà identifiée comme étape *après* le verrouillage Phase 3, dans `portfolio-gnegreiros-contenu-phase1.md`)
- **SEO multilingue** — balises `hreflang` générées automatiquement par page, sélecteur de langue via `getRelativeLocaleUrl`

---

## Reste ouvert

- Confirmation de l'accès SSH/SFTP vs FTP sur l'hébergement OVH actuel
- Dossier exact de déploiement sur le serveur OVH
- Traduction FR et PT-BR du contenu (après le lancement en anglais)
- Construction technique elle-même (scaffolding du projet Astro) — à démarrer avec Claude Code
- CV/Resume — livrable séparé, après le lancement du site
- Timing du post LinkedIn Agentica (déjà rédigé) par rapport au lancement du site — deux "moments de déploiement" à synchroniser ou séparer, à trancher
- **Hors périmètre de ce projet :** correction de l'écart "70+ ADRs" vs "75 ADRs" sur agentica.design → projet "Promotion Agentica"
