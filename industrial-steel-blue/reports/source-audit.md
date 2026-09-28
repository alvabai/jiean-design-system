# Source audit — IndustrialSteelBlue

**Package:** `industrial-steel-blue` (display name `IndustrialSteelBlue`, 中文名 工业钢蓝)
**Audited:** 2026-09-28
**Contract:** [`../DESIGN.md`](../DESIGN.md)
**Machine-readable verdict:** [`machine-validation.json`](machine-validation.json)

This report answers one question: *where did every claim in the contract come
from, and what exactly was read to support it?* It is deliberately a record of
sources and of what was taken from each, not a summary of the design.

Nothing in this package is copied from another design system. The rules are
JIEAN's; the numbers that describe the baseline are measured from public official
material, and each one is attributed below. **This package is not an official Arco
Design publication, theme, package, specification or endorsed distribution.**

---

## 1. Version completeness

Every source is pinned to a version and a commit, because "the current Arco" is
not a stable referent and a design system that cannot say what it was researched
against cannot be re-verified later.

| Source | Version | Commit / identity | Date | How it was read |
|---|---|---|---|---|
| Arco Design (component library, styles, tokens) | latest release tag `2.66.16` | `fbf2ec0a8cc28a5d20f1f82de6c2c4196ef66950` | published 2026-07-14 | published package artifacts: `@arco-design/web-react@2.66.16` `dist/css/arco.css`, `components/style/theme/default.less`, `components/style/theme/colors.less`, per-component `style/index.less` |
| Arco Design Pro (the shell and page patterns) | repository `main`, version string `2.8.1` in the commit message; **no GitHub release exists (HTTP 404 on `/releases`)** | `bb6aebcceca6` | 2024-04-26 | the running reference application and its published tokens (`@arco-themes/react-arco-pro/tokens.less`), plus measured computed styles recorded in `arco-blue/reports/evidence/` |
| Google DESIGN.md (format, parser, linter, exporter) | latest release `0.4.0` | `9bf8eae67128` | 2026-07-27 | the CLI itself, `@google/design.md@0.4.0`, resolved from this repository's `node_modules` |
| This repository's own local CLI | `0.4.0` | same as above | 2026-09-28 | `package.json` `devDependencies`, so the pinned version and the upstream latest agree |

Two things follow from the table and are worth stating plainly:

- **Arco Design Pro has no release to pin to.** The version must be recorded as a
  commit (`bb6aebcceca6`) plus the date, and a future re-audit has to diff that
  commit rather than compare version numbers.
- **The DESIGN.md format is pre-1.0** (`0.4.0`). The contract is written to the
  documented subset of that version, and the CLI is pinned in `package.json` so a
  later release cannot silently change what "valid" means here.

Research date for this package: **2026-09-28**.

---

## 2. What was read, and what each source was used for

### 2.1 Arco Design implementation (the numeric baseline)

| Read | Used for | Where it appears in the contract |
|---|---|---|
| `components/style/theme/colors.less` — the ten-step ramps | the `arcoblue` ladder this package's family is derived from | Colors → "Where the blue comes from" |
| `components/style/theme/default.less` — `@transition-duration-1…5`, `@transition-duration-loading`, the five named cubic-béziers, `@code-family`, `@font-size-body`, `@line-height-base`, `@z-index-*` | the whole Motion section, the `code` typography role, the z-index anchors | Motion; Typography |
| `components/Button/style/index.less` | Button's `transition: all 0.1s linear` | Motion → component mapping |
| `components/Input/style/index.less` | Input's three-property 0.1s transition | Motion → component mapping |
| `components/Modal/style/index.less` | Modal's `opacity, transform` at duration 4 with `overshoot` | Motion → component mapping |
| `components/Collapse/style/index.less` | Collapse height and arrow at duration 2 with `standard` | Motion → component mapping |
| `components/style/theme/animations/{fade,slide,zoom}.less` | fade/slide/zoom keyframes; zoom's asymmetric in/out curves | Motion → component mapping |
| `components/Grid/interface.ts` | the seven responsive breakpoints (`xs <576 … xxxl ≥2000`) | Responsive Behavior |
| `dist/css/arco.css` (published build) | authoritative resolved light and dark ramps, including the dark **re-mapping** | Colors → dark anchors |

