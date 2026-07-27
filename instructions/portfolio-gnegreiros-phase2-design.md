# Portfolio gnegreiros.com — Phase 2 : Design — Synthèse des décisions

**Statut :** Décisions verrouillées
**Document compagnon de :** `portfolio-gnegreiros-contenu-phase1.md`, `portfolio-gnegreiros-seo-metadata.md`, `synthese-phase3-technologie-portfolio.md`
**Contexte :** Phase 1 (contenu, 7 pages EN) et SEO sont verrouillées avant le début de cette phase. Ce document couvre la direction visuelle, la hiérarchie de l'information et les wireframes moyenne fidélité produits en Phase 2.

---

## Positionnement (rappel non négociable)

Guilherme est un **systems builder / infrastructure thinker** — jamais un designer d'écrans. Le site parle de lui ; Agentica est sa preuve la plus forte, pas le sujet du site. Audience prioritaire : décideurs (VP, direction) qui évaluent une expertise, pas des recruteurs qui scannent des mots-clés. Cette contrainte a guidé chaque choix visuel ci-dessous, pas seulement le texte.

---

## 1. Direction visuelle

### Options explorées
Trois directions ont été proposées :

1. **Blueprint technique** — fond graphite quasi noir, accent chaleureux unique (orange/ambre), labels monospace façon annotations de plan. Évoque directement l'infrastructure, mais risque de lire "dev tool" plutôt que "design".
2. **Éditorial systémique** — fond clair, beaucoup de blanc, titres serif italique, palette neutre chaude (crème, brun, gris). Cohérent avec le ton du contenu déjà rédigé.
3. **Grille de tokens** — la grille elle-même devient motif visuel (échelle 4/8/12/16px visible), bleu franc en accent, sans-serif géométrique. Fort pour une audience technique, mais risque de sembler trop "documentation".

### Décision : hybride 2 + 3
Le ton éditorial (lisibilité, voix — "systems builder qui écrit", pas juste qui code) avec la grille de tokens comme touche structurelle discrète plutôt que comme thème dominant.

### Système visuel verrouillé
- **Fond** : clair, chaud-neutre (pas blanc pur)
- **Couleur d'accent unique** : `#4C49E2` (indigo — couleur primaire du site actuel, conservée), réservée aux liens, CTA et petites annotations structurelles. **Jamais en fond large.**
- **Typographie** : titres en serif (voix éditoriale, type Georgia) ; corps de texte en sans-serif
- **Motif grille** : discret — annotations monospace ponctuelles (mesures, étiquettes techniques) plutôt qu'une grille visible partout. La structure se ressent, elle ne s'affiche pas.
- **Exception unique au style flat, sur tout le site** : sur la page Approche, les 3 cartes de principes ont une bordure pleine + liseré indigo à gauche — seul endroit où l'accent marque une rupture structurelle.

---

## 2. Hiérarchie de l'information (squelette par page)

| Page | Structure |
|---|---|
| **Home** | Hero seul → transition légère → 3 teasers à poids égal (Approche / Agentica / DTGen) → teaser Parcours séparé → CTA final isolé |
| **Approche** | Hero → texte narratif → **rupture structurée (3 principes, seule liste de la page)** → texte → texte (position IA, pas de CTA) |
| **Agentica** | Hero = thèse seule, **aucun chiffre en avant** (décision explicite : les chiffres n'impressionnent pas dans l'univers design systems) → contexte → **gouvernance & décisions = section la plus dense, différenciateur réel** → architecture → résultats/preuve en liste sobre tout en bas, avec liens live/GitHub/Storybook |
| **DTGen** | Même patron qu'Agentica mais volontairement **plat** — aucune section ne domine, pour ne pas concurrencer Agentica en poids visuel |
| **Parcours** | Hero unique (pas de sous-hero par entreprise) → 5 blocs antichronologiques : RAMQ légèrement plus haut (contexte actuel), puis Akinox, Intact, Ovation, Canadel |
| **À propos** | Hero → trajectoire (récit long-form) → "ce que systems builder veut dire" (2e poids le plus lourd après le hero) → batterie/église (court, discret) → liens |
| **Contact** | Réduit à **2 niveaux seulement** : hero court + coordonnées. Pas de note de fermeture (retirée sur demande explicite). |

---

## 3. Wireframes (moyenne fidélité)

Produits pour : **Home, Agentica, À propos, Parcours, Approche, DTGen**.

**Contact** n'a pas de wireframe dédié — jugé non nécessaire vu sa simplicité à 2 blocs.

---

## 4. Corrections actées pendant la session

- **Agentica** : retrait des cartes de métriques du hero — la thèse seule porte la page. Décision explicite de Guilherme.
- **Contact** : réduit de 3 niveaux à 2 (hero + coordonnées), retrait de la note de fermeture.

---

## 5. Point technique résolu pendant cette phase

L'écart soupçonné entre les chiffres du portfolio et ceux affichés sur agentica.design (800+ tokens / 70+ ADRs / 14 composants / 10 quality gates vs 801+ / 163 / 71) **n'existe plus** — confirmé le 24 juillet 2026 par capture d'écran du hero agentica.design, qui affiche désormais les mêmes chiffres.

**Décision :** agentica.design est la source de vérité pour ces chiffres, qui évoluent en continu. Le portfolio doit les afficher **dynamiquement** depuis cette source plutôt qu'en dur — décision technique reportée et détaillée en Phase 3.

---

## Prochaines étapes

- [x] Direction visuelle — hybride éditorial + grille de tokens verrouillé
- [x] Hiérarchie de l'information — 7 pages verrouillées
- [x] Wireframes moyenne fidélité — 6 pages (Home, Agentica, À propos, Parcours, Approche, DTGen)
- [x] Écart de chiffres Agentica vs portfolio — résolu, source de vérité désignée
- [ ] Phase 3 — Technologie : verrouillée séparément, voir `synthese-phase3-technologie-portfolio.md`
