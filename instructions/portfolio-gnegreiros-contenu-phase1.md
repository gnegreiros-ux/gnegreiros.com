# Portfolio gnegreiros.com — Contenu & Storytelling (Phase 1)

**Statut :** Contenu validé (toutes pages + corrections). SEO et Phase 2 (Design) sont également verrouillés depuis — voir `portfolio-gnegreiros-seo-metadata.md` et `portfolio-gnegreiros-phase2-design.md`
**Langue de rédaction :** Anglais (langue par défaut du site)
**Langues du site :** EN (défaut) · FR · PT-BR
**Titre de page (browser tab) :** `Guilherme Negreiros — UX Systems Designer`

---

## Arborescence du site

```
gnegreiros.com
│
├── / (Home)
├── /approche (Approach / Philosophy)
├── /agentica (Case study — Agentica)
├── /dtgen (Case study — DTGen)
├── /parcours (Enterprise context — RAMQ, Akinox, Intact, Ovation, Canadel)
├── /a-propos (About)
└── /contact
```

**Décision en suspens :** page "Parcours" en une seule page avec 4-5 sections courtes (hypothèse retenue) vs. slugs dédiés par entreprise — à confirmer si besoin.

---

## Objectifs & audience (rappel stratégique)

- **Objectif du site :** asseoir l'autorité dans la communauté Design Systems + servir de vitrine solide pour une recherche future
- **Audience prioritaire :** décideurs (VP, direction) qui évaluent une expertise — pas des recruteurs RH qui scannent des mots-clés
- **Positionnement central :** le site parle de **Guilherme** — sa pensée, son jugement, sa trajectoire de systems builder. Agentica est la preuve la plus forte, au service du positionnement, pas l'inverse.
- **Projets NDA (RAMQ, Akinox, Intact, Ovation) :** mentionnés brièvement en contexte seulement, sans détails confidentiels

---

## 1. Home

**Hero**
> I design the decision systems that hold digital experiences together — for the humans who decide, and now for the AI agents who execute.

**Transition paragraph**
> Over 20 years, that means moving from screens to the infrastructure behind them — tokens, governance, and the workflows that keep decisions consistent long after the people who made them have moved on.

**Teaser — Approach**
> How I think about design systems
> Design systems don't fail because people are careless — they fail because nothing preserves the reasoning behind what was built.
> [Read the approach →](/approche)

**Teaser — Agentica**
> Agentica — proof at scale
> 800+ tokens. 70+ versioned decisions. 14 components shipped, more in progress. A personal system built to test a governance model most enterprise design systems are missing.
> [Explore Agentica →](/agentica)

**Teaser — DTGen**
> DTGen — proof in practice
> A tool built from a real recurring frustration: generating a coherent token set shouldn't mean starting from a blank page every time.
> [See DTGen →](/dtgen)

**Teaser — Parcours**
> Tested inside real organizations
> Public health, insurance, manufacturing — this thinking has been shaped under real regulatory and technical constraints, not just in personal projects.
> [See the context →](/parcours)

**Final CTA**
> Let's talk
> If you're evaluating how to make design decisions durable in your organization, I'd be glad to talk through what that looks like.
> [Get in touch →](/contact)

---

## 2. Approach / Philosophy

**Hero**
> How I think about design systems
> I don't design screens. I design the infrastructure that keeps decisions consistent long after the screens change.

**1. The problem I keep solving**
> Across public health platforms, insurance systems, and manufacturing tools, I've seen the same failure repeat: design decisions get made once, then forgotten. A color changes without anyone remembering why the original one was chosen. A component gets rebuilt three times because nobody knew it already existed. The system doesn't fail because people are careless — it fails because nothing preserves the reasoning behind what was built.

**2. What I actually optimize for**
> My work sits at the intersection of design, development, and operations — what's often called DesignOps. Three principles guide it:
>
> - **Decisions need memory.** A design system isn't a component library; it's a record of trade-offs. If you can't explain *why* a decision was made, you can't safely change it later.
> - **Workflows are part of the design.** The handoff between design and development is where most systems quietly break down. I treat that pipeline — not just the interface — as something to be designed deliberately.
> - **Durability beats novelty.** Tools and frameworks turn over every few years. A system built to depend on one tool is a system with an expiration date. I build for standards that outlast the tooling around them.

**3. How this shows up in practice**
> At RAMQ, this means building UX foundations for an organization before building screens. At Akinox, it meant designing the pipeline between design and development, not just the interface on top of it. In Agentica, my personal system, it means every meaningful decision is logged, versioned, and traceable — proof that this approach scales beyond a single project.

