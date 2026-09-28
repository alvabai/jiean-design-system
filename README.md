# JIEAN Design System

**English** · [中文版](README_zh-CN.md)

Company-wide visual and interaction design system for 捷安高科 (JIEAN).

This repository is the authority on how JIEAN software looks and behaves. It is
not a component library and it is not tied to a framework: it is a specification
that humans, AI agents and tooling all read from, and that any frontend stack can
implement against.

## Available style packages

```text
arco-blue
brandcolor
industrial-steel-blue
```

`arco-blue` (阿科蓝) is the enterprise style package, extracted from the enterprise
application language that Arco Design Pro demonstrates.

`brandcolor` is that same package with its colour layer replaced by 捷安's brand
colours: 捷安红 `#D7000F` as the primary, 深灰 `#353535` on the three dark anchors,
and four primary steps derived from them by holding each step's relative luminance.
Geometry, typography, spacing, radii and all 61 component tokens are identical to
`arco-blue`'s — 22 of the 30 colour roles included — and `npm run 8:package-diff`
proves it on every commit.

`industrial-steel-blue` (工业钢蓝) is the industrial style package: the same
non-colour layer, with the accent family replaced by a ten-step steel blue derived
from `arco-blue`'s own ramp — hue forced to 210°, saturation × 0.38, and steps 5–7
darkened to × 0.78 so the interaction steps still carry white text. It is a
**superset with an allow-list rather than a recolour**: 25 of the 34 colour roles,
10 of the 11 typography roles, all 13 spacing steps, all radii and 61 of the 75
component tokens are `arco-blue`'s, and every change or addition is named in the
script before it is allowed to exist. Its three previews' worth of extra rigour —
the machine-validation layer, the steel-ramp derivation and the preview checks
described below — apply to that package only.

## Relationship

```text
JIEAN Design System
├── arco-blue
├── brandcolor
└── industrial-steel-blue
```

The company-wide system is the name and the commitment: one place where JIEAN's
visual and interaction decisions are recorded. A style package is one expression
of it — a token set, a pattern library, and a reference implementation for a
particular product family or density.

**Two further packages did exactly that.** `brandcolor` sits beside `arco-blue`
without changing the company-wide name, the contract format or the review process:
it differs only in its colour layer, and that difference is machine-checked rather
than described. `industrial-steel-blue` does the same for a different product
family, and goes one step further: it adds structure the earlier packages did not
have — a machine-validation layer beside the official linter, a derivation script
for its palette, and rendered previews that are checked down to their pixels. Both
relationships are proved on every commit, and a further package
(`arco-blue-compact`, or one for another product line) would be added the same way.

## What is in this repository

| Path | What it is |
|---|---|
| `<package>/DESIGN.md` | The design contract: machine-readable tokens plus the reasoning behind them |
| `<package>/docs/` | 14 pattern documents — the enterprise application language in prose |
| `<package>/tokens/`, `<package>/dist/` | Token artifacts: the official exports, and the lossless derived pair |
| `<package>/examples/` | The reference implementation: framework-free HTML pages, each with a rendered preview beside it |
| `<package>/reports/` | Evidence: source audit, toolchain validation, visual validation |
| `<package>/README.md` | The package manual — start here for the working detail |
| `scripts/` | The validation, export and comparison tooling |
| `AGENTS.md` | The instruction file for coding agents |

`<package>` is `arco-blue`, `brandcolor` or `industrial-steel-blue`. All three have
that structure. The first two differ only in the colour layer; the third adapts the
colour layer within a recorded allow-list and additionally carries
`reports/machine-validation.json`, `reports/evidence/palette-derivation.json` and
`reports/evidence/package-diff.json`. Its `examples/` is a flat directory of four
pages and four previews, each page self-contained, rather than a page set with a
shared stylesheet folder.

## The shortest workflow

```bash
git clone <this repository>
cd jiean-design-system
npm install
npm run check
```

`npm run check` lints and structurally validates all three contracts, exports the
tokens, verifies the generated artifacts, re-derives the brand ramp and the steel
ramp, proves both cross-package relationships, checks the four previews — including
the palette on their pixels — and checks the repository's hygiene. It is the same
command CI runs. If it passes, this repository is in a good state.

To see the result rather than test it, open `arco-blue/examples/dashboard.html`,
`brandcolor/examples/dashboard.html` or `industrial-steel-blue/examples/dashboard.html`
in a browser and compare the three. The pages need no build step: they are HTML and
the derived token file, and the third package's pages carry their stylesheet inline
so that `examples/` stays flat.

## Reading order, if you are new

1. `arco-blue/DESIGN.md` — the contract. Its frontmatter is the token set; its prose
   is why those tokens exist.
2. `arco-blue/docs/foundations.md` — the underlying model: the two trees, the density
   rules, what may be expressed in type.
3. `arco-blue/docs/application-shell.md` — how a page is assembled, because every
   other pattern is a region of that shell.
4. `arco-blue/examples/dashboard.html` — the shell in the browser.
5. `arco-blue/reports/source-audit.md` — where every value came from, and what was
   inferred rather than measured.
6. `brandcolor/DESIGN.md` §Colors — the same system in 捷安's brand red: which
   eight roles moved, and why the four derived steps hold their luminance. Its
   `reports/visual-validation.md` states what that change is and is not evidenced
   by.
7. `industrial-steel-blue/DESIGN.md` — the industrial package, which is where the
   system gets its motion values, its responsive behaviour, its iteration rules and
   an explicit list of its own gaps. Its `reports/source-audit.md` records the exact
   revisions everything was researched from, and its
   `reports/evidence/package-diff.json` proves what did and did not move.

## Built on

`arco-blue` was extracted from **Arco Design Pro**, whose repository and theme
package are MIT licensed, using Google's **DESIGN.md** format and its `design.md`
toolchain (Apache 2.0). `brandcolor` reuses that extraction unchanged and replaces
the colour layer with 捷安's brand colours; its geometry, typography and component
tokens are `arco-blue`'s. `industrial-steel-blue` was researched from the same
baseline — Arco Design `2.66.16` and Arco Design Pro `bb6aebcceca6`, both recorded
by commit in its source audit — and derives its own interactive colour from that
ramp rather than adopting it. This repository is JIEAN's own work and is not an
official Arco product or an official Google product. See `THIRD_PARTY_NOTICES.md` for the
notices that are required and the attribution that is not claimed.

## Licence

MIT, for the contents of this repository. See `LICENSE`.