### 2.2 Arco Design Pro (the shell and page patterns)

The measured values in the shell, table, form, search and detail patterns come
from the reference application as captured for the `arco-blue` package and kept in
that package's evidence directory:

| Evidence file | Contents | Reused here as |
|---|---|---|
| `arco-blue/reports/evidence/arco-pro-live-probe.json` | computed styles read from the live application | the baseline column of the metric tables in `docs/` |
| `arco-blue/reports/evidence/arco-pro-metrics.json` | per-page geometry for the four reference pages | the geometry this package's example pages reproduce |
| `arco-blue/reports/evidence/arco-theme-tokens.json` | 837 resolved theme variables across 34 component groups | the source of every inherited alias (`--color-*`, `--color-text-*`, `--color-fill-*`, `--color-border-*`) |
| `arco-blue/reports/evidence/visual-comparison.json` | pixel comparison of the built pages against the reference | the reason the layout in this package's examples is trusted |

No new capture of the reference site was taken for this package. The baseline it
was researched against is unchanged, so re-capturing it would produce evidence
about 2024-era Arco rather than new information; what changed is the palette and
the additions listed in section 4.

### 2.3 Design values

The four stated values were read from Arco's own specification documents rather
than paraphrased from a summary: `site/docs_spec/values-of-arcodesign.zh-CN.md`
(**清晰、一致、韵律、开放**) and `values-of-arcodesign.en-US.md` (**Clear,
Consistent, Rhythmic, Open**). The contract restates them as testable rules, and
attributes them at that level of precision because the `arco.design` site's own
documentation routes for the specification pages return 404, so the repository
path is the source that actually resolves.

---

## 3. The colour derivation

The one part of this package that is genuinely new is the interactive colour, and
it is derived by a script rather than chosen by eye:
[`../../scripts/derive-steel-ramp.mjs`](../../scripts/derive-steel-ramp.mjs).

Three rules transform the baseline's `arcoblue` ladder, and applying them to all
ten steps preserves the *contrast relationships* between the steps while changing
the hue and the chroma:

| Rule | Value | Why |
|---|---|---|
| Hue | forced to **210°** | cool blue-steel, distinct from the baseline's 222° |
| Saturation | **× 0.38** | industrial restraint: the accent must read as steel, not as advertising |
| Luminance of steps 5, 6, 7 | **× 0.78** | the three interaction steps are the ones that carry white text and must survive the saturation drop; the other seven steps keep their baseline luminance exactly, so the disabled/subtle tints stay where the baseline put them |

| Step | Baseline `arcoblue` | IndustrialSteelBlue | Role in this contract |
|---|---|---|---|
| 1 | `#E8F3FF` | `#EDF2F7` | `primary-subtle` |
| 2 | `#BEDAFF` | `#CBD9E8` | — |
| 3 | `#94BFFF` | `#A8C0D8` | `primary-disabled` |
| 4 | `#6AA1FF` | `#83A5C7` | — |
| 5 | `#4080FF` | `#4C7BA9` | `primary-hover` |
| 6 | `#165DFF` | `#3E6489` | `primary` |
| 7 | `#0E42D2` | `#324C65` | `primary-active` |
| 8 | `#072CA6` | `#293E54` | — |
| 9 | `#031A79` | `#1B2A39` | — |
| 10 | `#000D4D` | `#0E1720` | — |

Five of the ten steps carry no role. They are recorded rather than dropped,
because a product may legitimately need a fourth-tint chart series or a
deeper-than-active pressed state, and because a family with holes in it invites
invention — see Known Gaps in the contract.

`primary-on-dark` `#628DB8` is a sixth value with no light-family role. It exists
because this hue is darker than the baseline's and therefore fails on dark
surfaces where the baseline only struggled: it is solved against `dark-surface`,
the anchor a text-bearing dark control is drawn on, at 4.50:1.

