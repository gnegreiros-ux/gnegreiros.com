# gnegreiros.com — Design Reference

**Purpose of this document:** single source of truth for generating high-fidelity mockups of this portfolio site. Written for use by ChatGPT, Claude Code, or any other tool producing visual designs or code for this project. All decisions below are locked unless explicitly marked "open."

**Owner:** Guilherme Negreiros — UX Systems Designer, Trois-Rivières, Québec.

---

## ⚠️ This file replaces all other visual design documents

**This document is the single, authoritative source for the site's visual design.** It consolidates and supersedes:
- `Visual Experience System — v0.1.md`
- `visual-experience-system-v0.2.md`
- `portfolio-gnegreiros-phase2-design.md`

Those three files are now obsolete for visual design purposes — do not read them, do not follow instructions from them, do not treat them as sources of truth. If any of their content ever contradicts this file, **this file wins.** Claude Code and ChatGPT should read only this document (plus the two exceptions below) before generating or modifying any visual design or front-end code for this project.

**Claude Code is authorized to delete these three obsolete files** from the project/repo once their content has been confirmed as fully captured here — no need to ask for confirmation first, they are safe to remove.

**Two other documents remain separate and still apply, because they cover different ground:**
- `portfolio-gnegreiros-contenu-phase1.md` — page copy/content (English text), not visual design
- `synthese-phase3-technologie-portfolio.md` — technical/infrastructure decisions (stack, hosting, CI/CD); the subset that constrains visual design is already summarized in §8 below

**Visual inspiration reference:** `/instructions/Image_ChatGPT_Portfolio_Juil_28_2026.png` — a ChatGPT-generated visual draft of all 7 pages. Useful for overall tone, layout rhythm, and composition ideas, but **not authoritative** — where it conflicts with the rules in this document (e.g. it shows a photo in the Home hero and metric cards in the Agentica hero, both explicitly rejected — see §4.6 and §5), this document's rules take precedence.

---

**Changelog:**
- v0.4 — added dot-mark decorative motif (§4.9): CSS-only token-grid dot accent, 2–3 instances per page in empty corners, `--color-text-secondary` at low opacity; established during the Home page build and confirmed with Guilherme, applies to all future pages
- v0.3 — added iconography rule (Lucide Icons, §4.7), imagery/company-marks policy (§4.8), increased section/card spacing (§4.4); reaffirmed "no Home hero image" and "no Agentica hero metrics" after a ChatGPT-generated visual draft surfaced both — both rules stay locked (see §4.6 and §5); declared this file as the sole visual design reference, superseding the three prior design documents

---

## 1. Positioning (non-negotiable — governs every visual choice)

Guilherme is a **systems builder / infrastructure thinker** — never a screen designer, never a UI executor. The site is about him: his thinking, his judgment, his trajectory. Agentica is his strongest proof point, in service of that positioning — not the subject of the site.

**Primary audience:** decision-makers (VPs, directors) evaluating expertise — not recruiters scanning keywords.

**Governing thesis line:**
> I don't design screens. I design the infrastructure that keeps decisions consistent long after the screens change.

Never present Guilherme as: a screen designer, a UI executor, a tool expert. Always present: systems builder, UX Systems Designer, decision infrastructure, governance, durability.

---

## 2. Site architecture

```
gnegreiros.com
├── / (Home)
├── /approche (Approach)
├── /agentica (Case study — Agentica)
├── /dtgen (Case study — DTGen)
├── /parcours (Enterprise context — RAMQ, Akinox, Intact, Ovation, Canadel)
├── /a-propos (About)
└── /contact
```

- Browser tab title: `Guilherme Negreiros — UX Systems Designer`
- Language at launch: **English only**. i18n architecture (EN default / FR / PT-BR) is built into the code from day one but translated content ships progressively after launch. `defaultLocale: "en"`, `prefixDefaultLocale: false` → EN has no prefix, FR is `/fr/...`, PT-BR is `/pt-br/...`
- Content strategy: page-level content flows in Markdown/MDX (Content Collections); interface strings (nav, buttons, footer) live in a separate short dictionary
- NDA projects (RAMQ, Akinox, Intact, Ovation): mentioned only in brief context, no confidential detail

