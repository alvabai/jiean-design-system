# industrial-steel-blue

**English** · [中文版](README_zh-CN.md)

The industrial style package of the JIEAN Design System.

> **Independence.** `industrial-steel-blue` is produced by JIEAN (捷安高科) from
> publicly available official Arco Design / Arco Design Pro material, which it uses
> as a research baseline. **It is not an official Arco Design publication, theme,
> package, specification or endorsed distribution.** Arco is credited as a source,
> never as the author of this package.

## What is industrial-steel-blue?

`industrial-steel-blue` is JIEAN's industrial application style package: an
enterprise admin language whose interactive colour is a deep blue-steel
(`primary` `#3E6489`) rather than a saturated product blue. It keeps the whole
non-colour layer of the sibling package `arcopro` — the shell geometry, the
neutral greys, the typography scale, the spacing steps, the radii, the
data-visualisation colours and the pattern language — and replaces the accent
family with a ten-step steel blue derived from the baseline's own ramp.

It is a **superset with an allow-list, not a recolour**, and that claim is proved
mechanically rather than asserted. `npm run 8:package-diff` re-derives it from both
packages' tokens and example sources:

| Layer | Relationship to `arcopro` |
|---|---|
| Colours (34 roles) | 25 identical · 5 changed by a recorded transform · 4 added |
| Typography (11 roles) | 10 identical · 1 added (`code`) |
| Spacing (13) and radii (5) | identical, every one |
| Components (75 tokens) | 61 identical · 14 added |
| Example pages | adapted, and reported as adapted — not copied |

Every added token is named in the script's relationship map, so an unexplained
addition fails the run. The five changed colours are `primary`, `primary-hover`,
`primary-active`, `primary-disabled` and `primary-subtle`; the four additions are
`primary-on-dark` and the `error-strong` ladder that makes a destructive fill
legible.

The colour is derived, not chosen by eye, and the derivation is a script rather
than a paragraph:

| Rule | Value |
|---|---|
| Hue | forced to 210° |
| Saturation | × 0.38 |
| Luminance of steps 5, 6, 7 | × 0.78 (the three interaction steps) |

```text
#EDF2F7  #CBD9E8  #A8C0D8  #83A5C7  #4C7BA9  #3E6489  #324C65  #293E54  #1B2A39  #0E1720
 subtle  —        disabled  —       hover    primary  active   —        —        —
```

`npm run 9:steel-ramp` re-derives all ten steps from the baseline and the three
rules and fails if `DESIGN.md` disagrees. It also asserts eight contrast
properties of the result; the two that decided the design are that white on a
`primary` fill reaches 6.197:1 and that `primary` as text on `surface` (6.197:1)
exceeds the baseline's own 5.15:1 rather than merely clearing AA.

Three findings came out of those assertions rather than out of taste, and all
three are in the contract with their numbers:

- **The baseline's error red cannot carry white text.** `#F53F3F` measures 3.71:1.
  A destructive *fill* now uses `error-strong` `#CB272D` (5.43:1), hovering to
  `#A1151E` (7.95:1) and pressing to `#770813` (11.48:1). This is the one place in
  the language where hover **darkens**, and the contract records it as a deliberate
  exception with the reason.
- **A darker blue needs a second dark interactive colour.** `primary` reads 2.89:1
  on `dark-canvas` and 1.92:1 on `dark-elevated`; `primary-on-dark` `#628DB8` is the
  answer, solved against `dark-surface` at 4.50:1. It reaches 5.13:1 on
  `dark-canvas` and only **3.41:1 on `dark-elevated`**, which is recorded as an open
  gap with a placement rule instead of being rounded away.
- **Five of the ten steps carry no role.** They are recorded rather than deleted,
  because a family with holes invites invention.

It is deliberately small in vocabulary and strict in the few things it says. It
does not specify a component library: an implementation may use Arco React, a
Tailwind build, hand-written CSS or anything else, and the values and patterns come
from here.

The name is a style package name, not a product name.

## Visual Examples

Four pages, each rendered from the committed HTML at a 1280×900 viewport, DPR 1,
light theme, no JavaScript, no build step. Each PNG sits beside the page it was
rendered from, and each page is self-contained: its stylesheet is inlined, so
`examples/` is a flat directory of eight files.