**4. Where AI fits**
> AI agents can accelerate parts of this work — detecting inconsistencies, drafting documentation, proposing components. What they can't do is decide. Governance stays human, by design. My approach to AI in design systems isn't about automation for its own sake; it's about making sure automation never outruns accountability.

---

## 3. Case Study — Agentica

**Hero**
> Agentica — The decision system for humans and AI agents
> A personal design system built to prove a thesis: design decisions should survive the tools, the frameworks, and the people who made them. 801+ tokens. 163 components. 71 ADRs. Zero vendor lock-in.

**1. Context / Problem**
> Most design systems document *what* was built. Few preserve *why*. Teams lose decisions in Figma comments, Slack threads, and tribal knowledge — so the same debates repeat, documentation drifts out of date, and the system becomes dependent on the one person who remembers the reasoning. I built Agentica to test whether that problem is solvable — not for a client, but as proof of a governance model I believe enterprise design systems are missing.

**2. Decisions & governance (the differentiator)**
> Every meaningful choice in Agentica is logged as a versioned Architecture Decision Record — context, alternatives considered, trade-offs, and the reasoning behind the final call. This isn't documentation after the fact; it's the mechanism that lets the system evolve without erasing its own history.
>
> Agentica is also built with AI agents as a defined actor in the system — with an explicit boundary. Agents can detect inconsistencies, propose components, and draft documentation. They cannot approve, deploy, or bypass governance. The human keeps the final word, by design, not by convention.

**3. Architecture**
> One source of truth feeds four levels: foundations (tokens), semantic contracts, components, and applications. Components are built as native Web Components — framework-independent, compiled to CSS, JS, Tailwind, Angular, iOS, and Android targets. If the AI tooling around it disappeared tomorrow, the system would keep running: documented, scripted, and tested to prove it.