---

## 3. Narrative arc

The site should move the visitor through, in order:

**THESIS → CONTEXT → THINKING / PROOF / TOOL → CONTEXT (enterprise) → INVITATION**

Equivalently, page by page:

```
Home       → Here's what I build.
Approach   → Here's how I think.
Agentica   → Here's proof this thinking works at scale.
DTGen      → Here's this thinking turned into a practical tool.
Parcours   → Here's where this thinking has been tested.
About      → Here's the person behind the system.
Contact    → Here's where the conversation starts.
```

The visitor should progressively shift from "Guilherme is a designer" → "Guilherme understands how organizations make, transmit, and preserve design decisions" → "I want someone like him for this problem."

---

## 4. Visual design system — locked tokens

### 4.1 Direction
Hybrid of two explored directions: **editorial** (light background, serif voice, warm neutral palette — matches the writing tone) + **token grid** (structure as a discreet visual motif, not a dominant theme). Rejected direction: "technical blueprint" (near-black background, monospace-heavy) — reads as dev-tool rather than design.

### 4.2 Color

| Token | Value | Usage |
|---|---|---|
| `--color-bg` | `#FAF8F4` | Main background — warm off-white, never pure white |
| `--color-text-primary` | `#231F1A` | Primary text — warm near-black, never pure black |
| `--color-text-secondary` | `#6B645C` | Subtitles, metadata, secondary text |
| `--color-line` | `#E4DFD8` | Separators, hairline borders |
| `--color-accent` | `#4C49E2` | Links, CTAs, rare structural marks (see 4.5) |

**Forbidden:** large indigo fills, indigo gradients, indigo as a section background.

### 4.3 Typography

| Token | Value | Usage |
|---|---|---|
| `--font-serif` | **Fraunces** (variable, large optical size, weight 400–500, no soft/italic style) | Titles, theses, large statements |
| `--font-sans` | **Inter** (variable) | Body text, navigation, UI |
| `--font-mono` | **IBM Plex Mono** | Structural annotations only — measurements, technical labels, uppercase eyebrows |

Fraunces carries the system's personality; Inter and Plex Mono stay deliberately quiet so the hierarchy (serif = thinking / sans = information) doesn't get diluted.

**Type scale** (modular ratio ~1.333, base 18px):

| Token | Size | Line-height | Usage |
|---|---|---|---|
| `--text-hero` | `clamp(2.5rem, 5vw + 1rem, 4.5rem)` (40–72px) | 1.05 | Hero thesis |
| `--text-h1` | `clamp(2rem, 3vw + 1rem, 3rem)` (32–48px) | 1.1 | Page titles |
| `--text-h2` | `2rem` (32px) | 1.2 | Section titles |
| `--text-h3` | `1.5rem` (24px) | 1.3 | Sub-sections, card titles |
| `--text-lead` | `1.3125rem` (21px) | 1.5 | Intro paragraphs, editorial transitions (deliberately breaks strict scale) |
| `--text-body` | `1.125rem` (18px) | 1.6 | Running body text |
| `--text-small` | `0.9375rem` (15px) | 1.5 | Metadata, captions |
| `--text-mono` | `0.8125rem` (13px), letter-spacing 0.02–0.08em | 1.4 | Structural annotations, uppercase labels — always fixed, never scaled up |

### 4.4 Spacing & layout

| Token | Value |
|---|---|
| `--space-unit` | `8px` base rhythm |
| `--grid-columns` | 12 desktop / 4 mobile |
| `--content-max` | `1280px` (`80rem`) |
| `--measure` | `680–760px` reading width for body text |
| `--radius` | `0–2px` — near-zero, deliberate (editorial/architectural feel, not SaaS) |
| `--shadow` | none / near-absent |