| Page | Preview |
|---|---|
| Workbench — KPI row, trend chart, recent-records table, right rail | ![Workbench](examples/dashboard.png) |
| List page — query area, toolbar, dense table | ![List page](examples/list-page.png) |
| Form page — three-column grouped form, inline states, fixed action bar | ![Form page](examples/form-page.png) |
| Detail page — steps, current and previous parameter blocks, related records | ![Detail page](examples/detail-page.png) |

The previews are checked, not decorative: `npm run 10:screenshots` verifies each
file exists, is a real PNG, is exactly 1280×900, is no older than the HTML and
tokens it was rendered from, and **carries the declared palette on its pixels** —
`canvas`, `surface`, `primary` and `text-primary` must each cover at least the
documented floor, and neither the baseline's blue nor the sibling package's brand
red may appear at all. Regenerate with `npm run 11:screenshots:write`. What the
renders do and do not prove is in `reports/visual-validation.md`.

## Design Source

The baseline this package was researched from is Arco Design and Arco Design Pro,
and the exact revisions matter more than the names:

| Source | Version | Commit | Date | Role |
|---|---|---|---|---|
| Arco Design | `2.66.16` (latest release tag) | `fbf2ec0a8cc28a5d20f1f82de6c2c4196ef66950` | 2026-07-14 | the ramps, the motion values, the breakpoints, the component geometry |
| Arco Design Pro | repository `main` (version string `2.8.1` in the commit message; **no release exists**) | `bb6aebcceca6` | 2024-04-26 | the shell and page patterns, the measured geometry |
| Google DESIGN.md | `0.4.0` (latest release) | `9bf8eae67128` | 2026-07-27 | the contract format, its parser, linter and exporters |

Research date: **2026-09-28**. Two facts are worth stating plainly: Arco Design Pro
has no release to pin to, so it is recorded as a commit; and the DESIGN.md format
is pre-1.0, so the CLI is pinned in `package.json` and its real behaviour is
recorded in `reports/designmd-validation.md`.

What was read from each source, what it was used for, and what was deliberately
not taken are in `reports/source-audit.md`. The reference-site measurements are
imported from `arcopro/reports/evidence/` rather than re-captured: the baseline has
not changed, and re-measuring it would produce evidence about the same revision.

JIEAN's own additions — the steel family, the danger ladder, the `code` role, the
component and state matrices, the Motion, Responsive Behaviour, Iteration Guide,
Known Gaps and Reference Sources sections, and the accessibility decisions — are
marked as JIEAN's wherever they appear.

## What DESIGN.md Is

`DESIGN.md` is the design contract. It is two documents in one file:

- **The frontmatter is machine-readable.** It holds the token set that the official
  Google DESIGN.md toolchain reads to lint, resolve and export. It is the single
  source of truth for every value: no colour, size, space, radius or component
  token exists in this package that is not there.
- **The prose is for people.** It says what each group of tokens is for, where the
  numbers came from, which tradeoffs were taken, and what will go wrong if they are
  ignored. Thirteen sections: the eight canonical ones plus Motion, Responsive
  Behavior, Iteration Guide, Known Gaps and Reference Sources.

Everything else in this package is derived from it or explains it: `tokens/` and
`dist/` are generated from it, `docs/` applies it, `examples/` demonstrates it, and
`reports/` records its provenance. **A change to a value starts in `DESIGN.md`**,
then flows outward through `npm run 2:export`.

## Repository Structure

```text
industrial-steel-blue/
├── DESIGN.md                the contract: tokens + reasoning
├── README.md                this file
├── README_zh-CN.md          the Chinese edition
├── docs/                    14 pattern documents
│   ├── foundations.md            the model behind the tokens
│   ├── application-shell.md      the page frame
│   ├── page-layout.md            page types and grids
│   ├── navigation.md             the sidebar, breadcrumb and tabs
│   ├── forms.md                  labels, controls, validation, the submit bar
│   ├── tables.md                 the workhorse surface
│   ├── search-filter.md          query and result
│   ├── cards.md                  card anatomy and the KPI card
│   ├── feedback.md               messages, confirmations, loading, empty
│   ├── data-visualization.md     charts and the metric layer
│   ├── workflow.md               multi-step and approval patterns
│   ├── permission.md             role-visible UI and the safety rules
│   ├── accessibility.md          contrast, focus, keyboard, motion
│   └── responsive.md             the supported range and what degrades
├── tokens/
│   └── tokens.json              official DTCG export
├── dist/
│   ├── tokens.css               official CSS custom properties
│   ├── tailwind.theme.json      official Tailwind theme
│   ├── tokens.full.css          derived: 262 custom properties (lossless)
│   └── tokens.full.json         derived: lossless, includes line heights,
│                                font features and all 75 component tokens
├── examples/                the reference implementation, flat and self-contained
│   ├── dashboard.html       + dashboard.png
│   ├── list-page.html       + list-page.png
│   ├── form-page.html       + form-page.png
│   └── detail-page.html     + detail-page.png
└── reports/
    ├── source-audit.md          where every value came from
    ├── designmd-validation.md   what the toolchain really does
    ├── visual-validation.md     what the previews prove
    ├── machine-validation.json  the structural checks, machine-readable
    └── evidence/                the derivation and the cross-package diff
```

