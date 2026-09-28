# AGENTS.md

Instructions for any coding agent working in this repository or building UI for a
JIEAN product. Read this file first. It is short on purpose.

1. **JIEAN Design System is the authoritative company design system.** It is not a
   suggestion, a theme, or a starting point to be improved on locally. When this
   repository and your own instincts disagree about a colour, a size, a space, a
   radius or a pattern, this repository is right.

2. **The system ships three style packages: `arcopro`, `brandcolor` and
   `industrial-steel-blue`.** The company-wide system is `JIEAN Design System`;
   `arcopro` is the enterprise package researched from Arco Design Pro (Arco is a
   source, not the author of this repository), `brandcolor` is that same package with
   the colour layer replaced by 捷安's brand colours, and `industrial-steel-blue` is
   the industrial package, which adapts the colour layer into a derived steel blue
   within a recorded allow-list and adds motion, responsive behaviour and its own gap
   list. `npm run 8:package-diff` proves both relationships, so a value from one
   package is never a substitute for a value from another: identify which package you
   are building against, and take that package's tokens.

3. **Before creating or changing UI, read `<package>/DESIGN.md`.** Its frontmatter
   is the token set; its prose is the reasoning. Do not begin writing markup, styles
   or a component until you have read the contract of the package you are using —
   `brandcolor`'s §Colors is where its palette and the rules that go with it live, and
   `industrial-steel-blue`'s §Known Gaps is where that package states what it does not
   yet solve.

4. **Read the relevant `<package>/docs/*.md` for the task at hand.** Fourteen pattern
   documents cover the shell, page layout, navigation, forms, tables, search and
   filter, cards, feedback, data visualization, workflow, permission, accessibility
   and responsive behaviour. Read the ones the task touches, not just `DESIGN.md`.

5. **Use exported tokens where appropriate.** `<package>/dist/tokens.full.css` (217
   custom properties in `arcopro` and `brandcolor`, 262 in `industrial-steel-blue`) or
   `<package>/dist/tokens.full.json`; `<package>/dist/tokens.css` and
   `tailwind.theme.json` when you want the official output. Reference a token by its
   **role**, never by its value — `primary` is `#165DFF` in `arcopro`, `#D7000F` in
   `brandcolor` and `#3E6489` in `industrial-steel-blue`, and each is correct in its
   own package.

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
  file is written against the tokens, so read the tokens. (In
  `industrial-steel-blue` that stylesheet is inlined into each page, so read the
  tokens rather than lifting the inline block.)
- Do not edit a generated artifact by hand. Change `<package>/DESIGN.md`, then run
  `npm run 2:export`.
- Do not edit a derived artifact and call it a token change. The contract's sha256
  is checked by `npm run 3:verify-generated`, and the check exists for this reason.
- Do not present generated output as the specification. The specification is
  `DESIGN.md`.
- Do not reuse another design system's vocabulary as if it were this one's. Arco is
  credited as a research source in the contracts and the reports; it is not the author
  of any package here, and neither this repository nor its packages are Arco
  publications.

## Before you say you are done

```bash
npm run check
```

If you changed anything a user sees, also re-render the previews and check them —
`npm run 11:screenshots:write` then `npm run 10:screenshots` for
`industrial-steel-blue`, and `npm run check:visual` on a machine where a headless
browser can be given a stable 1270×848 viewport for the other two. Report what they
said, including a failure. `check:visual` is not part of `npm run check`, and
`brandcolor`'s `reports/visual-validation.md` §5 explains what that leaves
unverified instead.
