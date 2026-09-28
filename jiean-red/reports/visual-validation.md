# Visual validation

What was verified about `jiean-red`'s appearance, by what means, and what was
not verified at all. The first four layers below are exact and machine-checked;
the last is genuinely absent, and this document says so rather than describing it
as if it had run.

| Layer | Method | Result |
|---|---|---|
| Colour tokens | `npm run 8:package-diff` — role-by-role diff of `dist/tokens.full.json` | 8 of 30 roles differ, each as recorded; 22 identical |
| Non-colour tokens | same run — typography, spacing and radii compared without normalisation | identical (10 / 13 / 5 entries) |
| Component tokens | same run — 61 components compared after normalising colour | identical; 26 colour roles appear inside them |
| Example source | same run — 6 pages + stylesheet compared after normalising name and colour | character-identical |
| Rendered output | `npm run check:visual` — headless capture of both packages, pixel and landmark diff | **not run on this machine** (§5) |

`npm run check` runs the first four layers on every commit; the visual chain is
local-only by design (§5).

## 1. The colour layer, as changed

Eight of the 30 roles are different. `primary` is the brand red from the 捷安
brand guide; `text-primary`, `tooltip` and `mask` take the brand grey; the four
primary derivatives were derived by holding the WCAG relative luminance of their
`arco-blue` counterpart (see `DESIGN.md` §Colors, and `npm run 7:jiean-red-ramp`, which
re-derives them and fails if any step drifts).

| Role | `arco-blue` | `jiean-red` | Δ luminance |
|---|---|---|---|
| `primary` | `#165DFF` | `#D7000F` | −0.00738 |
| `primary-hover` | `#4080FF` | `#FF303F` | −0.00016 |
| `primary-active` | `#0E42D2` | `#A80B16` | −0.00021 |
| `primary-disabled` | `#94BFFF` | `#FFA4AA` | −0.00064 |
| `primary-subtle` | `#E8F3FF` | `#FFEEEF` | +0.00164 |
| `text-primary` | `#1D2129` | `#353535` | −0.150 |
| `tooltip` | `#1D2129` | `#353535` | −0.150 |
| `mask` | `#1D212999` | `#35353599` | −0.150 |

`mask` is the one role whose value carries its alpha as a trailing hex byte, so
the comparison is on the whole value rather than on a six-digit prefix.

The remaining 22 roles — the neutral surfaces, the three status colours, the
dark-mode steps — are identical, which is a decision and not an oversight. The
brand grey was scoped to the three dark anchors rather than to every neutral, so
that the surface ramp keeps the contrast it was tuned for.

## 2. Contrast, in the composition that ships

Every pair this design system uses is enumerated in the contract and recomputed
from the resolved tokens by `npm run 3:verify-generated`. All 44 pairs were
recomputed for this package rather than inherited:

- **30 pass** their WCAG floor (4.5:1 for text, 3:1 for non-text).
- **14 are exempt** under the five documented exemptions E1–E5, each still a
  genuine failure of the crude ratio — which is what an exemption records.
- **0 fail.**

The pairs closest to their floor all moved the safe way:

| Pair | `arco-blue` | `jiean-red` | Floor |
|---|---|---|---|
| `primary` on `primary-subtle` | 4.62:1 | **4.81:1** | 4.5 |
| `primary` on `canvas` | 4.68:1 | **4.85:1** | 3.0 (non-text) |
| `white` on a `primary` fill | 5.19:1 | **5.39:1** | 4.5 |
| `primary` focus ring on `surface` | 5.39:1 | **5.39:1** | 3.0 |

The cost is paid by the dark text, as expected when a near-black is replaced by a
mid-grey: `text-primary` on `surface` drops from 16.13:1 to **12.27:1**, and the
weakest pairing it takes part in — on `error-subtle` — is **10.76:1**. Far above
the 4.5:1 floor, but a smaller margin than `arco-blue`'s, so it is the number to
watch if the grey is ever darkened further.

`primary` on the three dark surfaces is 3.32 / 2.91 / 2.20:1 against a 3:1
non-text floor. This is exemption E5 and was already exempt in `arco-blue`
(3.44 / 3.02 / 2.29:1): the brand red makes those pairs marginally worse, not
better. `DESIGN.md` states the rule that follows — on a dark surface the brand red
is used as a fill with light text on it, never as a thin line or a small glyph.

## 3. This package's own render evidence

