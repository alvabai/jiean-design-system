# AGENTS.md

Instructions for any coding agent working in this repository or building UI for a
JIEAN product. Read this file first. It is short on purpose.

1. **JIEAN Design System is the authoritative company design system.** It is not a
   suggestion, a theme, or a starting point to be improved on locally. When this
   repository and your own instincts disagree about a colour, a size, a space, a
   radius or a pattern, this repository is right.

2. **The system ships two style packages: `arcopro` and `brandcolor`.** The
   company-wide system is `JIEAN Design System`; `arcopro` is the enterprise package
   extracted from Arco Design Pro, and `brandcolor` is that same package with the
   colour layer replaced by 捷安's brand colours. They are identical outside colour —
   `npm run 8:package-diff` proves it — so a value from one is never a substitute for
   a value from the other: identify which package you are building against, and take
   that package's tokens.

3. **Before creating or changing UI, read `<package>/DESIGN.md`.** Its frontmatter
   is the token set; its prose is the reasoning. Do not begin writing markup, styles
   or a component until you have read the contract of the package you are using —
   `brandcolor`'s §Colors is where its palette and the rules that go with it live.

4. **Read the relevant `<package>/docs/*.md` for the task at hand.** Fourteen pattern
   documents cover the shell, page layout, navigation, forms, tables, search and
   filter, cards, feedback, data visualization, workflow, permission, accessibility
   and responsive behaviour. Read the ones the task touches, not just `DESIGN.md`.

5. **Use exported tokens where appropriate.** `<package>/dist/tokens.full.css` (217
   custom properties) or `<package>/dist/tokens.full.json`; `<package>/dist/tokens.css`
   and `tailwind.theme.json` when you want the official output. Reference a token by
   its **role**, never by its value — `primary` is `#165DFF` in `arcopro` and
   `#D7000F` in `brandcolor`, and both are correct.

6. **Do not invent conflicting colours, spacing, typography, radius or patterns.**
   A hex that is not in the contract is a defect, even if it looks right. A spacing
   step that is not in the contract is a defect, even if it seems tidier. If the
   value you need genuinely does not exist, see rule 10.

7. **Existing mature component libraries may be used as implementation
   mechanisms.** Arco React, Ant Design, Tailwind, a charting library — all fine.
   The library supplies the behaviour, focus management, accessibility plumbing and
   edge cases. The design values still come from this specification.

8. **Framework defaults do not override JIEAN Design System.** A library's default
   blue, its default body size, its default radius and its default shadow are all
   wrong here. Override them. "That is what the library does" is not a reason.

9. **Reuse existing JIEAN patterns before creating new ones.** The shell, the page
   types, the table, the form, the empty state, the permission rules and the
   workflow steps are all specified. Build on them. A new pattern that duplicates
   an existing one is a defect even when it works.

10. **If a new design decision is unavoidable, document it explicitly.** Say what
    the decision is, why the specification did not cover it, and where you recorded
    it. Then propose it as a contract change — a value belongs in `DESIGN.md` or it
    does not exist.

## Do not

- Do not copy values out of `<package>/examples/assets/app.css` as a shortcut: that
  file is written against the tokens, so read the tokens.
- Do not edit a generated artifact by hand. Change `<package>/DESIGN.md`, then run
  `npm run 2:export`.
- Do not edit a derived artifact and call it a token change. The contract's sha256
  is checked by `npm run 3:verify-generated`, and the check exists for this reason.
- Do not present generated output as the specification. The specification is
  `DESIGN.md`.

## Before you say you are done

```bash
npm run check
```

If you changed anything a user sees, also run `npm run check:visual` on a machine
where a headless browser can be given a stable 1270×848 viewport, and report what it
said — including a failure. It is not part of `npm run check`, and `brandcolor`'s
`reports/visual-validation.md` §5 explains what that leaves unverified instead.