## Quick Start

```bash
git clone <this repository>
cd jiean-design-system
npm install                     # one dependency: @google/design.md
npm run check                   # validate → export → verify → ramps → diff → screenshots → hygiene
open industrial-steel-blue/examples/dashboard.html
```

Node 18 or newer. There is no build step: the example pages are self-contained
HTML with the stylesheet inlined, so they open straight from the filesystem.

The scripts:

| Command | What it does | Fails when |
|---|---|---|
| `npm run 1:validate` | lints `DESIGN.md` with the official toolchain, then runs 12 structural checks | the contract does not parse, lint reports an error, or a structural check fails |
| `npm run 2:export` | runs the official CLI for three formats, then derives the lossless pair | the CLI fails, or an artifact comes out empty |
| `npm run 3:verify-generated` | 26 checks: provenance, losslessness, known toolchain limitations, contrast | any artifact drifted from the contract |
| `npm run 4:capture` | renders the `arcopro` example pages headless and records computed styles | a page does not reach a 1270×848 viewport, or Chrome fails |
| `npm run 5:compare` | compares the `arcopro` pages against the recorded reference | any compared value drifts |
| `npm run 6:hygiene` | placeholders, links, JSON validity, required files, naming | a link is broken, a file is missing, a placeholder survives |
| `npm run 7:brand-ramp` | re-derives the `brandcolor` ramp from the brand literal | a derived step drifts |
| `npm run 8:package-diff` | proves both cross-package relationships: `arcopro`↔`brandcolor` differ only in colour; `arcopro`↔`industrial-steel-blue` differ only inside the recorded allow-list | a token outside the allow-list moves, or an addition is unrecorded |
| `npm run 9:steel-ramp` | re-derives the ten steel steps and asserts eight contrast properties | a step or a ratio drifts, or a claim in the contract contradicts the derivation |
| `npm run 10:screenshots` | checks the four previews: presence, PNG validity, exact 1280×900, freshness, pixel palette | a preview is missing, stale, the wrong size, or carries the wrong colours |
| `npm run 11:screenshots:write` | re-renders the four previews headless | a page fails to reach 1280×900 |
| `npm run 12:metrics` | prints the package's final metrics, each with the rule that produced it | never — it is a report, not a gate |
| `npm run check` | `1 → 2 → 3 → 7 → 9 → 8 → 10 → 6` | as above; this is the CI gate |
| `npm run check:visual` | `4 → 5` | as above; needs Chrome, so it is not in CI |

## Human Developer Usage

You do not need an AI tool, a React project or this repository's tooling to build
against `industrial-steel-blue`.

1. **Read the design specification.** `DESIGN.md`. Read the prose sections for the
   part of the UI you are building; the frontmatter is for the tools.
2. **Inspect semantic tokens.** The 34 colours are named by role — `primary`,
   `canvas`, `surface`, `text-secondary`, `border`, `primary-on-dark` — not by
   appearance. Read `dist/tokens.full.json` for the complete resolved set.
3. **Use the generated CSS.** `dist/tokens.full.css` defines 262 custom properties,
   ready for plain CSS, or `dist/tokens.css` for the official output exactly as the
   CLI produced it. `dist/tailwind.theme.json` drops into a Tailwind config.
4. **Find component guidance.** `docs/` — one document per pattern area, each with
   values, states, density and contrast notes.
5. **Find enterprise patterns.** `docs/workflow.md` (multi-step and approval),
   `docs/permission.md` (role-visible UI), `docs/tables.md` (the dense surface),
   `docs/feedback.md` (the states that are usually forgotten).
6. **Implement in any stack.** The examples are framework-free HTML and CSS; the
   same values work in React, Vue or a server-rendered page. Nothing in `DESIGN.md`
   refers to a component library.
7. **Validate your changes.** `npm run check` after editing the contract; and if you
   touched a page, `npm run 11:screenshots:write` followed by `npm run 10:screenshots`.