**4. Result / proof**
> - 800+ design tokens across light and dark modes
> - 14 components shipped, with more in active development
> - 70+ ADRs capturing the reasoning behind every major decision
> - 10 automated quality gates (accessibility WCAG 2.1, visual regression, documentation, token consistency)
> - Live system: [designsystem.gnegreiros.com](https://designsystem.gnegreiros.com) · [GitHub](https://github.com/gnegreiros-ux/agentic-design-system) · [Storybook](https://main--6a1c1e665ec5fe8fc0540983.chromatic.com/)

> ⚠️ **Note interne (ne pas publier) :** ces chiffres (800+ tokens, 70+ ADRs, 14 composants, 10 quality gates) sont les chiffres réels confirmés par Guilherme le 24 juillet 2026 — volontairement plus prudents que ceux affichés sur agentica.design (qui annonce 801+ tokens, 163 composants, 71 ADRs), un écart déjà identifié dans le projet Promotion Agentica. Le portfolio reste cohérent même si agentica.design ne l'est pas encore. **Décision technique en attente (Phase 3) :** afficher ces chiffres dynamiquement depuis une source de vérité exposée par agentica.design plutôt qu'en dur, une fois la source corrigée.

---

## 4. Case Study — DTGen

**Hero**
> DTGen — Design Token Generator
> A web application I built to solve a problem every design system faces on day one: generating a coherent, well-structured token set without starting from a blank page.

**1. Context / Problem**
> Every new design system starts the same way — a designer manually defining color scales, spacing units, and type ratios, one value at a time, with no consistent method for deriving them. I built DTGen to remove that friction: a tool that generates a complete, structured token set from a small set of inputs, instead of hours of manual guesswork.

**2. What it does**
> DTGen imports primitives from established sources — Tailwind, Ant Design, Open Color, or a custom JSON file — and generates coherent palettes in HSL, LCH, or OKLCH from a handful of base colors. It also configures typographic scales using custom ratios, and saves configurations for reuse across projects. The goal isn't to replace design judgment; it's to remove the repetitive part of the work so that judgment can focus on what actually matters — consistency and intent.

**3. Why it matters**
> DTGen reflects the same instinct behind Agentica, at a smaller scale: don't solve the same foundational problem twice. It's a practical tool built from a real recurring frustration, not a theoretical exercise.

**4. Status / proof**
> - Live beta: [dtgen.netlify.app](https://dtgen.netlify.app)
> - Supports Tailwind, Ant Design, Open Color, and custom JSON imports
> - Color generation in HSL, LCH, and OKLCH

---

## 5. Parcours — Enterprise Context

**Hero**
> Where this thinking gets tested
> Beyond my personal projects, this approach has been shaped — and tested — inside organizations with real constraints: regulatory, technical, and organizational. Here's the short version of each.

**1. RAMQ — Client Experience Bureau (BXC)**
*Nov. 2024 – present*
> Building UX foundations for RAMQ's Client Experience Bureau (Bureau d'expérience client) — the groundwork that has to exist before consistent screens can. Confidential by nature of the mandate; the work itself is structural, not visual.

**2. Akinox Solutions — Design Systems & Public Health**
*June 2023 – 2024*
> Designed multidisciplinary care journeys for public health platforms, and laid the foundations of a design-to-code system to close the gap between design intent and shipped product. This is where the thinking behind Agentica started taking shape — inside a real organization, under real constraints.

**3. Intact Insurance — UX Designer**
*April 2022 – April 2023*
> Redesigned an online insurance submission flow to reduce drop-off, working within strict regulatory compliance (AMF) alongside analytics and behavioral research teams. Proof that systems thinking holds up even inside heavily regulated environments.

**4. Réseau Ovation — UX/UI Specialist**
*Sept. 2021 – April 2022*
> Supported the migration of a legacy VB6 platform to the web, designing the workflow between design and development to protect consistency through a high-risk technical transition — not just the interface on either side of it.

**5. Canadel — Graphic Designer → UI/UX Designer**
*April 2012 – Sept. 2021*
> Started as a graphic designer in 2012 and organically grew into a UI/UX role by 2015, redesigning Canadel's product configuration tool and building the first analytics foundations to guide design decisions with real usage data. Nine years — the long version of "systems thinking wasn't a pivot, it was a progression."

---

## 6. About

**Hero**
> About
> Over 20 years, one continuous thread: turning visual work into systems that hold.

**1. The trajectory**
> I started in 1997 designing print ads and logos in Brazil. By 2001, I was building websites by hand — HTML, CSS, one client at a time. Over two decades, that same instinct — build something that works, then figure out how to make it hold — carried me from graphic design, to web design, to UI, to UX, to what I do now: designing the systems and governance that keep design decisions consistent at scale.
>
> It wasn't a pivot. Every step used what the last one taught me.

**2. What "systems builder" actually means**
> I don't think of myself as someone who designs screens — I design the infrastructure that makes screens consistent, explainable, and durable over time: tokens, component architecture, decision governance, and the workflows that connect design to development. That's what colleagues have consistently pointed to when describing how I work — not as a designer producing artifacts, but as someone building the systems that let a team produce consistently, without reinventing the same decisions over and over.

**3. Outside the systems**
> Trois-Rivières, Québec. Portuguese, French, and English. When I'm not working on design systems, I play drums at my church — a different kind of discipline: showing up, staying in time with other people, and trusting a structure you didn't build alone.

**4. Where to find the rest**
> LinkedIn · Resume (PDF) · [GitHub](https://github.com/gnegreiros-ux)

---

## 7. Contact

**Hero**
> Let's talk
> If you're evaluating how to make design decisions durable — across a team, a product, or an organization — I'd be glad to talk through what that looks like in practice.

**Contact options**
> - Email: guilherme@gnegreiros.com
> - LinkedIn: [linkedin.com/in/gnegreiros](https://www.linkedin.com/in/gnegreiros)
> - GitHub: [github.com/gnegreiros-ux](https://github.com/gnegreiros-ux)

*(Resume/CV : retiré temporairement — livrable séparé à produire après le lancement du site. À réintégrer une fois prêt.)*

**Closing note (optional)**
> Based in Trois-Rivières, Québec — working with teams anywhere.

---

## Prochaines étapes

- [x] Structure de la page Parcours : une seule page, confirmée
- [x] Contenu Home complet (hero, transition, teasers, CTA)
- [x] Chiffres Agentica corrigés (800+ tokens, 70+ ADRs, 14 composants, 10 quality gates)
- [x] Titre de page confirmé : `Guilherme Negreiros — UX Systems Designer`
- [x] CV/Resume retiré temporairement du Contact (livrable séparé, après le site)
- [ ] Traduction FR et PT-BR (une fois le contenu anglais définitivement verrouillé)
- [ ] **Métadonnées SEO** (title tags + meta descriptions par page) — à concevoir juste après validation finale du contenu, avant la Phase 2
- [x] **Phase 2 — Design** : direction visuelle, wireframes, hiérarchie de l'information (voir `portfolio-gnegreiros-phase2-design.md`)
- [ ] **Phase 3 — Technologie** : le site sera construit comme pilote d'une équipe produit consommant Agentica (Web Components, tokens, architecture i18n dès le départ pour EN/FR/PT-BR ; affichage dynamique des chiffres Agentica à évaluer une fois la source corrigée)
- [ ] Rappel hors périmètre : corriger l'écart de chiffres sur le site Agentica lui-même (projet Promotion Agentica)
