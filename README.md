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
```

`arcopro` is the enterprise style package, extracted from the enterprise
application language that Arco Design Pro demonstrates.

## Relationship

```text
JIEAN Design System
└── arcopro
```

The company-wide system is the name and the commitment: one place where JIEAN's
visual and interaction decisions are recorded. A style package is one expression
of it — a token set, a pattern library, and a reference implementation for a
particular product family or density.

**Future packages may coexist without changing the company-wide system name.**
A second package (`arcopro-compact`, or a package for a different product line)
would sit beside `arcopro` as `arcopro` sits here, and the company-wide name, the
review process and the contract format all stay as they are.

## What is in this repository

| Path | What it is |
|---|---|
| `arcopro/DESIGN.md` | The design contract: machine-readable tokens plus the reasoning behind them |
| `arcopro/docs/` | 14 pattern documents — the enterprise application language in prose |
| `arcopro/tokens/`, `arcopro/dist/` | Token artifacts: the official exports, and the lossless derived pair |
| `arcopro/examples/` | The reference implementation: six framework-free HTML pages |
| `arcopro/reports/` | Evidence: source audit, toolchain validation, visual validation |
| `scripts/` | The validation, export and comparison tooling |
| `AGENTS.md` | The instruction file for coding agents |
| `arcopro/README.md` | The package manual — start here for the working detail |

## The shortest workflow

```bash
git clone <this repository>
cd jiean-design-system
npm install
npm run check
```

`npm run check` lints the contract, exports the tokens, verifies the generated
artifacts and checks the repository's hygiene. It is the same command CI runs. If
it passes, this repository is in a good state.

To see the result rather than test it, open `arcopro/examples/dashboard.html` in a
browser. The pages need no build step; they are HTML, one stylesheet and the
derived token file.

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

## Built on

`arcopro` was extracted from **Arco Design Pro**, whose repository and theme
package are MIT licensed, using Google's **DESIGN.md** format and its `design.md`
toolchain (Apache 2.0). This repository is JIEAN's own work and is not an official
Arco product or an official Google product. See `THIRD_PARTY_NOTICES.md` for the
notices that are required and the attribution that is not claimed.

## Licence

MIT, for the contents of this repository. See `LICENSE`.
