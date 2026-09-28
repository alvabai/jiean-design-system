# DESIGN.md toolchain validation

What the official toolchain actually does with this contract, as opposed to what
it is commonly assumed to do. Every statement below is asserted by
`npm run 3:verify-generated`, which re-checks all of it on every run; the run that
produced this document reported **26 checks, 0 failures**.

## 1. The toolchain

| | |
|---|---|
| Package | `@google/design.md` **0.4.0** — the only dependency this repository has |
| Subcommands | `lint`, `diff`, `export`, `spec` |
| Export formats | `css-tailwind`, `json-tailwind`, `tailwind`, `dtcg`, `css-vars` |
| Programmatic entry | `lint(file, opts)` imported from `@google/design.md/linter` |
| Specification | `dist/spec.md`, byte-identical to upstream `docs/spec.md` at revision `9bf8eae6…` (see `source-audit.md` §4) |

`lint()` returns `{ designSystem, findings, summary, tailwindConfig, sections,
documentSections }`. `designSystem` holds its collections as `Map`s — `colors`,
`typography`, `rounded`, `spacing`, `components`, `symbolTable`. A resolved colour
is `{ hex, r, g, b, a, luminance }` in which **r/g/b are 0–255** and **a is 0–1**,
and `hex` is directly usable.

> That last line is not a footnote. An earlier version of this repository's
> derivation treated the r/g/b members as 0–1 fractions, which turned all 30
> colours into `#ffffff` while still producing a syntactically valid file. The
> contrast audit would have "passed" against a page of white. It is recorded here
> because the shape of a resolved colour is exactly the kind of detail that fails
> silently.

## 2. What the official exports produce

Three files are written by the official CLI, unmodified, and kept as they came:

| File | Format | Size | Contents |
|---|---|---|---|
| `arco-blue/tokens/tokens.json` | `dtcg` | 11,777 B | every colour, every typography role, spacing, radii |
| `arco-blue/dist/tokens.css` | `css-vars` | 1,425 B | **48** custom properties |
| `arco-blue/dist/tailwind.theme.json` | `json-tailwind` | 5,185 B | 10 `fontSize` entries with per-entry line height and weight |

## 3. What each format drops

Three of the five formats were run. Each one loses something, and the losses do
not overlap:

1. **`css-vars` omits typography and component tokens entirely.** The file is
   colours, spacing and radii — nothing else. If this format were the only output,
   a consumer would have no type scale at all.
2. **`json-tailwind` omits `fontFeature` and all 61 component tokens.** It carries
   `colors`, `fontFamily`, `fontSize`, `borderRadius` and `spacing`.
3. **`dtcg` omits `fontFeature` and all 61 component tokens.**
4. **`dtcg` emits `lineHeight` as a bare number, dropping its unit** — for all 10
   roles. `fontSize` keeps `{ value, unit }` beside it; `lineHeight` does not. A
   consumer reading the DTCG output alone cannot tell 22 from 22 of anything.
5. **No official format carries the 61 component tokens.** This is the single
   largest loss and it is the reason this repository ships a derived pair
   alongside the official files rather than instead of them: `dist/tokens.full.css`
   (217 custom properties) and `dist/tokens.full.json`, both headed by the
   contract's sha256 and a note naming the official artifacts they extend.

The `json-tailwind` output is the most complete of the three, and it does preserve
line height — as a string, per size, alongside the weight:

```json
["14px", { "lineHeight": "22px", "fontWeight": "400" }]
```

## 4. The toolchain requirement this contract is written around

`lineHeight` **must be written as a px dimension**. A unitless multiplier is not
rejected, warned about, or otherwise reported — it is dropped. The probe recorded
by `verify-generated.mjs` runs three arms on the same contract:

| Written as | Result |
|---|---|
| `lineHeight: 1.5715` | **silently lost** — no error, no warning, no value |
| `lineHeight: 22px` | kept, through resolution and every export |
| `lineHeight` omitted | absent, as written |

Because the failure is silent, `arco-blue/DESIGN.md` states the rule in its
Typography section as a toolchain requirement, and `npm run 3:verify-generated`
asserts both directions on every run — that a unitless value is still dropped, and
that this contract's px values still survive. If a future release of the toolchain
starts accepting multipliers, that check fails and the requirement can be retired
deliberately rather than by accident.

## 5. What the linter does not accept

YAML anchors and merge keys are not supported. This was tried as the obvious way
to factor out the shared font stack and rejected at parse time with:

```
'<<' is not a recognized typography property
```

So the font stack is repeated verbatim in all 10 typography roles. The order of
the families is significant and is preserved everywhere it appears.

## 6. What was fixed in the contract because of this validation

- **`lineHeight` was converted from multipliers to px dimensions** across all 10
  roles. Before the change, the derived artifacts carried no line height at all
  while `lint` reported no error and no warning — the exact silent failure
  described above.
- **The typography table in the human-readable half was brought in line** with the
  frontmatter (px, not multipliers), and now states which reference measurement
  each value came from.
- **A toolchain requirement note was added** to the Typography section so the next
  editor meets the constraint before the toolchain's silence does.

## 7. Known unknowns

- **`css-tailwind` and `tailwind` were not run.** The task needed the DTCG output,
  the css custom properties and the Tailwind theme; the two hybrid formats were
  left alone rather than run and discarded.
- **`diff` was not exercised.** There has been only one revision of this contract
  to diff against; the command is documented in the README for the day there are
  two.
- **Behaviour beyond these formats is untested.** Nothing here should be read as a
  general statement about the toolchain, only about the version and formats named.