Every number below is asserted on every run of `npm run 9:steel-ramp`, which fails
if the contract and the derivation disagree:

| Check | Value | Threshold |
|---|---|---|
| white text on a `primary` fill | 6.197:1 | ≥ 4.5 AA |
| `primary` as text on `surface` | 6.197:1 | ≥ the baseline's own 5.15:1 |
| `primary` as text on `canvas` | 5.581:1 | ≥ 4.5 AA |
| hover lighter than default | true | required |
| active darker than default | true | required |
| disabled darker than subtle | true | required |
| `primary-on-dark` on `dark-canvas` | 5.129:1 | ≥ 4.5 |
| `primary-on-dark` on `dark-surface` | 4.502:1 | ≥ 4.5 |
| `primary-on-dark` on `dark-elevated` | 3.41:1 | **fails — recorded as a gap, with a placement rule** |

The derivation found two errors on its first run and both were fixed rather than
tolerated: an assertion that compared the wrong direction (`disabled` was checked
for being *lighter* than `subtle`), and a dark interactive colour inherited at the
baseline's luminance, which measured 4.213:1 on `dark-surface` and was raised
until it reached the threshold. The second is a deliberate, documented improvement
over the baseline and is written as such in the contract.

---

## 4. What this package adds, and what it inherits unchanged

The relationship to the baseline is not "a recolour" and the package does not
claim to be one. It is a superset with an allow-list, and
`npm run 8:package-diff` proves the superset claim mechanically against
`arco-blue`: every baseline typography role, spacing step, radius and component
token is still present, and is still identical once colour is normalised.

**Inherited unchanged:** layout geometry (60 / 220 / 48 / 1100px shell), the
neutral greys, the semantic colours and their tints, the typography scale minus
the addition below, the spacing steps, the radii, the four data-visualisation
colours, and every component token the baseline defines.

**Added or changed by this package:**

| Addition | Kind | Reason |
|---|---|---|
| the ten-step steel blue family (5 roles) | changed | the package's identity |
| `primary-on-dark` | added | the darker hue fails on dark surfaces where the baseline only struggled |
| `error-strong`, `error-strong-hover`, `error-strong-active` | added | white text on the baseline's error red is 3.71:1; a destructive fill has to reach AA, and the three steps are the same red family |
| `code` typography role | added | an industrial record carries device numbers and tolerances that must not read as prose |
| `button-outline`, `button-text`, `button-danger` (+ 2 states) | added component tokens | five button variants are specified; the baseline named two |
| `input-disabled`, `input-error`, `input-readonly` | added component tokens | the form states are specified per state rather than per component |
| `table-row-selected`, `table-empty`, `table-loading` | added component tokens | table states an enterprise list actually has |
| `menu-item-hover` | added component token | hover was described but not tokenised |
| `dark-link`, `dark-button-primary` | added component tokens | dark surfaces need controls, not only anchors |
| Motion, Responsive Behavior, Iteration Guide, Known Gaps, Reference Sources | added sections | §32/§35 of the task book; the baseline application documents none of them |
| the component coverage and state coverage matrices | added sections | makes coverage reviewable instead of asserted |

---

## 5. What was not done

- **No new reference-site capture.** Stated above: the baseline is unchanged, and
  its measurements are imported rather than re-taken.
- **No claim of visual parity with the reference site.** This package deliberately
  does not look like the reference; what it reuses is structure and geometry.
  `reports/visual-validation.md` records what its own previews do and do not prove.
- **No tablet or mobile rendering.** The baseline does not render below 1100px, so
  the two smaller breakpoints in Responsive Behavior are marked `INFERRED` in the
  contract, and the example previews are desktop-only.
- **No dark-theme validation.** The dark values are anchors with measured
  contrasts; a full dark theme would need its own audit of every pair it uses.
- **No component library.** The package specifies tokens and rules. It does not
  ship implementations.
