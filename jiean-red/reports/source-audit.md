# Source audit

What this design system was derived from, at which revision, by which method, and
what is still unverified. Every number quoted here can be re-derived by running
the commands in the last section.

## 1. Inputs and their revisions

| Input | Revision | How it was obtained | Evidence kept in this repository |
|---|---|---|---|
| `@arco-themes/react-arco-pro` | **0.0.7**, MIT | installed package; `tokens.less`, `variables.less`, `component.less`, `css/arco.css` read directly | `arco-blue/reports/evidence/arco-theme-tokens.json` (43,895 bytes) |
| Arco Design Pro source | commit **`bb6aebcceca6b294b438be4c13dc7328ee80d70b`**, 2024-04-26 | repository clone; page modules, `style/index.module.less` and `components/NavBar/style/index.module.less` read | values quoted inline in `arco-blue/reports/evidence/arco-pro-live-probe.json` and `jiean-red/docs/*` |
| `react-pro.arco.design` | live, signed-in session, 2026-09-26 | computed styles and box rectangles read from the running pages; screenshots taken | `arco-blue/reports/evidence/arco-pro-live-probe.json`, `arco-pro-metrics.json`, `reference-{dashboard,list,form,detail}.png` |
| `@google/design.md` | **0.4.0** | installed CLI; `dist/spec.md` read | `jiean-red/reports/designmd-validation.md` |
| `google-labs-code/design.md` | HEAD **`9bf8eae67128b6cc55ad9bf86665767deb4c11cd`** | revision resolved over the network at build time | the identity check in section 4 below |

The theme package and the Pro source are two different things and were used for
two different jobs: the theme package supplied **token values** (colour, type,
spacing, radius) and the Pro source supplied **structural intent** (which region
is 60px tall, where the rule is drawn, why the group header has a wider right
inset). Where the two could disagree, the running site decided it.

**The reference-site evidence is kept once, in the sibling package.** Every file
under `arco-blue/reports/evidence/` records the upstream theme, the live reference
site or the raw readings taken from it — none of it is this package's own output,
and none of it changes when the colour layer does, so it is cited rather than
copied. The one evidence file this package writes is
`jiean-red/reports/evidence/package-diff.json`: the machine-checked comparison
between the two packages, read in `reports/visual-validation.md`.

## 2. How the token layer was built

1. `tokens.less` and `css/arco.css` from the theme package were read in full and
   parsed into `arco-theme-tokens.json`: **837 component variables across 34
   component groups**, each under the name the package gives it
   (`@<component>-…`) with its resolved value, so that a token's origin can be
   pointed at rather than asserted.
2. The contract's 30 colours were then checked against that map. Every colour in
   `jiean-red/DESIGN.md` resolves to a theme variable; the mapping is what the
   `Color` table's `Source` column records.
3. Typography sizes come from the site's own measured text: a 14px body line box
   of 22.001px, a 20px page title at 28px, a 16px card title at 24px, a 22px KPI
   number at 33px and a 12px caption at 18px. The multiplier that produces those
   (1.5715 at 14px) is Arco's, not ours; the contract states the resulting pixel
   values, because that is what the toolchain can carry.
4. Spacing, radius and the 75 component tokens come from the same theme map plus
   the measured geometry of the reference pages.

## 3. What was measured on the live reference, and what was not

Measured directly, with an exact selector, in one signed-in session at a
1270×848 viewport — and kept, with its method, in `arco-pro-live-probe.json`:

- the shell: header box, its 1px bottom rule, the sidebar box, the position of its
  right rule, both stacking orders;
- the brand block, its 33×33 mark, its 20px/500 name and its 10px gap;
- the header's tools: the 196×32 search box, the 32px circle buttons 48px apart,
  the 32×32 avatar and the resulting 28px right inset;
- the menu: a 204×40 row inside a 220px sidebar, its 12px insets, its 2px radius,
  its 40px line box, and the 12/28 insets of the collapsible group header;
- the content column: 1010px wide at x=240, the 714×605 card, its 4px radius and
  shadowless surface, the 24px breadcrumb, the 20px/500/28px page title;
- the dashboard split: 714 + 16 + 280 = 1010, the 54×54 KPI disc, and the KPI
  number's 22px/600/33px.

