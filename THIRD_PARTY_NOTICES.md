# Third-party notices

`arcopro` is JIEAN's own work. It was derived from existing open-source work, and
this file records what, under which licence, and what that means in practice.

## Not an official product

This repository is **not** an official Arco product, an official ByteDance product,
or an official Google product. It is JIEAN's design system, which studies and
reuses work published by those projects under the licences below. The names
`JIEAN Design System` and `arcopro` are JIEAN's; the names `Arco`, `Arco Design`,
`Arco Design Pro` and `DESIGN.md` belong to their respective owners and are used
here only to say where the work came from.

## What was reused, and how

| Source | Licence | What this repository actually uses |
|---|---|---|
| [Arco Design Pro](https://github.com/arco-design/arco-design-pro) | MIT, © 2021 Bytedance, Inc. and its affiliates | **Values and structure, not code.** Region sizes, inset values, type sizes and line heights were measured from a running build of it and recorded as numbers. A handful of stylesheet rules were read to understand *why* a value is what it is (for example that the sidebar's right rule is a pseudo-element, and that a navbar item carries 8px of horizontal padding). No stylesheet, component or module from the project is copied into this repository. |
| [`@arco-themes/react-arco-pro`](https://www.npmjs.com/package/@arco-themes/react-arco-pro) | MIT | **Token values.** The theme package's variable map was parsed to establish the colour, type, spacing and radius values that this contract states, and the full parsed map is kept as evidence in `arcopro/reports/evidence/arco-theme-tokens.json`. No theme file is redistributed. |
| `@arco-design/web-react` | MIT | **Component geometry, as a cross-check.** Version 2.66.16 was inspected for control sizes. No component is bundled, and this repository has no runtime dependency on it. |
| [`@google/design.md`](https://github.com/google-labs-code/design.md) | Apache License 2.0 | **The format and the toolchain.** `arcopro/DESIGN.md` is written in DESIGN.md's format, and the token artifacts under `arcopro/tokens/` and `arcopro/dist/` are produced by running that CLI. The package is a development dependency, pinned to 0.4.0; it is not redistributed here. |

## What this means

- **Attribution is given, and is not claimed as endorsement.** Saying that a value
  was measured from Arco Design Pro does not say that Arco endorses this system, and
  no Arco or Google mark is presented as belonging to JIEAN.
- **MIT's notice requirement is satisfied by this file** for the Arco sources. No
  substantial portion of the Arco projects' source is redistributed, so no
  per-file notice is carried into a copied file; where a rule was read for
  understanding, the reading is recorded as a measurement in
  `arcopro/reports/source-audit.md` rather than as borrowed code.
- **Apache 2.0's requirements are satisfied by this file** for `@google/design.md`,
  which is consumed as a pinned tool from npm. If a future change vendors any part
  of that package into this repository, the Apache 2.0 text and the package's
  `NOTICE` file must be carried alongside it — that has not been done, because it
  has not been needed.
- **The prose here is original.** The pattern documents under `arcopro/docs/` were
  written for this system, from measurements and reasoning, in JIEAN's own
  technical language. Arco's documentation text was not copied. Where a pattern is
  Arco's idea rather than this system's invention, the document says so.
- **Everything not listed above is JIEAN's**, and is licensed to third parties
  under `LICENSE` (MIT).

## Reproducing a licence audit

```bash
npm view @arco-themes/react-arco-pro version license
npm view @arco-design/web-react version license
npm view @google/design.md version license
```

The Arco Design Pro repository's `LICENSE` and the `LICENSE` file inside
`@google/design.md` are the authoritative texts for those two; this file summarises
them but does not replace them.
