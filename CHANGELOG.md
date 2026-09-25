# Changelog

All notable changes to `arcopro` and to this repository. The version policy that
governs which digit moves is in `arcopro/README.md` §Versioning.

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