## Generic AI Coding Agent Usage

Any capable coding agent, whatever the vendor:

```text
Before implementing or modifying UI:

1. Read industrial-steel-blue/DESIGN.md.
2. Read the relevant files under industrial-steel-blue/docs/.
3. Treat JIEAN Design System / industrial-steel-blue as the authoritative
   visual and interaction specification.
4. Reuse the documented tokens and patterns.
5. Do not introduce conflicting design values.
```

That is the whole instruction. It is vendor-neutral on purpose: the authority is
the file, not the tool reading it.

## Codex Example

```text
Read AGENTS.md, then follow it.
Task: build the equipment inspection record list for the workshop module.
It is a list page: read industrial-steel-blue/docs/tables.md, search-filter.md and
page-layout.md before writing any UI. Use industrial-steel-blue/dist/tokens.full.css
for values, and take the table's states from DESIGN.md › State coverage.
```

## Claude Code Example

```bash
claude "Read AGENTS.md and industrial-steel-blue/DESIGN.md, then build the
        inspection detail page following docs/page-layout.md and cards.md."
```

## Gemini CLI Example

```bash
gemini -p "Follow AGENTS.md. Build a device registration form using
           industrial-steel-blue: read DESIGN.md plus docs/forms.md and
           docs/application-shell.md first, and use only the documented tokens."
```

## Cursor / Copilot Usage

Add to the project's rules file:

```text
JIEAN Design System / industrial-steel-blue is the authoritative design
specification for this repository. Read AGENTS.md before generating UI, then
industrial-steel-blue/DESIGN.md and the relevant document under
industrial-steel-blue/docs/. Never introduce a colour, size, spacing, radius or
pattern that is not in the specification.
```

## Using the Tokens

Pick the artifact that matches the consumer:

| Consumer | Use | Why |
|---|---|---|
| Plain CSS, any framework | `dist/tokens.full.css` | 262 custom properties: every colour, type role, space, radius and component token, with line heights |
| Tailwind | `dist/tailwind.theme.json` | official theme output; line height and weight per size |
| Design tooling, other languages | `tokens/tokens.json` | official DTCG output |
| Anything that needs the resolved set | `dist/tokens.full.json` | lossless: includes what no official format carries |

```css
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--rounded-md);
  padding: var(--spacing-card);
}
```

Two rules apply whichever artifact you use: **reference tokens by role, not by
value**, and **do not hard-code a value that has a token**. If a needed value has no
token, that is a gap in the contract — raise it as a contract change rather than a
local exception.

## Validation

