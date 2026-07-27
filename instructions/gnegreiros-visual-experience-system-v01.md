# gnegreiros.com — Visual Experience System
## Direction de conception v0.1

**Projet :** Mon portfolio 2026  
**Positionnement :** UX Systems Designer / Systems Builder  
**Statut :** Direction de conception proposée à partir des décisions verrouillées des phases 1–3

---

## 1. Concept central — The Decision Layer

Le portfolio ne doit pas ressembler à un portfolio UX traditionnel.

Le territoire visuel repose sur une idée centrale :

> **Entre l’intention et l’interface, il existe une couche de décisions.**

C'est précisément là que se situe le travail de Guilherme.

```text
             INTENTION
                 ↓
        ┌─────────────────┐
        │ DECISION LAYER  │
        │                 │
        │ principles      │
        │ constraints     │
        │ tokens          │
        │ governance      │
        │ architecture    │
        └─────────────────┘
                 ↓
          DIGITAL EXPERIENCE
```

Cette couche constitue le vocabulaire visuel central du site et permet de relier naturellement :

- UX
- Design Systems
- Design Tokens
- Architecture
- Governance
- DesignOps
- AI agents
- Documentation
- décisions
- durabilité

sans transformer le portfolio en site de documentation technique.

---

# 2. La grille — invisible mais omniprésente

La grille ne doit pas être un motif de fond.

Elle doit déterminer **comment les choses se comportent**.

Structure desktop recommandée : **12 colonnes**, sans jamais afficher les 12 colonnes explicitement.

```text
┌─────────────────────────────────────────────────────────────┐
│ margin                                                     │
│                                                             │
│   ┌────────────── content grid ────────────────────────┐   │
│   │                                                     │   │
│   │  annotation        editorial content       proof    │   │
│   │                                                     │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

La grille devient perceptible lorsque :

- une annotation s'aligne avec un titre ;
- un paragraphe commence exactement sous une colonne ;
- une preuve vient se positionner dans une colonne secondaire ;
- une ligne traverse deux sections ;
- une section change de largeur ;
- un élément déborde intentionnellement de son axe.

La structure doit donner une impression de **précision systémique**.

---

# 3. Le rythme — 8px comme ADN

Le système de tokens doit se sentir dans les espacements.

Échelle recommandée :

**4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128**

### Micro-échelle

`4 → 8 → 12 → 16`

Pour :

- labels ;
- icônes ;
- relations typographiques ;
- petits groupes.

### Échelle de composition

`24 → 32 → 48 → 64`

Pour les composants et sections.

### Échelle éditoriale

`96 → 128 → 160+`

Pour créer les respirations importantes.

Le résultat doit donner une impression de **calme**, pas de densité.

---

# 4. Typographie

La typographie doit porter une grande partie de la personnalité.

## Display / pensée

**Serif éditoriale**

Exemple de territoire :

> I don't design screens.

Puis une deuxième ligne beaucoup plus légère :

> I design the infrastructure that keeps decisions consistent.

La serif représente **la pensée**.

## Information

**Sans-serif contemporaine**

Utilisée pour :

- navigation ;
- paragraphes ;
- boutons ;
- métadonnées ;
- descriptions ;
- informations factuelles.

Elle représente **l'exécution**.

## Structure

**Monospace**

Utilisée uniquement pour les éléments comme :

```text
DECISION / 017
SYSTEM / GOVERNANCE
2026.07
WCAG 2.1 AA
TOKEN / COLOR / INDIGO
```

Elle représente **la structure**.

### Les trois voix

**Serif = Thought**  
**Sans = Experience**  
**Mono = System**

---

# 5. Couleur

Les contraintes de direction visuelle sont :

- fond chaud et clair ;
- accent unique `#4C49E2` ;
- indigo réservé aux liens, CTA et annotations ;
- jamais d'indigo en fond large.

Palette conceptuelle :

```text
BACKGROUND
Warm paper / off-white

TEXT
Near-black / warm charcoal

SECONDARY
Warm gray

STRUCTURE
Soft neutral lines

ACCENT
#4C49E2
```

### Indigo = signal

L'indigo n'est pas décoratif.

Il apparaît lorsqu'une chose mérite l'attention :

- lien ;
- CTA ;
- numéro ;
- annotation ;
- état actif ;
- élément de navigation ;
- relation ;
- décision importante.

Principe :

> **When indigo appears, it matters.**

---

# 6. Les lignes comme composant

La ligne devient un élément graphique récurrent :

```text
────────────────────────────────────────
```

Elle ne doit pas être un simple séparateur décoratif.

Elle signifie :

> **boundary / relationship / transition**

Exemples :

```text
01 ───────────────────────── APPROACH
```

```text
DECISION
────────────────────────────
Context
Alternatives
Trade-off
Outcome
```

```text
Agentica ───────────────────────── proof
```

Cette grammaire doit être réutilisable dans toutes les pages.

---

# 7. Les annotations

Les annotations monospace peuvent révéler les couches internes du système.

Exemples :

```text
01 / APPROACH
```

```text
20+ YEARS
```

```text
SYSTEM / 04
```

```text
HUMAN DECISION
```

```text
FRAMEWORK AGNOSTIC
```

Elles doivent rester **rares**.

Leur rôle n'est pas de décorer mais de suggérer que le visiteur observe les **couches internes du système**.

---

# 8. Le concept de « Proof »

