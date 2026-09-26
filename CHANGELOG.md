# Changelog

All notable changes to the style packages in this repository. The version policy
that governs which digit moves is in each package's `README.md` §Versioning.

## 1.1.0 — 2026-09-26

The `brandcolor` style package: the same design system with 捷安's brand colours in
place of the blue, and a machine check that says so.

**A second package.** `brandcolor/` carries the whole package — contract, 14 pattern
documents, token artifacts, six example pages, three evidence reports, and its own
README in English and Chinese. Eight of the 30 colour roles differ from `arcopro`:
捷安红 `#D7000F` as `primary`, 深灰 `#353535` for `text-primary`, `tooltip` and `mask`,
and four primary steps (`hover`, `active`, `disabled`, `subtle`) derived by holding
each step's WCAG relative luminance, so that the measured contrast transfers. The
other 22 colours, all 10 typography roles, all 13 spacing steps, all 5 radii and all
61 component tokens are identical.

**Proof rather than assertion.** `npm run 8:package-diff` compares the two packages on
two layers and fails on anything it cannot explain: **tokens** (exactly the eight
documented roles differ, each by its recorded value; typography, spacing and radii
byte-identical; the 61 component tokens identical once colour is normalised to its
role) and **source** (the six pages and their stylesheet character-identical once the
package name and the 22 colour roles they name are normalised). It runs inside
`npm run check`, and therefore in CI.

**Contrast re-audited, not inherited.** All 44 pairs were recomputed for the brand
palette: 30 pass, 14 are covered by the five documented exception codes, none fails.
The tightest pairs improved — `primary` on `primary-subtle` 4.62 → 4.81:1, white on a
primary fill 5.19 → 5.39:1 — while the brand grey cost the dark text some headroom:
`text-primary` on surface 16.13 → 12.27:1, its weakest pairing 10.76:1.

**Tooling.** Every script now works per package (`--package=` filters validation,
export, verification, hygiene and capture). `scripts/derive-brand-ramp.mjs --check`
re-derives the ramp from the brand literals and fails if a step drifts.
`scripts/compare-packages.mjs` is the cross-package proof above.
`scripts/visual/capture-screenshots.mjs` now calibrates the window height against the
viewport each page actually receives instead of assuming a fixed browser chrome, and
fails rather than storing a picture taken in the wrong viewport. `npm run check` is
now `1 → 2 → 3 → 7 → 8 → 6`; `npm run check:visual` (`4 → 5`) stays local-only.

**Not done, and recorded as not done.** The render-level comparison was not run for
`brandcolor`: this desktop could not hand a headless browser a stable 1270×848
viewport, so no capture evidence for the package is committed.
`brandcolor/reports/visual-validation.md` §5 gives the reason and the commands that
produce it; §3 sets out what carries over from `arcopro`'s measurement, and why the
pixel probes it rests on are colour-neutral.

**Known limitations.** The brand red and the status red are neighbouring reds whose
subtle tints differ by 7 of 255, so the split is carried by rule rather than by
appearance; the brand grey takes only the light theme's three dark anchors; four of
the five primary steps are derived values rather than brand-issued ones. See
`brandcolor/README.md` §Known Limitations.

## 1.0.0 — 2026-09-26

Initial release of the JIEAN Design System and its `arcopro` style package.

**The contract.** `arcopro/DESIGN.md` — 30 colours, 10 typography roles in pixel
dimensions, 13 spacing steps, 5 radii, 61 component tokens, plus the prose that
says what they are for. Reverse-engineered from Arco Design Pro and its theme
package; every value's origin is recorded in `arcopro/reports/source-audit.md`.

**Token artifacts.** Three official Google DESIGN.md CLI exports — DTCG
(`tokens/tokens.json`), CSS custom properties (`dist/tokens.css`, 48 properties)
and a Tailwind theme (`dist/tailwind.theme.json`) — and two derived files that
carry what the official formats drop: `dist/tokens.full.css` (217 custom
properties) and `dist/tokens.full.json` (lossless, including line heights, font
features and all 61 component tokens). The derived pair records the contract's
sha256 in its header.

**Pattern documentation.** Fourteen documents under `arcopro/docs/`, each with the
same structure: purpose, structure and values, composition, states, density, the
empty/long/contradictory cases, contrast and accessibility, and do's and don'ts.

**Reference implementation.** Six framework-free pages under `arcopro/examples/` —
index, dashboard, list, form, detail and a components page — served by one
stylesheet written against the tokens.

**Visual validation.** A capture-and-compare chain (`npm run 4:capture`,
`npm run 5:compare`) that renders the example pages and compares 89 values against
readings taken from the live reference: 16 pixel checks over four page pairs, 38
dashboard landmarks, and 35 shell landmarks on the other five pages. Result: 89 of
89 match, no drift. Six defects in this system were found and fixed by it, and the
comparison itself was corrected twice — a mislabelled reference reading and a
stale-screenshot race. Accepted deviations are listed in
`arcopro/reports/visual-validation.md` §5.

**Verification.** `npm run check` — the contract lints clean (0 errors, 0 warnings,
1 info), the exports are re-verified against the contract on every run (26 checks,
including six toolchain-limitation assertions, and a 44-pair contrast audit in which
30 pairs pass, 14 are covered by five documented exception codes, and none is
undocumented), and repository hygiene is enforced.

**Known limitations.** Two 14px line heights exist in the reference where this
system uses one; no official export carries the component tokens; `lineHeight`
must be a pixel dimension in the contract, because a unitless multiplier is
dropped silently. All three are in `arcopro/README.md` §Known Limitations and in
the reports.