`npm run check` is the gate, and everything it runs is exact and browser-free: it
lints and structurally validates `DESIGN.md`, exports the tokens with the official
CLI, verifies the generated artifacts against the contract (including that the
contract's sha256 in the artifacts still matches), re-derives both colour ramps,
proves both cross-package relationships, checks the four previews — including their
pixels — and checks repository hygiene. CI runs the same command, so a green run
locally means a green run in CI.

Three results are worth knowing about, and each is kept as an artifact rather than a
sentence:

- **`reports/machine-validation.json`** — the 12 structural checks, each with its
  evidence: reference resolution across the whole contract, section presence and
  order, the component coverage matrix, state coverage, typography and colour
  coverage, foreign-contamination and legacy-naming scans. This layer is what the
  official format cannot express.
- **`reports/evidence/palette-derivation.json`** — the ten-step derivation, the
  three transformation rules, the eight contrast assertions and the values they were
  checked against.
- **`reports/evidence/package-diff.json`** — the cross-package proof described above,
  including the source-level comparison and the list of files this package does not
  copy, with the reason for each.

`reports/designmd-validation.md` records what the official toolchain really does,
including the three behaviours that shape how the contract has to be written: a
defined-but-unreferenced colour is reported, `borderColor` is not a legal sub-token,
and a unitless `lineHeight` is dropped silently. `reports/visual-validation.md`
records what the four previews prove and what they do not.

## Updating industrial-steel-blue

1. Change a value in `industrial-steel-blue/DESIGN.md`. Nothing else has a value in
   it.
2. `npm run 2:export` — regenerate the token artifacts. The contract's sha256 is
   written into the derived files.
3. `npm run 3:verify-generated` — confirm the exports still agree and nothing was
   lost. A change that breaks a limitation check means the toolchain changed
   behaviour, which is worth knowing before the rest of the repository follows.
4. `npm run 9:steel-ramp` — if you changed the accent, the derivation has to agree
   with the contract; if it does not, one of the two is wrong and the script says
   which values disagree.
5. If the change affects the shell, a page or a component's appearance, re-render
   the previews with `npm run 11:screenshots:write`.
6. Update `docs/` where the change contradicts something written there. The docs are
   checked for links, not for agreement — keeping them in step is a review
   responsibility.
7. `npm run check`, then add a `CHANGELOG.md` entry.

A change to the colour layer has two extra gates: `npm run 9:steel-ramp` re-derives
the family, and `npm run 8:package-diff` proves that nothing outside the recorded
allow-list moved. A change to the shared baseline geometry, on the other hand, is a
repository-level change: it has to be made in every package that inherits it, and
`8:package-diff` will fail until it is.

## Versioning

`industrial-steel-blue` versions as a design system, not as a library. The package
version is `MAJOR.MINOR.PATCH` with the four kinds of change distinguished by what a
consumer has to do:

| Change | Version | What a consumer does |
|---|---|---|
| Documentation only — prose, examples, clarifications | patch | nothing |
| Token value change within the same role and intent (a corrected hex, a tightened spacing step) | patch | re-import the artifact |
| New tokens, new roles, new patterns; or visual behaviour changes in a way that is additive | minor | re-import, adopt at leisure |
| A token's meaning changes, a token is removed, a pattern is replaced, or an existing screen would look different after re-importing | major | schedule the migration; do not re-import silently |

**A changed hex is a patch only if the role kept its intent** — if `primary` stops
meaning blue-steel, that is a major change regardless of how few characters were
edited. And **a major change must name its replacement**: this system has no room
for a value that is deprecated without a successor.

## Known Limitations

Stated here because a design system that hides its limits gets used past them. Each
of these also appears in the contract's Known Gaps section, which is the
authoritative form.

1. **`primary-on-dark` does not reach AA on `dark-elevated` (3.41:1).** It passes on
   `dark-canvas` (5.13:1) and on `dark-surface` (4.50:1), and the rule is a placement
   rule: text-bearing dark controls go on `dark-surface`. Solving it properly needs a
   second interactive colour for elevated dark surfaces, which this package does not
   define.
2. **The danger button darkens on hover, unlike every other filled control.** It
   follows the red family down (`#CB272D` → `#A1151E` → `#770813`) because the
   alternative is a fill that cannot carry white text at AA. If someone "fixes" the
   hover to lighten it for consistency, the contrast failure comes back.
3. **The dark surface family is not a dark theme.** Nine values are anchors with
   measured contrasts; a screen that ships dark UI must re-audit every pair it uses.
4. **Five of the ten steel steps carry no role.** A product that needs a fourth chart
   tint or a deeper pressed state will reach for them, and doing so is a contract
   change, not a local decision.
5. **No official export carries the 75 component tokens, and only one carries
   typography.** `dist/tokens.css` is colours, spacing and radii only. Use
   `dist/tokens.full.css` or `dist/tokens.full.json` when you need component tokens
   or type. The exact losses are in `reports/designmd-validation.md`.
6. **`lineHeight` must be written as a px dimension in the contract.** A unitless
   multiplier is dropped silently by the toolchain — no error, no warning. The
   contract uses pixel values and `3:verify-generated` asserts the pitfall still
   exists.
7. **The baseline is not responsive below 1100px**, and neither is this package's
   documented layout: `--component-shell-content-width` is a minimum, not a fixed
   width. Below 1100px the layout changes character, and `docs/responsive.md` says
   what is expected instead. The two smaller breakpoints in Responsive Behavior are
   marked `INFERRED`, not measured.
8. **The four previews render the light theme only, on desktop.** They do not render
   the dark anchors, the palette swatches or the type specimens, and they are not a
   substitute for looking at a real screen at another size or density.
9. **States were not visually compared.** Hover, focus, pressed, disabled, loading
   and error are specified, tokenised and contrast-audited, and the coverage matrices
   make the set reviewable — but a static render does not exercise them.
10. **The examples are a reference implementation, not a component library.** They
    are HTML with an inlined stylesheet, written to demonstrate the specification.
    They are not intended to be copied into a product as-is.
11. **The relationship to the baseline is proved, the *fidelity* to it is not
    claimed.** This package is not trying to look like Arco Design Pro; what it
    reuses is structure and geometry, and what it deliberately changes is recorded in
    `reports/evidence/package-diff.json`.