The render layer runs for `jiean-red`. `npm run 4:capture` rendered the four example
pages in a headless browser at 1270×848 and recorded their computed styles under
`reports/evidence/captures/`; `npm run 5:compare` compared those recordings against the
same reference values `arco-blue` is measured against, and reports **75 of 75 values
matching, no drift**: 16 pixel probes over the four page pairs, 38 dashboard landmarks
through the exact-selector probe, and 21 shell landmarks on the other three pages.

Two of those 75 values are colour, and both are expected rather than drift:

- the selected sidebar row paints its text in this package's `primary` (`#D7000F`)
  where the reference application paints its own blue. Selection is a role, and
  repainting it is what a colour variant does; the comparison therefore asserts this
  package's `primary`, not the reference literal.
- the pixel probes sample the same three neutrals (`#E5E6EB`, `#FFFFFF`, `#F2F3F5`) in
  both packages, because those values are unchanged and the probes were chosen to read
  geometry rather than colour.

What the comparison cannot describe is how the brand red *looks*: contrast is computed
from tokens (§2), and the reference site has no brand red to compare against. The
committed previews under `examples/*.png` do carry it on their pixels — `npm run
10:screenshots` counts between 554 and 6,646 pixels of `#D7000F` per page — which proves
the value reached the render, not that it was reviewed by eye.

`arco-blue/reports/visual-validation.md` records the same comparison for that package
and describes how the reference values were obtained. What made this package's run
possible is the viewport calibration described in §5.

## 4. The two reds

`error` stays `#F53F3F`, so the system now ships two reds a few steps apart:
`primary` is `#D7000F`, `error` is `#F53F3F`, and their subtle surfaces are
`#FFEEEF` and `#FFECE8`, whose largest per-channel difference is 7/255 — below
what a reader can separate on a tinted panel.

No colour value fixes that, and redefining `error` would change a token consumers
already depend on, so the split is carried by rule instead, in `DESIGN.md`
§Colors, `docs/feedback.md` and `docs/accessibility.md`:

- **brand red** — identity, primary action, selection, the active step;
- **status red** — failure, destructive action, an error message.

The two are never interchanged, and a subtle tint is never the only signal for a
state: every use of one is accompanied by text or an icon.

## 5. The render layer: what it took to run it

`npm run check:visual` captures each package with a headless browser and diffs its
pixels and landmarks. The first attempt to run it for this package failed, and the
reason was environmental, not conceptual. The capture needs the page to see a
deterministic 1270×848 viewport; `--window-size` sizes the browser *window*, and the
height its frame costs is not fixed. On this machine it measured 87px when `arco-blue`'s
evidence was produced, and 96–107px on a later run taken while a normal Chrome session
was open — varying per page and per launch, which leaves the stored picture cropped or
padded against a viewport the page never had. That run had already overwritten
`arco-blue`'s captures before the mismatch was noticed; the committed captures were
restored from git and the run's output was discarded rather than kept as evidence.

Two changes came out of it, both in the repository:

- `scripts/visual/capture-screenshots.mjs` now calibrates instead of assuming: it
  measures the viewport the page actually receives, resizes the window by exactly the
  shortfall, re-takes the page, and fails rather than storing a picture taken in the
  wrong viewport. `WINDOW_CHROME_PX` is a starting point, not a constant.
- The cross-package comparison no longer needs a browser at all
  (`scripts/compare-packages.mjs`, §1–§3), so the "colour only" claim is checked on
  every commit instead of only where a browser can be run quietly.

With the calibration in place the run succeeded for all three packages on 2026-09-28,
and §3 records its result for this package. The same command regenerates it:

```bash
npm run 4:capture
npm run 5:compare
```

## 6. Known unknowns

- **The brand red's appearance is measured as coverage, not reviewed as design.** The
  previews prove `#D7000F` reaches the pixels (554 to 6,646 per page); whether the
  rendered red reads correctly on screen — gamma, display profile, a designer's eye —
  was not assessed.
- **The two subtle reds are not separable on screen** (§4). Rule-carried.
- **Dark mode is inherited, not re-derived**: the dark ramp keeps `arco-blue`'s
  steps, and the E5 pairs are marginally worse against the brand red (§2).
- **`text-primary` is lighter than in `arco-blue`** (12.27:1 against 16.13:1 on
  surface). Intentional and quantified; its tightest pairing is 10.76:1.
- **Nothing here was measured on a second display.** No gamma, colour-profile or
  font-smoothing question was examined.
