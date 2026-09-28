# DESIGN.md validation — IndustrialSteelBlue

**Package:** `industrial-steel-blue`
**Validator:** `@google/design.md@0.4.0` (pinned in [`../../package.json`](../../package.json)), plus this repository's structural layer
**Command:** `npm run 1:validate`
**Machine-readable output:** [`machine-validation.json`](machine-validation.json)
**Last run:** recorded in that file (`lint`, `checks`, `summary`)

---

## 1. Verdict

| Layer | Result |
|---|---|
| Official linter (`design.md` 0.4.0) | **0 errors, 0 warnings, 1 info** |
| Structural checks (`scripts/lib/machine-validation.mjs`) | **12 of 12 passed** |
| Contract size | see `contract.bytes` in the JSON (≈ 64.4 KB) |
| Contract hash | see `contract.sha256` in the JSON; `dist/` records the same hash and `npm run 3:verify-generated` fails if they diverge |

Resolved tokens: **34 colours, 11 typography roles, 13 spacing steps, 5 radii,
75 component tokens** — 138 in total. The single info finding is the linter
reporting that count; it is not a defect.

---

## 2. What the official linter is asked, and what it answers

The linter is the authority on whether the document *is* a DESIGN.md contract: the
front-matter parses, the eight required top-level keys are present, every
`{group.name}` reference resolves, every colour value is a legal literal, and no
component pairs a text colour with a background it cannot be read against. The
last of those is the one worth keeping an eye on, because it is a real
accessibility gate rather than a syntax check — it is what caught the one warning
this contract had during development:

> `components.button-danger`: white on `error` `#F53F3F` = **3.71:1**, below AA 4.5:1.

The fix was not to silence the check but to change the design: `button-danger` now
fills with `error-strong` `#CB272D` (5.43:1 with white text) and its hover and
active states continue down the same red family (7.95:1, 11.48:1). `error`
remains the status colour for text, borders and dots, where the exception is
documented in [`../docs/accessibility.md`](../docs/accessibility.md) (E3). The
contract now reports no contrast warning at all.

## 3. Three properties of the format this contract has to respect

These were found by running the tool, not by reading about it, and all three are
re-checked by `npm run 3:verify-generated` so the notes cannot go stale:

1. **`borderColor` is not a legal sub-token.** The legal set is `backgroundColor`,
   `textColor`, `typography`, `rounded`, `padding`, `size`, `height`, `width`. A
   border described as a colour has to be expressed as prose or as part of another
   token; writing `borderColor` produces a validation error.
2. **A colour that is defined but never referenced is reported.** Every one of the
   ten steel steps outside the five named roles therefore appears in the family
   table as a documented value rather than as a defined token, exactly so that the
   palette can be shown without inventing component references for it.
3. **A unitless `lineHeight` is silently dropped.** The resolver accepts
   `lineHeight: 1.5715` without complaint and then loses the value, so every
   typography role in this contract writes a `px` dimension. The behaviour is
   recorded as a still-holding pitfall in step 3's output.

## 4. What the structural layer adds

The format cannot express "this system must cover a table's eight states" or "no
other design system's vocabulary may appear here as if it were ours". The
structural layer answers those, and each check writes its evidence into the JSON
beside its verdict:

| Check | What it proves |
|---|---|
| `yaml-frontmatter` | the front matter is delimited and parses with the official parser |
| `required-keys` | all eight required top-level keys are present |
| `reference-resolution` | every `{…}` reference in the document resolves (131 in this contract) |
| `colour-values` | every colour resolves to a 6- or 8-digit hex and every literal is in an accepted form |
| `required-sections` | all 13 required sections are present, extension sections included |
| `section-order` | canonical sections come first and in order; extension sections follow them |
| `coverage-matrix` | all 38 mandatory components have a coverage row, and every token or `docs/` path those rows name actually exists |
| `state-coverage` | five button variants × six states, six input states and eight table states are each either tokenised or carried by a documented rule — and every token the state table cites resolves |
| `typography-coverage` | all 11 required roles are defined |
| `colour-coverage` | all 31 required colour roles are defined, and the absent `info` hue is a documented policy rather than an omission |
| `foreign-contamination` | no other design system's name appears as if this package were built on it: 19 files and ~5 100 lines scanned, and every hit must sit inside an attribution, a comparison or an interop-format name |
| `legacy-naming` | no legacy name (`JAT*`, `arcopro`) survives anywhere in the package |

Two of these caught real defects while they were written, which is the reason they
exist:

- **A token cited in the coverage matrix that did not exist** (`transition-duration-loading`
  — a motion concept the contract describes in prose, with no token). The cell was
  rewritten rather than the check relaxed.
- **An input row and a table row sharing a state name.** The checker's first
  version matched rows by their first cell, so the table's `Hover` row was checked
  against the input's token. The checker now selects the row that contains the
  expected token, and a missing one is reported as a missing row.

## 5. Scope of the verdict

The two earlier packages in this repository (`arcopro`, `brandcolor`) predate this
structural layer. They are checked by the layers that existed when they were
written — front matter, required keys, reference resolution, colour values,
canonical sections, section order and foreign contamination — and the five newer
checks are reported as **waived**, with the reason, rather than failed or silently
skipped. Nothing is written beside them: the machine-readable report is a product
of the structural layer, and they are not subject to it. The gap is recorded as
open work in the repository README.