**Revised (v0.3) — more breathing room between sections and cards:**

| Token | Value | Usage |
|---|---|---|
| `--space-section` | `10rem` (160px) desktop / `6rem` (96px) mobile | Vertical gap between major page sections (was `6rem`/`96px` flat — increased after visual review showed sections reading as cramped) |
| `--space-card-gap` | `4rem` (64px) desktop / `2rem` (32px) mobile | Gap between sibling cards/teasers in a grid (was `2rem`/`32px` flat) |
| `--space-card-padding` | `2.5rem` (40px) | Internal padding for bordered cards (principle cards, Agentica metric list, etc.) — was implicit/undefined, now explicit so cards don't feel tight |

Rule of thumb going forward: when in doubt, add space rather than a border or a shadow to separate elements. Density reads as "SaaS dashboard"; generous space reads as "editorial authority" — the latter is always the goal for this site.

### 4.5 Structural accent rule (indigo)

Indigo as a **line or structural mark** (beyond ordinary text/link/CTA use) is reserved for a small number of intentional moments, each with a specific function — not decorative, not repeated casually:

1. Border + left rule on the 3 principle cards on the Approach page — underlines a principle
2. Vertical line on the Approach teaser on Home — signals an entry point
3. Connecting line trailing the "Let's talk →" link on the final Home CTA — extends an invitation

No other structural use of indigo without an explicit deliberate decision (ADR-style). Rarity and intentionality are the rule — not strict uniqueness to one location.

### 4.6 Explicit anti-patterns (avoid at all costs)

- No hero image, no photo, no mockup screenshot in the Home hero — the subject is thinking, not a picture. **Reaffirmed:** a ChatGPT-generated visual draft included a photo (architectural staircase) in the Home hero — explicitly rejected, thesis stays alone.
- No metric cards / big-number-with-small-label as the hero's opening move
- No numbered markers (01/02/03) unless content is a genuine sequence
- No "design system porn": no dashboards, no metrics scattered everywhere, no grids visible everywhere, no gratuitous animation, no glassmorphism, no omnipresent indigo gradient, no "AI startup" aesthetic
- No warm-cream-background + terracotta-accent cliché, no near-black + acid-green cliché, no broadsheet-hairline-newspaper cliché — these are current AI-generated-design defaults and must be deliberately avoided
- Sophistication comes from judgment and restraint, not from quantity of effects

### 4.7 Iconography

