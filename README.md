# JIEAN Design System

**English** · [中文版](README_zh-CN.md)

Company-wide visual and interaction design system for 捷安高科 (JIEAN).

This repository is the authority on how JIEAN software looks and behaves. It is
not a component library and it is not tied to a framework: it is a specification
that humans, AI agents and tooling all read from, and that any frontend stack can
implement against.

## Available style packages

```text
arcopro
brandcolor
```

`arcopro` is the enterprise style package, extracted from the enterprise
application language that Arco Design Pro demonstrates.

`brandcolor` is that same package with its colour layer replaced by 捷安's brand
colours: 捷安红 `#D7000F` as the primary, 深灰 `#353535` on the three dark anchors,
and four primary steps derived from them by holding each step's relative luminance.
Geometry, typography, spacing, radii and all 61 component tokens are identical to
`arcopro`'s — 22 of the 30 colour roles included — and `npm run 8:package-diff`
proves it on every commit.

## Relationship

```text
JIEAN Design System
├── arcopro
└── brandcolor
```

The company-wide system is the name and the commitment: one place where JIEAN's
visual and interaction decisions are recorded. A style package is one expression
of it — a token set, a pattern library, and a reference implementation for a
particular product family or density.

**A second package did exactly that.** `brandcolor` sits beside `arcopro` without
changing the company-wide name, the contract format or the review process: it
differs only in its colour layer, and that difference is machine-checked rather than
described. A further package (`arcopro-compact`, or one for a different product
line) would be added the same way.

## What is in this repository

| Path | What it is |
|---|---|
| `<package>/DESIGN.md` | The design contract: machine-readable tokens plus the reasoning behind them |
| `<package>/docs/` | 14 pattern documents — the enterprise application language in prose |
| `<package>/tokens/`, `<package>/dist/` | Token artifacts: the official exports, and the lossless derived pair |
| `<package>/examples/` | The reference implementation: six framework-free HTML pages |
| `<package>/reports/` | Evidence: source audit, toolchain validation, visual validation |
| `<package>/README.md` | The package manual — start here for the working detail |
| `scripts/` | The validation, export and comparison tooling |
| `AGENTS.md` | The instruction file for coding agents |

`<package>` is `arcopro` or `brandcolor`. Both directories have that structure, and
they differ only in the colour layer.

## The shortest workflow

```bash
git clone <this repository>
cd jiean-design-system
npm install
npm run check
```

`npm run check` lints both contracts, exports the tokens, verifies the generated
artifacts, re-derives the brand ramp, proves the two packages differ in colour and
nothing else, and checks the repository's hygiene. It is the same command CI runs.
If it passes, this repository is in a good state.

To see the result rather than test it, open `arcopro/examples/dashboard.html` or
`brandcolor/examples/dashboard.html` in a browser and compare the two. The pages
need no build step; they are HTML, one stylesheet and the derived token file.

## Reading order, if you are new

1. `arcopro/DESIGN.md` — the contract. Its frontmatter is the token set; its prose
   is why those tokens exist.
2. `arcopro/docs/foundations.md` — the underlying model: the two trees, the density
   rules, what may be expressed in type.
3. `arcopro/docs/application-shell.md` — how a page is assembled, because every
   other pattern is a region of that shell.
4. `arcopro/examples/dashboard.html` — the shell in the browser.
5. `arcopro/reports/source-audit.md` — where every value came from, and what was
   inferred rather than measured.
6. `brandcolor/DESIGN.md` §Colors — the same system in 捷安's brand red: which
   eight roles moved, and why the four derived steps hold their luminance. Its
   `reports/visual-validation.md` states what that change is and is not evidenced
   by.

## Built on

`arcopro` was extracted from **Arco Design Pro**, whose repository and theme
package are MIT licensed, using Google's **DESIGN.md** format and its `design.md`
toolchain (Apache 2.0). `brandcolor` reuses that extraction unchanged and replaces
the colour layer with 捷安's brand colours; its geometry, typography and component
tokens are `arcopro`'s. This repository is JIEAN's own work and is not an official
Arco product or an official Google product. See `THIRD_PARTY_NOTICES.md` for the
notices that are required and the attribution that is not claimed.

## Licence

MIT, for the contents of this repository. See `LICENSE`.
