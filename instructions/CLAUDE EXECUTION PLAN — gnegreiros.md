# CLAUDE EXECUTION PLAN — gnegreiros.com Portfolio

## Mission

Construire le site personnel **gnegreiros.com** de Guilherme Negreiros.

Ce site n'est PAS un simple portfolio UX/UI.
C'est une démonstration de pensée systémique : Guilherme se positionne comme **UX Systems Designer / Systems Builder**.

Le site doit démontrer :
- la capacité à concevoir des systèmes de décision durables ;
- la gouvernance des Design Systems ;
- la connexion entre design, développement et opérations ;
- une approche responsable de l'IA où les agents exécutent mais l'humain décide.

Agentica est une preuve de cette expertise.
Agentica n'est PAS le moteur technique du site.

---

# 1. RÈGLES ABSOLUES

## Positionnement

Ne jamais présenter Guilherme comme :
- un designer d'écrans ;
- un UI designer exécutant des interfaces ;
- un expert outil.

Toujours présenter :
- Systems Builder
- UX Systems Designer
- infrastructure de décision
- gouvernance
- durabilité des systèmes

---

## Agentica

Décision finale :

Le portfolio est un projet indépendant.

Ne pas :
- importer des composants Agentica ;
- utiliser la stack Agentica ;
- créer un "pilote Agentica".

Faire :
- s'inspirer des standards Agentica :
  - W3C
  - accessibilité
  - documentation des décisions
  - gouvernance
  - standards ouverts

---

# 2. STRUCTURE DU SITE

Arborescence :


/
├── Home
├── Approche
├── Agentica
├── DTGen
├── Parcours
├── À propos
└── Contact


Langue initiale :
- anglais uniquement

Architecture prévue :
- EN
- FR
- PT-BR

---

# 3. STACK TECHNIQUE

## Framework

Utiliser :

- Astro
- Static Site Generation (SSG)
- zéro JavaScript par défaut
- islands uniquement si nécessaire

Objectifs :
- performance maximale
- HTML sémantique
- simplicité
- longévité

---

## Contenu

Utiliser Astro Content Collections.

Structure :


src/content/pages/

├── en/
├── fr/
└── pt-br/


Le contenu long :
- Markdown/MDX

Les textes d'interface :
- dictionnaire séparé

Exemple :


src/i18n/ui.ts


---

# 4. INTERNATIONALISATION

Configuration :

```js
defaultLocale: "en"

locales:
[
 "en",
 "fr",
 "pt-br"
]

prefixDefaultLocale:false

Routes :

Anglais :

/approche

Français :

/fr/approche

Portugais :

/pt-br/approche

Si une traduction manque :

Fallback anglais.

5. DESIGN SYSTEM DU SITE
Direction visuelle

Style :

Hybride :

éditorial
systémique
technique discret
Couleurs

Fond :

clair chaud-neutre

Accent unique :

#4C49E2

Usage :

liens
CTA
annotations

Interdit :

grands fonds indigo
surcharge visuelle
Typographie

Titres :

serif
voix éditoriale

Corps :

sans-serif
Motif visuel

Grille de tokens discrète :

annotations monospace
mesures
références techniques

La structure doit être ressentie, pas affichée.

6. HIÉRARCHIE DES PAGES
Home

Structure :

Hero

Message :

"I design the decision systems that hold digital experiences together — for the humans who decide, and now for the AI agents who execute."

Transition
Trois teasers égaux :
Approche
Agentica
DTGen
Parcours
CTA Contact
Approche

Structure :

Hero

Narration

Trois principes :

Decisions need memory
Workflows are part of the design
Durability beats novelty

Position IA :

Les agents accélèrent.
Ils ne décident pas.

Agentica

Règle importante :

Le hero ne doit PAS afficher les métriques comme élément principal.

Le message vient avant les chiffres.

Ordre :

Thèse
Problème
Gouvernance des décisions
Architecture
Résultats

Différenciateur :

ADR + gouvernance.

DTGen

Même modèle qu'Agentica mais plus léger.

Ne doit pas voler la place d'Agentica.

Parcours

Une seule page.

Sections :

RAMQ
Akinox
Intact
Ovation
Canadel

Les projets NDA :

contexte seulement
aucun détail confidentiel
À propos

Structure :

Hero

Trajectoire :

1997 → design graphique
2001 → web
UI
UX
Design Systems

Message :

Ce n'était pas un pivot.
C'était une progression.

Contact

Seulement :

Hero court
Coordonnées

Pas de texte de fermeture.

7. SEO

Implémenter les metadata validées.

Chaque page doit avoir :

title
description
canonical
hreflang

SEO :

sitemap.xml
robots.txt
schema.org Person

Ne jamais utiliser :

"Design Systems Expert"
"portfolio"
"freelance"
8. AGENTICA DATA

Les métriques Agentica ne doivent jamais être écrites en dur.

Lire dynamiquement au build depuis :

GitHub :

github.com/gnegreiros-ux/agentica-design-system

Calculer :

tokens
ADRs
composants

Source de vérité :

repo GitHub.

Prévoir :

GitHub API rate limit.

Ajouter un token secret CI si nécessaire.

9. QUALITÉ

Obligatoire :

HTML

W3C Nu HTML Checker

Accessibilité

WCAG 2.1 AA

Tester :

axe-core
Lighthouse
Performance

Objectifs :

LCP < 2.5s

CLS < 0.1

INP < 200ms

Optimisation :

WebP
AVIF
lazy loading
font-display: swap
10. ANALYTICS

Utiliser :

Google Analytics 4

Avec :

Consent Mode natif.

Créer :

bannière consentement minimale
Accepter
Refuser

Respecter :

Loi 25 Québec.

11. CI/CD

GitHub Actions.

Déclencheurs :

Push
main
Cron

Chaque lundi :

06:00 UTC

Pipeline :

npm ci

npm run build

déploiement
12. HÉBERGEMENT

Serveur :

OVH mutualisé

Déploiement :

Priorité :

SFTP
FTPS

Secrets :

Jamais dans Git.

Utiliser :

GitHub Secrets.

À confirmer :

accès SSH/SFTP
server-dir exact
13. ORDRE D'EXÉCUTION

Claude doit suivre exactement cet ordre :

Étape 1

Créer projet Astro :

configuration
i18n
Content Collections
Étape 2

Créer fondations visuelles :

tokens CSS
typographie
layouts
composants communs
Étape 3

Importer contenu Phase 1 :

pages EN uniquement
Étape 4

Ajouter SEO

Étape 5

Créer intégration GitHub Agentica

Étape 6

Ajouter tests :

W3C
Lighthouse
accessibility
Étape 7

Ajouter analytics consentement

Étape 8

Configurer GitHub Actions + OVH

14. HORS PÉRIMÈTRE

Ne pas faire :

traduction FR/PT-BR maintenant
CV
correction Agentica.design
refonte Agentica
nouveau Design System
CRITÈRE DE SUCCÈS

Le résultat final doit donner l'impression :

"Ce n'est pas un portfolio qui montre des écrans.
C'est un système conçu par quelqu'un qui comprend comment les organisations prennent, transmettent et préservent leurs décisions."