**Icon set: [Lucide Icons](https://lucide.dev)** — outline style, `stroke-width: 1.5`, sized `18–20px` for inline use (contact details, nav utilities) and `20–24px` for standalone use (theme toggle, scroll hint). Never filled/solid icon styles, never multi-color icon sets, never emoji as icon substitutes.

Icons are used sparingly and functionally, never decoratively:
- Contact page: `Mail`, `MapPin`, `Linkedin`, `Github` next to each contact line
- Nav utility: `Sun`/`Moon` if a theme toggle exists, `ArrowUpRight` for external links (GitHub, Storybook, live site) instead of plain text arrows when the link leaves the site
- Scroll hint: `ChevronDown` or `ArrowDown`, animated per the existing bob keyframe

Internal links keep the existing text arrow (`→`) convention — Lucide icons are reserved for external links, contact channels, and utility controls, not for every link on the site. Overusing icons where text arrows already work would add visual noise the system doesn't need.

### 4.8 Imagery & company marks

- **No stock photography.** Generic architectural/interior stock photos (staircases, arches, columns) read as templated and contradict the "no photo as a substitute for thinking" principle — even outside the Home hero, on pages like Parcours or About. If a page benefits from a visual break, prefer an abstract token/diagram treatment (in the style of the Agentica micro-diagram) over a photograph, or leave the space as a rhythm break with no image at all.
- **No real company logos.** The Parcours page must not reproduce the actual logos/wordmarks of RAMQ, Akinox, Intact, Ovation, or Canadel — these are trademarked marks and not Guilherme's to reuse visually, and doing so also risks reading as an implied endorsement. Represent each company as a plain-text wordmark set in `--font-mono`, uppercase, `--color-text-secondary` — consistent with how the rest of the system already treats structural labels. No logo marks, no brand colors borrowed from these companies.
- Photography, if used anywhere on the site (e.g. About page drums/church reference), should be original or clearly abstracted — never third-party stock imagery presented as if it depicts Guilherme's actual life or work.

### 4.9 Decorative motif — dot-mark (token grid accent)

A small CSS-only radial-gradient dot grid, echoing the "token grid" concept from §4.1, used as a quiet corner accent — never a dominant pattern. Established during the Home page build (v0.4); apply to every subsequent page.

- **Implementation:** pure CSS, no image assets, no JS —
  ```css
  .dot-mark {
    position: absolute;
    pointer-events: none;
    background-image: radial-gradient(var(--color-text-secondary) 2px, transparent 2px);
    background-size: 14px 14px;
    opacity: 0.2;
  }
  ```
- **Color:** always `--color-text-secondary` at low opacity (0.15–0.2) — never `--color-accent`. Indigo stays reserved for the 3 structural moments in §4.5; the dot-mark must not become a 4th unauthorized indigo use.
- **Placement:** 2–3 instances per page, in otherwise-empty corners (e.g. top-right of the hero, top-right of a content section, bottom-right near a closing CTA). Never overlapping text, never centered, never load-bearing for layout.
- **Sizing:** one larger instance (~220×160px) for the page's hero/lead section, smaller companion instances (~140×100px) elsewhere — creates rhythm rather than mechanical repetition of an identical block.
- **Responsive:** hidden below `1024px` (`display: none`) — decorative only, not essential content.
- **Reference implementation:** `src/pages/index.astro` (`.dot-mark` base class + page-specific position modifiers, e.g. `.hero__mark`, `.teasers__mark`, `.final-cta__mark`).

---

## 5. Page-by-page information hierarchy

| Page | Structure |
|---|---|
| **Home** | Hero alone → light transition → 3 equal-weight teasers (Approach / Agentica / DTGen) → separate Parcours teaser → isolated final CTA |
| **Approach** | Hero → narrative text → **structured break (3 principles, the page's only list)** → text → text (AI position, no CTA) |
| **Agentica** | Hero = thesis only, **no metrics up front** (deliberate: numbers don't impress in the design-systems world). **Reaffirmed:** a ChatGPT-generated visual draft included metric cards (801+ tokens, 163 components, etc.) directly in the hero — explicitly rejected, metrics stay in the results section at the bottom → context → **governance & decisions = densest section, the real differentiator** → architecture → results/proof as a sober list at the very bottom, with live/GitHub/Storybook links |
| **DTGen** | Same pattern as Agentica but deliberately **flat** — no section dominates, so it doesn't compete visually with Agentica |
| **Parcours** | Single hero (no per-company sub-hero) → 5 reverse-chronological blocks: RAMQ slightly emphasized (current context), then Akinox, Intact, Ovation, Canadel |
| **About** | Hero → trajectory (long-form narrative) → "what systems builder actually means" (2nd heaviest section after hero) → drums/church (short, understated) → links |
| **Contact** | Reduced to **2 levels only**: short hero + contact details. No closing note. |

---

## 6. Home page — locked copy (English, default locale)

**Hero**
> I design the decision systems that hold digital experiences together — for the humans who decide, and now for the AI agents who execute.

**Transition**
> Over 20 years, that means moving from screens to the infrastructure behind them — tokens, governance, and the workflows that keep decisions consistent long after the people who made them have moved on.

**Teaser 01 — Approach**
> How I think about design systems
> Design systems don't fail because people are careless — they fail because nothing preserves the reasoning behind what was built.
> Read the approach →

**Teaser 02 — Agentica**
> Agentica — proof at scale
> 800+ tokens. 70+ versioned decisions. 14 components shipped, more in progress. A personal system built to test a governance model most enterprise design systems are missing.
> Explore Agentica →

**Teaser 03 — DTGen**
> DTGen — proof in practice
> A tool built from a real recurring frustration: generating a coherent token set shouldn't mean starting from a blank page every time.
> See DTGen →

**Context teaser — Parcours**
> Tested inside real organizations
> Public health, insurance, manufacturing — this thinking has been shaped under real regulatory and technical constraints, not just in personal projects.
> See the context →

**Final CTA**
> If you're evaluating how to make design decisions durable in your organization, I'd be glad to talk through what that looks like.
> Let's talk →

---

## 7. Hero — pixel-level composition (desktop, reference for all other page heroes)

12-column grid, `24px` gutter, `1280px` content max.

| Zone | Spacing | Detail |
|---|---|---|
| Nav height | `5rem` (80px) fixed | Logo left, nav links + Contact link right |
| Nav → annotation | `7.5rem` (120px) | |
| Annotation | auto | `--text-mono`, uppercase, letter-spacing 0.08em, `--color-text-secondary` |
| Annotation → thesis | `2rem` (32px) | |
| Thesis line 1 | `--text-hero` | `--color-text-primary`, max-width ~9 of 12 columns |
| Thesis line 2 (indented) | `--text-hero` | shifted ~2 columns right; "AI agents" / "execute" in `--color-accent` on hover only |
| Thesis → divider | `6rem` (96px) | |
| Divider | `1px`, `--color-line`, full width | |
| Divider → footer | `1.5rem` (24px) | |
| Hero footer | `--text-mono` | two blocks, space-between: "20+ years" / "Design → Systems → Governance" |
| Footer → scroll hint | `3rem` (48px) | discreet arrow, animated |
| Total hero height | `~90vh` minimum, not forced `100vh` | hints at content below without dominating |

**Micro-interaction (CSS only, no JS island required — matches "zero JS by default"):**
```css
.hero__thesis .accent-word{ color: var(--color-text-primary); transition: color .35s ease; }
.hero:hover .hero__thesis .accent-word{ color: var(--color-accent); }
```
On hover, "AI agents who execute" (or just "execute") shifts from primary text color to accent indigo — the only color change in the hero, reinforcing that decision stays human, execution is agentic.

**Mobile (4-column grid, `24px` side padding):**
- Thesis drops to its lower `clamp()` bound (40px), no line-2 indent, all left-aligned
- Hero footer stacks vertically, `16px` gap
- Nav collapses to logo + simplified menu

---

## 8. Technical constraints that affect design decisions

These aren't visual tokens, but they bound what's feasible and must be respected by any mockup or generated code:

- **Stack:** Astro (SSG), zero JavaScript by default — any interactivity must be justifiable as a minimal "island" or, preferably, pure CSS (as in the hero hover above)
- **Site is NOT an Agentica pilot** — independent codebase, own repo, no dependency on Agentica's components or visual style; only its quality standards (W3C, accessibility, decision governance) are echoed conceptually
- **Quality bar:** WCAG 2.1 AA, Core Web Vitals targets (LCP < 2.5s, CLS < 0.1, INP < 200ms), semantic HTML5, W3C-valid markup
- **Agentica metrics displayed on the site (800+ tokens, 70+ ADRs, 14 components, 10 quality gates) must never be hardcoded** — read at build time from the public GitHub repo (`github.com/gnegreiros-ux/agentica-design-system`); agentica.design is the source of truth for these figures, which change continuously
- **Responsive breakpoints:** design for 12-column desktop down to 4-column mobile without losing rhythm; no separate "mobile design" — same system, different column count

---

## 9. Open items (not yet locked)

- Pixel-level composition for the 6 non-Home pages (only Home has full detail so far)
- Exact component behavior for the Agentica micro-diagram and DTGen flow teaser at intermediate breakpoints (tablet)
- Whether the site-wide nav should reduce further on scroll beyond the current border/blur treatment
