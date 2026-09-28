# Visual validation — IndustrialSteelBlue

**Package:** `industrial-steel-blue`
**Previews:** `examples/{dashboard,list-page,form-page,detail-page}.png`
**Renderer:** `scripts/generate-example-screenshots.mjs` (headless Chrome, light theme)
**Check:** `npm run 10:screenshots` — regenerate with `npm run 11:screenshots:write`
**Machine-readable sample counts:** in the checker's output; the files themselves are committed

This report states what the four previews prove, how they were produced, and — the
part that matters more — what they do not prove.

---

## 1. Method

The previews are rendered from the committed HTML, not drawn. There is no design
tool in this chain: the HTML is the source, Chrome is the renderer, and the PNG is
the record of what a browser actually painted.

| Parameter | Value | Why |
|---|---|---|
| Viewport | **1280×900** | the desktop target this package specifies for its pages; wide enough for the 220px sidebar, the 1100px content minimum and the right rail |
| Device pixel ratio | 1 | the record should be readable pixel-for-pixel against a design review, not a 2× image that hides sub-pixel differences |
| Theme | light | the only theme these four pages render (see §4) |
| JavaScript | off | the pages are static; if a page ever needed script to look right, that would be a defect worth seeing |
| Fonts | system stack | the contract specifies stacks, not webfonts, so the render matches what a product would get |
| Page CSS | inlined, plus `dist/tokens.full.css` | the tokens a page resolves are the committed ones; `10:screenshots` fails if the page or the contract is newer than the PNG |

Two implementation details are worth recording because they cost real debugging
time:

- **The window is calibrated, not assumed.** Chrome's window adds chrome above the
  viewport, and the overhead is not constant — it moved between 87 and 107px
  depending on whether a GUI Chrome was already running. The renderer therefore
  reads the viewport height back from the page, adjusts the window, and tries again
  (up to five attempts), then crops any surplus window above the viewport.
- **The browser is launched with `--use-mock-keychain`.** A throwaway profile without
  it asks the login keychain for "Chrome Safe Storage" on every run; the flag keeps
  the profile throwaway without asking. The same flag was added to the `arco-blue`
  capture script, which had been prompting on every capture.

## 2. What was checked

`npm run 10:screenshots` is a gate, not a report generator: it fails the build, and
it is part of `npm run check` and therefore of CI. Per preview:

> The freshness comparison uses the page and `DESIGN.md`, not the generated token
> files: `2:export` rewrites those on every run, so comparing against them would
> mark every preview stale each time the export step ran. Generated files are
> checked where they belong — `3:verify-generated` proves they still match the
> contract's sha256.

| Check | Result |
|---|---|
| The file exists and is non-empty | pass |
| It is a real PNG (decoded, not merely present) | pass |
| The dimensions are exactly 1280×900 | pass, all four |
| It is no older than the page and the contract it was derived from (5s slack, for fresh checkouts) | pass, all four |
| The declared palette is present on the pixels | pass, all four — counts below |
| Neither the baseline's blue nor the sibling package's brand red appears | pass, all four — **0 pixels** |

The pixel counts are the evidence that the render carries this package's palette
rather than a stylesheet that silently failed to load. Each row is an exact-match
count over all 1 152 000 pixels:

| Preview | `canvas` `#F2F3F5` | `surface` `#FFFFFF` | `primary` `#3E6489` | `text-primary` `#1D2129` | `#165DFF` (baseline blue) | `#D7000F` (brand red) |
|---|---|---|---|---|---|---|
| `dashboard.png` (121 286 B) | 322 067 | 705 343 | 1 006 | 2 261 | 0 | 0 |
| `list-page.png` (114 696 B) | 338 336 | 748 366 | 6 673 | 1 347 | 0 | 0 |
| `form-page.png` (90 753 B) | 380 466 | 731 654 | 569 | 552 | 0 | 0 |
| `detail-page.png` (108 430 B) | 261 686 | 837 507 | 2 474 | 1 412 | 0 | 0 |

Two readings are worth stating rather than leaving in the table. **Zero pixels of
the baseline blue** is the check that would catch a page still linking the wrong
stylesheet, or a token file exported from the wrong contract — a failure that no
source-level check can see. And the **`primary` counts vary by an order of
magnitude** across pages (569 on the form page, 6 673 on the list page), which is
the expected shape: a form is mostly neutral surfaces and a table is full of
selected and interactive states. The floor of 300 pixels exists so the check tests
"this page painted the accent at all" without pretending to know how much of it a
given page should have.

## 3. What the previews show

Each page was also looked at, not only measured, and the two agree:

- **`dashboard.png`** — header with the brand mark, sidebar with the selected item in
  `primary-subtle` with a `primary` label, a KPI row on `surface` cards, a trend line
  in `primary`, a recent-records table, a right rail, and the footer note. The
  record is 1280×900 with no clipping mid-row.
- **`list-page.png`** — query area, toolbar, and a dense table with a header band,
  status dots plus text in the status column, and paging controls.
- **`form-page.png`** — three grouped cards, filled inputs on `canvas` with a 1px
  border, a selected checkbox in `primary`, helper text in `text-tertiary`, and the
  page footer note.
- **`detail-page.png`** — a three-step progress indicator with the current step
  filled in `primary`, "current parameters" and "previous parameters" blocks, a
  related-records table, and the steel-blue primary button.

Every page carries its own provenance line in the footer, in Chinese, stating that
the page is a JIEAN-produced reference implementation based on public Arco Design /
Arco Design Pro material and **not** an official Arco publication.

## 4. What the previews do not prove

Stated plainly, because a render is easy to over-claim:

1. **No comparison against the reference site for this package.** `arco-blue` carries a
   measured comparison against the live reference (`4:capture`, `5:compare`, 89
   values); this package deliberately does not look like that reference — it shares
   structure and geometry, not appearance — so a fidelity diff would be measuring the
   wrong claim. What replaces it here is the cross-package token and source proof in
   `reports/evidence/package-diff.json`.
2. **No interactive states.** Hover, focus, pressed, disabled, loading and error are
   specified, tokenised and contrast-audited, and the coverage matrices in the
   contract make the set reviewable — but a static render does not exercise them.
   Nothing here should be read as evidence that a hover state looks right.
3. **No dark theme.** The nine `dark-*` anchors and `primary-on-dark` are measured,
   not rendered. §4 of `docs/accessibility.md` states the rules; no preview shows them.
4. **No responsive rendering.** 1280×900 only. The 1100px content minimum and the two
   inferred smaller breakpoints are specified in the contract and unverified visually.
5. **No density or zoom checks.** One viewport, one DPR.
6. **No pixel comparison between the preview and anything else.** The palette counts
   above are absolute checks on the render, not a diff. A page could be laid out badly
   and still pass them; that is why §3 exists and why the layout claims rest on the
   cross-package structural proof rather than on these images.
7. **Nothing about performance, print or accessibility tooling.** These are static
   screenshots of a static page.

## 5. Reproducing this

```bash
npm install
npm run 2:export           # the tokens the pages resolve
npm run 11:screenshots:write   # renders the four PNGs (needs Chrome)
npm run 10:screenshots         # checks them: dimensions, freshness, palette
```

The render is deterministic in this environment: re-running `11:screenshots:write`
on unchanged input reproduces byte-identical files, which is why the checker can
compare timestamps rather than hashes and still catch a stale file. The sizes above
are the current ones (121 286 / 114 696 / 90 753 / 108 430 bytes); they changed from
the previous render only because the sidebars in the four pages were corrected to
link to pages that exist in this package.