Agentica et DTGen ne doivent pas être présentés comme des cartes de portfolio classiques.

Ce sont des **preuves**.

Structure privilégiée :

```text
AGENTICA                                      01

The decision system for
humans and AI agents.

──────────────────────────────────────────────

DECISION GOVERNANCE
Every meaningful choice is logged...

                         800+ tokens
                         70+ ADRs
                         14 components

──────────────────────────────────────────────

Explore the system →
```

La hiérarchie d'Agentica doit suivre :

**thèse → contexte → gouvernance → architecture → preuve**

La gouvernance reste la partie la plus importante visuellement.

---

# 9. Home — composition éditoriale

La Home ne doit pas ressembler à un dashboard.

Pas de :

- gros visuel artificiel dans le hero ;
- mockup ;
- chiffres dans le hero ;
- grille visible ;
- surcharge graphique.

## Hero

Très grand espace négatif.

Petite annotation :

```text
UX SYSTEMS DESIGNER / SYSTEMS BUILDER
```

Puis le contenu validé :

> **I design the decision systems that hold digital experiences together —**

Puis :

> **for the humans who decide, and now for the AI agents who execute.**

Information secondaire possible :

```text
20+ YEARS
DESIGN → SYSTEMS → GOVERNANCE
```

La transition doit rester extrêmement calme.

---

# 10. Les trois preuves de la Home

Les trois teasers **Approach / Agentica / DTGen** ne doivent pas être trois cartes identiques.

Ils doivent partager la même grammaire mais avoir des comportements distincts.

### Approach

**THINKING**

Typographie et espace dominants.

### Agentica

**PROOF**

Architecture, relations et décisions.

### DTGen

**TOOL**

Plus fonctionnel et compact.

Le design raconte ainsi déjà quelque chose avant même la lecture du texte.

---

# 11. Agentica — le moment « wow »

La page doit commencer comme une page éditoriale puis progressivement révéler le système.

Exemple de territoire :

```text
Agentica

The decision system for
humans and AI agents.


A personal design system built to prove a thesis:
design decisions should survive the tools,
the frameworks, and the people who made them.


──────────────────────────────────────────────

                  DECISION LAYER

      ┌─────────────┐
      │   TOKENS    │
      └──────┬──────┘
             ↓
      ┌─────────────┐
      │  CONTRACTS  │
      └──────┬──────┘
             ↓
      ┌─────────────┐
      │ COMPONENTS  │
      └──────┬──────┘
             ↓
      ┌─────────────┐
      │APPLICATIONS │
      └─────────────┘
```

Les **ADRs** peuvent devenir une colonne vertébrale narrative.

L'objectif est de montrer le système en action plutôt que d'aligner des screenshots.

---

# 12. L'AI — une représentation particulière

Principe narratif :

> **AI agents can execute. Humans decide.**

Cette distinction doit être rendue visuelle.

```text
             HUMAN
          ───────────
            DECIDES
               │
               ↓
        ┌──────────────┐
        │ GOVERNANCE   │
        └──────┬───────┘
               │
       ┌───────┴────────┐
       ↓                ↓
    AI AGENT          HUMAN
    EXECUTES          REVIEWS
```

Grammaire visuelle proposée :

- **Humain** → typographie serif ;
- **Agent** → monospace ;
- **Gouvernance** → lignes / structure.

---

# 13. Motion

Le site doit être vivant sans être constamment animé.

Trois familles de mouvement :

### Reveal

Le contenu apparaît avec une légère progression verticale.

### Relationship

Les lignes et connexions se dessinent lorsqu'elles deviennent pertinentes.

### State

Un élément indigo apparaît lorsqu'une relation ou une décision devient active.

À éviter :

- parallax agressif ;
- scroll-jacking ;
- animations de texte interminables ;
- objets flottants ;
- transitions de type « startup ».

La motion doit rester compatible avec les objectifs de performance et d'accessibilité.

---

# 14. Responsive

Le responsive doit être pensé comme :

**Wide → Desktop → Tablet → Mobile**

Règle principale :

> **When space disappears, hierarchy remains.**

La grille peut évoluer :

`12 → 8 → 4 colonnes`

mais la relation :

**pensée → structure → preuve**

doit rester intacte.

---

# 15. Signature visuelle

La direction peut être résumée ainsi :

> **Editorial sophistication with the visual logic of a design system.**

Schéma directeur :

```text
         THOUGHT
            │
            │
      ──────┼────────
            │
       DECISION
            │
       ┌────┴────┐
       │         │
     SYSTEM     PROOF
       │         │
       └────┬────┘
            │
        EXPERIENCE
```

Le site doit finalement devenir lui-même une démonstration du positionnement de Guilherme.

Il ne dit pas seulement :

> « Je conçois des systèmes. »

**Il se comporte comme un système.**

---

# 16. Prochaine étape de conception

Le Visual Experience System étant défini, la suite logique est de passer aux **maquettes haute fidélité**.

Ordre recommandé :

1. **Home** — établir le langage visuel complet.
2. **Approche** — tester la dimension éditoriale.
3. **Agentica** — développer la dimension systémique et le moment « wow ».
4. **DTGen** — tester la dimension produit / outil.
5. **Parcours** — traduire le système dans une timeline éditoriale.
6. **À propos** — introduire davantage l'humain.
7. **Contact** — conclusion minimale.

La Home servira de référence pour les tokens, la grille, la typographie, les composants, les espacements, les annotations et les interactions.
