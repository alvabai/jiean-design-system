# AGENTS.md

Instructions for any coding agent working in this repository or building UI for a
JIEAN product. Read this file first. It is short on purpose.

1. **JIEAN Design System is the authoritative company design system.** It is not a
   suggestion, a theme, or a starting point to be improved on locally. When this
   repository and your own instincts disagree about a colour, a size, a space, a
   radius or a pattern, this repository is right.

2. **`arcopro` is one style package of that system.** The company-wide system is
   `JIEAN Design System`; `arcopro` is its enterprise package. Other packages may
   exist beside it. Identify which one you are building against, and do not mix
   values between packages.

3. **Before creating or changing UI, read `arcopro/DESIGN.md`.** Its frontmatter is
   the token set; its prose is the reasoning. Do not begin writing markup, styles
   or a component until you have read it.

4. **Read the relevant `arcopro/docs/*.md` for the task at hand.** Fourteen pattern
   documents cover the shell, page layout, navigation, forms, tables, search and
   filter, cards, feedback, data visualization, workflow, permission, accessibility
   and responsive behaviour. Read the ones the task touches, not just `DESIGN.md`.

5. **Use exported tokens where appropriate.** `arcopro/dist/tokens.full.css` (217
   custom properties) or `arcopro/dist/tokens.full.json`; `arcopro/dist/tokens.css`
   and `dist/tailwind.theme.json` when you want the official output. Reference a
   token by its **role**, never by its value.

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

- Do not copy values out of `arcopro/examples/assets/app.css` as a shortcut: that
  file is written against the tokens, so read the tokens.
- Do not edit `arcopro/design.md`'s generated artifacts by hand. Change
  `DESIGN.md`, then run `npm run 2:export`.
- Do not edit a derived artifact and call it a token change. The contract's sha256
  is checked by `npm run 3:verify-generated`, and the check exists for this reason.
- Do not present generated output as the specification. The specification is
  `DESIGN.md`.

## Before you say you are done

```bash
npm run check
```

If you changed anything a user sees, also run `npm run check:visual` and report
what it said — including a failure.