The four reference screenshots were then decoded and sampled to confirm the two
things no computed style can prove: that the header's rule is painted on row 59
of a 60px bar, and that the sidebar's rule is painted at x=220, one pixel outside
the 220px box. That second reading is the reason the rule is a pseudo-element at
`right: -1px` and not a border: a border would have taken a pixel off all 204 of
the menu column's width.

**Not measured.** The list, form and detail pages were swept into
`arco-pro-metrics.json` with generic key names rather than re-probed with exact
selectors. Those entries are recorded but are **not** used as comparison targets,
because a key whose target element cannot be verified is a number without a
referent. Every landmark those pages share with the dashboard is compared through
the exact-selector probe instead.

**Not measured.** Colours were taken from the theme package, not read off the live
site. The theme package is the upstream source of those colours; the site is a
build of them. Where a colour's use on a page mattered, it was read from the page
(for example the selected menu row's `rgb(22, 93, 255)`, which is `primary`).

## 4. The toolchain identity check

`@google/design.md` 0.4.0 ships `dist/spec.md`. The upstream repository's
`docs/spec.md` at the revision above was fetched and hashed:

```
8f297a7bd38cf08bde06c96f5eea2ebfcd9930a8bc1dfe964f8e8dec894e691a  dist/spec.md   (installed, 15313 bytes)
8f297a7bd38cf08bde06c96f5eea2ebfcd9930a8bc1dfe964f8e8dec894e691a  docs/spec.md   (upstream HEAD, 15313 bytes)
```

Byte-identical. So the installed version's behaviour — every limitation recorded
in `designmd-validation.md` — describes the specification as published at that
revision, and not a stale copy.

## 5. Verified versus inferred

**Verified, and re-checked on every `npm run check`:** every token value and its
count; the derived artifacts' agreement with the official exports; the exports'
limitations; the contrast ratios; the visual comparison (75 values: 16 pixel
checks over four page pairs, 38 dashboard landmarks, 21 shell landmarks on the
other three pages) against the live reference.

**Added in the V2 structure layer, and how they are classified:** `primary-on-dark`,
`error-strong`, `error-strong-hover`, `error-strong-active`, the `code` typography role,
the `dark-link` and `dark-button-primary` component tokens, and the eleven component
tokens the coverage tables name. The three `error-strong` steps are Arco's published
`red-7` to `red-9`; `primary-on-dark` is a **JIEAN decision** — the brand hue and
saturation held, luminance taken from `blue-4`, as recorded in `reports/evidence/` —
rather than a value copied from the baseline. Every one of them is an addition: no
token that already existed changed value.

**Inferred, and labelled as such where it appears:** the intent behind upstream
choices. The 200px brand block inside a 220px sidebar, the group header's 28px
right inset, and the two different 14px line heights coexisting on the reference
are read as intent from the code and the measurements, not from an upstream
statement of intent. They are recorded as observed behaviour, not as documented
policy.

**Not claimed:** that this is the only correct reading of the reference, or that
the reference is itself beyond criticism. The contrast audit finds five AA
failures in the reference palette and waives them explicitly, with compliant
substitutes computed in `jiean-red/docs/accessibility.md`.

## 6. Out of scope

- The reference application's business logic, data and routing.
- Arco's full component library. This system specifies the 75 component tokens the
  reference actually uses and the 14 pattern documents it needs; it does not
  re-derive the library.
- Any page of the reference that could not be reached in the captured session.

## 7. Reproducing this audit

```bash
npm install                  # @google/design.md 0.4.0, the only dependency
npm run 1:validate           # contract parses; token counts and section names
npm run 2:export             # official exports + derived artifacts, with the contract's sha256
npm run 3:verify-generated   # 26 checks: provenance, losslessness, limitations, contrast
npm run 4:capture            # re-render the 6 reference pages at 1270x848
npm run 5:compare            # 89 comparisons against the reference probe and the four page screenshots
npm run check                # 1 -> 2 -> 3 -> 6, the gate CI runs
```

The upstream revision above can be re-resolved with
`git ls-remote https://github.com/google-labs-code/design.md HEAD`; the Arco theme
version with `npm view @arco-themes/react-arco-pro version`.
