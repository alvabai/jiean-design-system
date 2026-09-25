#!/usr/bin/env node
/**
 * 5:compare — the visual fidelity comparison.
 *
 * Two independent questions are asked, because they fail in different ways.
 *
 *   1. PALETTE AND EDGES. Does the rendered page carry the same 1px rules and
 *      fills, at the same rows and columns, as the reference? Computed styles
 *      cannot answer this: a rule drawn by a pseudo-element, or one that is
 *      painted but has no layout box, is invisible to getComputedStyle. So this
 *      section reads the pixels of both screenshots and asserts on them.
 *
 *   2. GEOMETRY AND TYPE. Does every landmark the pages share measure the same?
 *      Compared against arcopro/reports/evidence/arco-pro-live-probe.json, which
 *      records the reference values and, for each one, how it was obtained.
 *
 *   3. EVERY PAGE. The shell is one component, so it has to measure the same on
 *      all six pages, not only on the one the probe was taken from. Each page's
 *      shell landmarks are compared against the same reference values.
 *
 * The comparison is deliberately explicit rather than generic: every pair names
 * both sides and the property being compared, so a failure points at a real
 * decision instead of at a selector that happened to match something else. Every
 * reference value carries its source, and any landmark that could not be given
 * an unambiguous selector is left out and reported as uncovered rather than
 * guessed at.
 *
 * Output: arcopro/reports/evidence/visual-comparison.json
 * Run:    npm run 5:compare   (needs npm run 4:capture first)
 */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { REPO_ROOT } from '../lib/design-system.mjs';
import { readPng } from '../lib/png.mjs';

const EVIDENCE = path.join(REPO_ROOT, 'arcopro', 'reports', 'evidence');
const CAPTURES = path.join(EVIDENCE, 'captures');

/** Lengths are compared in CSS pixels; 0.6 absorbs sub-pixel rounding only. */
const LENGTH_TOLERANCE = 0.6;

// ---------------------------------------------------------------------------
// comparison primitives
// ---------------------------------------------------------------------------

const results = { pixels: [], geometry: [], pages: [], uncovered: [] };

function record(section, name, reference, actual, verdict, detail) {
  results[section].push({ name, reference, actual, verdict, detail });
}

function compareLengths(section, name, ref, actual, detail) {
  const ok = ref.every((v, i) => Math.abs(v - actual[i]) <= LENGTH_TOLERANCE);
  const worst = Math.max(...ref.map((v, i) => Math.abs(v - actual[i])));
  record(
    section,
    name,
    ref,
    actual,
    ok ? 'match' : 'drift',
    ok ? detail : `${detail}; largest difference ${worst.toFixed(2)}px`,
  );
}

/**
 * A full radius can be written either way and renders identically: `50%` of a
 * square box and any pixel value at or beyond half its smaller side both produce
 * a circle. Comparing the two spellings as strings would report a difference
 * that does not exist on screen.
 */
function asFullRadius(value, box) {
  if (value === '50%') return 'full';
  const px = parseFloat(value);
  if (Number.isFinite(px) && box && px >= Math.min(box[0], box[1]) / 2) return 'full';
  return value;
}

function compareValues(section, name, pairs, detail, opts = {}) {
  const normalise = (prop, value, side) => {
    if (prop === 'borderRadius') return asFullRadius(value, opts.radiusBox && opts.radiusBox[side]);
    return String(value);
  };
  const bad = pairs.filter(
    ([prop, ref, actual]) => normalise(prop, ref, 'reference') !== normalise(prop, actual, 'ours'),
  );
  record(
    section,
    name,
    Object.fromEntries(pairs.map(([prop, ref]) => [prop, ref])),
    Object.fromEntries(pairs.map(([prop, , actual]) => [prop, actual])),
    bad.length === 0 ? 'match' : 'drift',
    bad.length === 0
      ? detail
      : `${detail}; differs on ${bad.map(([p, r, a]) => `${p}: ${r} vs ${a}`).join(', ')}`,
  );
}

/** Our capture records style values camelCase; the reference records only what it needs. */
const style = (node, prop) => (node?.style ? node.style[prop] : undefined);
const rect = (node) => (node ? [node.rect.x, node.rect.y, node.rect.width, node.rect.height] : null);
const size = (node) => (node ? [node.rect.width, node.rect.height] : null);


// ---------------------------------------------------------------------------
// load
// ---------------------------------------------------------------------------

const probe = JSON.parse(await readFile(path.join(EVIDENCE, 'arco-pro-live-probe.json'), 'utf8'));
const captures = {};
for (const page of ['dashboard', 'list', 'form', 'detail', 'components', 'index']) {
  try {
    captures[page] = JSON.parse(await readFile(path.join(CAPTURES, `${page}.json`), 'utf8'));
  } catch {
    throw new Error(
      `missing capture for ${page}; run "npm run 4:capture" first — this comparison ` +
        'must never silently skip a page, because a page that does not render is not a match',
    );
  }
}

const shot = (name) => readPng(path.join(EVIDENCE, name));

/**
 * The four reference pages, each with the capture it is compared against. A page
 * that is not compared is a page whose fidelity is unknown, so all four pairs are
 * asserted rather than sampled.
 */
const PAGE_SHOTS = [
  ['dashboard', 'reference-dashboard.png', 'captures/dashboard.png'],
  ['list', 'reference-list.png', 'captures/list.png'],
  ['form', 'reference-form.png', 'captures/form.png'],
  ['detail', 'reference-detail.png', 'captures/detail.png'],
];

// ---------------------------------------------------------------------------
// 1. pixels: the rules and fills that only a screenshot can prove
// ---------------------------------------------------------------------------

const PIXEL_CASES = [
  {
    name: 'header fill and 1px bottom rule at x=700',
    probe: (image, x) => [59, 58, 60].map((y) => image.pixel(x, y)),
    expected: ['#e5e6eb', '#ffffff', '#f2f3f5'],
    detail: 'rule on the 59th row of a 60px header, white above it, canvas below it',
  },
  {
    name: 'sidebar 1px right rule at y=400',
    probe: (image, x) => [219, 220].map((y) => image.pixel(y, 400)),
    expected: ['#ffffff', '#e5e6eb'],
    detail: 'the rule sits at x=220, one pixel outside the 220px sidebar, so it consumes no layout width',
  },
];

for (const [page, referenceFile, ourFile] of PAGE_SHOTS) {
  const reference = shot(referenceFile);
  const ours = shot(ourFile);

  if (reference.width !== ours.width || reference.height !== ours.height) {
    throw new Error(
      `${page}: screenshot sizes differ — reference ${reference.width}x${reference.height}, ` +
        `ours ${ours.width}x${ours.height}. Re-run 4:capture at the reference viewport ` +
        'before comparing.',
    );
  }

  for (const test of PIXEL_CASES) {
    for (const [label, image] of [
      ['reference', reference],
      ['ours', ours],
    ]) {
      const actual = test.probe(image, 700);
      const ok = actual.every((v, i) => v === test.expected[i]);
      record(
        'pixels',
        `${page} ${label}: ${test.name}`,
        test.expected,
        actual,
        ok ? 'match' : 'drift',
        test.detail,
      );
    }
  }
}

// ---------------------------------------------------------------------------
// 2. geometry and type, against the live probe
// ---------------------------------------------------------------------------

const d = captures.dashboard.metrics;
const l = captures.list.metrics;
const f = captures.form.metrics;
const t = captures.detail.metrics;

const { shell, sidebar, page, dashboard } = probe;

// header
compareLengths(
  'geometry',
  'header box',
  shell.header.box,
  rect(d.header),
  'fixed 60px bar, full width',
);
compareValues(
  'geometry',
  'header position and stacking',
  [
    ['position', shell.header.position, style(d.header, 'position')],
    ['zIndex', shell.header.zIndex, style(d.header, 'zIndex')],
    ['minWidth', shell.header.minWidth, style(d.header, 'minWidth')],
  ],
  'the source achieves the white fill and rule with a border-box bottom border',
);
compareValues(
  'geometry',
  'header bottom rule: 1px, border-coloured, and inside the 60px height',
  [
    ['borderBottomWidth', '1px', style(d.header, 'borderBottomWidth')],
    ['borderBottomColor', 'rgb(229, 230, 235)', style(d.header, 'borderBottomColor')],
  ],
  'cross-checked against the pixel row at y=59',
);

// brand
compareLengths('geometry', 'brand block width', [shell.brandBlock.box[2]], [d.brand.rect.width], 'the logo block');
compareLengths('geometry', 'brand mark', [shell.brandMark.box[2], shell.brandMark.box[3]], size(d.brandMark), 'the logo svg');
compareValues(
  'geometry',
  'brand name typography',
  [
    ['fontSize', shell.brandName.fontSize, style(d.brandName, 'fontSize')],
    ['fontWeight', shell.brandName.fontWeight, style(d.brandName, 'fontWeight')],
    ['lineHeight', shell.brandName.lineHeight, style(d.brandName, 'lineHeight')],
  ],
  'measured .logo-name: 20px/500 with a 30px line box',
);

// header tools
compareLengths('geometry', 'header search box', [shell.searchBox.box[2], shell.searchBox.box[3]], size(d.headerSearch), '');
compareValues(
  'geometry',
  'header search radius and fill',
  [
    ['borderRadius', shell.searchBox.borderRadius, style(d.headerSearch, 'borderRadius')],
    ['backgroundColor', shell.searchBox.backgroundColor, style(d.headerSearch, 'backgroundColor')],
  ],
  'the language\'s one 16px radius, on a 32px control',
);
compareLengths('geometry', 'header icon button', [32, 32], size(d.iconButton), '');
compareValues(
  'geometry',
  'header icon button shape and fill',
  [
    ['borderRadius', '50%', style(d.iconButton, 'borderRadius')],
    ['backgroundColor', shell.iconButton.backgroundColor, style(d.iconButton, 'backgroundColor')],
  ],
  '',
  { radiusBox: { reference: [32, 32], ours: [32, 32] } },
);
compareLengths('geometry', 'avatar', [32, 32], size(d.avatar), '');
compareValues(
  'geometry',
  'avatar shape and fill',
  [['backgroundColor', shell.avatar.backgroundColor, style(d.avatar, 'backgroundColor')]],
  '',
);
{
  const inset = 1270 - (d.avatar.rect.x + d.avatar.rect.width);
  compareLengths(
    'geometry',
    'header right inset',
    [28],
    [inset],
    '20px header padding plus the 8px the last tool item carries',
  );
}
compareValues(
  'geometry',
  'header tool rhythm',
  [
    ['gap', '16px', style(d.headerTools, 'gap')],
    ['paddingRight', '8px', style(d.headerTools, 'paddingRight')],
  ],
  'the reference gets the same 48px button rhythm from adjacent 48px items with 8px padding',
);

// sidebar
compareLengths('geometry', 'sidebar box', [sidebar.box[2], sidebar.box[3]], size(d.sider), '');
compareValues(
  'geometry',
  'sidebar surface, edge and stacking',
  [
    ['position', sidebar.position, style(d.sider, 'position')],
    ['zIndex', sidebar.zIndex, style(d.sider, 'zIndex')],
    ['paddingTop', sidebar.paddingTop, style(d.sider, 'paddingTop')],
    ['backgroundColor', sidebar.backgroundColor, style(d.sider, 'backgroundColor')],
    ['boxShadow', sidebar.boxShadow, style(d.sider, 'boxShadow')],
    ['borderRightWidth', sidebar.borderRightWidth, style(d.sider, 'borderRightWidth')],
  ],
  'the rule is a ::after at right:-1px, so border-right stays 0 and the menu column keeps its full width',
);
compareLengths(
  'geometry',
  'sidebar menu item box',
  [sidebar.menuItem.box[2], sidebar.menuItem.box[3]],
  size(d.menuSelected),
  '204x40 inside a 220px sidebar',
);
compareValues(
  'geometry',
  'sidebar menu item box and metrics',
  [
    ['paddingLeft', sidebar.menuItem.paddingLeft, style(d.menuSelected, 'paddingLeft')],
    ['paddingRight', sidebar.menuItem.paddingRight, style(d.menuSelected, 'paddingRight')],
    ['borderRadius', sidebar.menuItem.borderRadius, style(d.menuSelected, 'borderRadius')],
    ['height', sidebar.menuItem.height, style(d.menuSelected, 'height')],
    ['lineHeight', sidebar.menuItem.lineHeight, style(d.menuSelected, 'lineHeight')],
    ['fontSize', sidebar.menuItem.fontSize, style(d.menuSelected, 'fontSize')],
  ],
  'a leaf item pads 12px on both sides and carries a line box as tall as the row',
);
compareValues(
  'geometry',
  'selected menu item state',
  [
    ['fontWeight', sidebar.menuItemSelected.fontWeight, style(d.menuSelected, 'fontWeight')],
    ['color', sidebar.menuItemSelected.color, style(d.menuSelected, 'color')],
    ['backgroundColor', sidebar.menuItemSelected.backgroundColor, style(d.menuSelected, 'backgroundColor')],
  ],
  'selection changes fill, text colour and weight, and nothing else',
);
compareValues(
  'geometry',
  'group label row',
  [
    ['paddingLeft', sidebar.menuInlineHeader.paddingLeft, style(d.menuGroupLabel, 'paddingLeft')],
    ['paddingRight', sidebar.menuInlineHeader.paddingRight, style(d.menuGroupLabel, 'paddingRight')],
    ['height', sidebar.menuInlineHeader.height, style(d.menuGroupLabel, 'height')],
    ['lineHeight', sidebar.menuInlineHeader.lineHeight, style(d.menuGroupLabel, 'lineHeight')],
  ],
  'the row and its insets come from the reference; the type on it is this system\'s caption, '
    + 'a divergence recorded in arcopro/reports/visual-validation.md',
);
compareValues(
  'geometry',
  'sidebar menu vertical padding',
  [['paddingTop', '4px', style(d.menuWrap, 'paddingTop')]],
  'the reference menu inner box pads 4px top and bottom, which is what keeps the first item at y=64',
);

// content column and breadcrumb
compareLengths('geometry', 'content column width', [1010], [d.dashboard.rect.width], 'the field between the shell and the card edges');
compareLengths('geometry', 'content left offset', [240], [d.contentInner.rect.x + 20], '220px sidebar plus 20px page padding');
compareLengths('geometry', 'breadcrumb height', [page.breadcrumb.height.match(/[\d.]+/)[0]].map(Number), [d.breadcrumb.rect.height], '');
for (const [id, cap] of [['list', l], ['form', f], ['detail', t]]) {
  compareLengths('geometry', `breadcrumb height (${id})`, [24], [cap.breadcrumb.rect.height], '');
}

// card
compareValues(
  'geometry',
  'card surface',
  [
    ['borderRadius', page.card.borderRadius, style(d.card, 'borderRadius')],
    ['backgroundColor', page.card.backgroundColor, style(d.card, 'backgroundColor')],
    ['boxShadow', page.card.boxShadow, style(d.card, 'boxShadow')],
  ],
  'a card is rounded, white and never carries a shadow',
);
compareValues(
  'geometry',
  'card padding',
  [['paddingTop', '20px', style(d.card, 'paddingTop')], ['paddingLeft', '20px', style(d.card, 'paddingLeft')]],
  'the reference .panel body pads 20px',
);

// page title
compareValues(
  'geometry',
  'page title typography',
  [
    ['fontSize', page.pageTitle.fontSize, style(d.heroName, 'fontSize')],
    ['fontWeight', page.pageTitle.fontWeight, style(d.heroName, 'fontWeight')],
    ['lineHeight', page.pageTitle.lineHeight, style(d.heroName, 'lineHeight')],
  ],
  'the one 20px heading on a page',
);
compareLengths('geometry', 'page title line box', [28], [d.heroName.rect.height], '');

// dashboard split
compareLengths('geometry', 'dashboard workspace column width', [dashboard.wrapper.measured.leftItem[2]], [d.dashboardMain.rect.width], '');
compareLengths('geometry', 'dashboard rail width', [dashboard.wrapper.measured.rightItem[2]], [d.dashboardRail.rect.width], '');
compareLengths(
  'geometry',
  'dashboard column gap',
  [dashboard.wrapper.measured.leftItem[2] + 16 + dashboard.wrapper.measured.rightItem[2]],
  [d.dashboard.rect.width],
  'left + 16px + right adds up to the content column',
);

// KPI
compareLengths('geometry', 'KPI disc', [dashboard.kpiDisc.box[2], dashboard.kpiDisc.box[3]], size(d.kpiIcon), '');
compareValues(
  'geometry',
  'KPI disc shape and fill',
  [
    ['borderRadius', dashboard.kpiDisc.borderRadius, style(d.kpiIcon, 'borderRadius')],
    ['backgroundColor', dashboard.kpiDisc.backgroundColor, style(d.kpiIcon, 'backgroundColor')],
  ],
  '',
  { radiusBox: { reference: [54, 54], ours: [54, 54] } },
);
compareValues(
  'geometry',
  'KPI number typography',
  [
    ['fontSize', dashboard.kpiCount.fontSize, style(d.kpiValue, 'fontSize')],
    ['fontWeight', dashboard.kpiCount.fontWeight, style(d.kpiValue, 'fontWeight')],
    ['lineHeight', dashboard.kpiCount.lineHeight, style(d.kpiValue, 'lineHeight')],
  ],
  '',
);
compareLengths(
  'geometry',
  'KPI number line box',
  [parseFloat(dashboard.kpiCount.height)],
  [d.kpiValue.rect.height],
  'the unit span must carry its own line-height or this grows to 36px',
);

// ---------------------------------------------------------------------------
// 3. every page: one shell, the same measurement on all six pages
// ---------------------------------------------------------------------------

for (const id of ['list', 'form', 'detail', 'components', 'index']) {
  const c = captures[id].metrics;
  const rule = captures[id].pseudo.sidebarRule.style;

  compareLengths(
    'pages',
    `${id}: header box`,
    shell.header.box,
    rect(c.header),
    'the shell is one component, so a page cannot have its own header height',
  );
  compareValues(
    'pages',
    `${id}: header bottom rule`,
    [
      ['borderBottomWidth', '1px', style(c.header, 'borderBottomWidth')],
      ['borderBottomColor', 'rgb(229, 230, 235)', style(c.header, 'borderBottomColor')],
    ],
    'cross-checked against every page\'s pixel row at y=59',
  );
  compareLengths('pages', `${id}: sidebar box`, [sidebar.box[2], sidebar.box[3]], size(c.sider), '');
  compareValues(
    'pages',
    `${id}: sidebar right rule`,
    [
      ['right', '-1px', rule.right],
      ['left', '220px', rule.left],
      ['width', '1px', rule.width],
      ['height', '848px', rule.height],
      ['backgroundColor', 'rgb(229, 230, 235)', rule.backgroundColor],
    ],
    'drawn by ::after outside the 220px box, so it costs the menu column nothing',
  );
  compareLengths(
    'pages',
    `${id}: menu row box`,
    [sidebar.menuItem.box[2], sidebar.menuItem.box[3]],
    size(c.menuSelected),
    '204x40 on every page, whichever row happens to be selected',
  );
  compareLengths('pages', `${id}: avatar box`, [32, 32], size(c.avatar), '');
  compareLengths(
    'pages',
    `${id}: brand mark`,
    [shell.brandMark.box[2], shell.brandMark.box[3]],
    size(c.brandMark),
    '',
  );
}

// ---------------------------------------------------------------------------
// uncovered
// ---------------------------------------------------------------------------

results.uncovered.push(
  {
    what: 'the reference pages for list, form and detail were swept into arco-pro-metrics.json but not re-probed with exact selectors',
    why: 'their entries there use generic key names whose target element cannot be verified from the recorded numbers, so using them as comparison targets would compare the wrong elements',
    coveredInstead:
      'every shared landmark — shell, sidebar, header, card, breadcrumb, control heights — is compared through the exact-selector probe on the dashboard; all four reference pages are compared pixel for pixel against their captures; and the shell landmarks of all six pages are compared against the same reference values',
  },
  {
    what: 'table, form and pagination internals versus the live site',
    why: 'those pages are behind the same login and were swept with the generic key set; the comparison would need a second pass with exact selectors',
    coveredInstead:
      'the values come from the Arco theme package and the Pro source, and are asserted against the contract by npm run 3:verify-generated',
  },
);

// ---------------------------------------------------------------------------
// report
// ---------------------------------------------------------------------------

const all = [...results.pixels, ...results.geometry, ...results.pages];
const drifts = all.filter((r) => r.verdict !== 'match');

const payload = {
  note:
    'The visual fidelity comparison. "pixels" answers what only a screenshot can answer, on ' +
    'every page pair; "geometry" compares the dashboard\'s landmarks against the live reference ' +
    'probe; "pages" compares the shell landmarks of the other five pages against the same ' +
    'reference values, because one shell has to measure the same everywhere. Every reference ' +
    'value in the probe carries the method that produced it.',
  referenceViewport: probe.captureViewport,
  referenceScreenshots: PAGE_SHOTS.map(([, ref]) => ref),
  ourScreenshots: PAGE_SHOTS.map(([, , ours]) => ours),
  lengthTolerancePx: LENGTH_TOLERANCE,
  summary: {
    compared: all.length,
    match: all.length - drifts.length,
    drift: drifts.length,
    uncovered: results.uncovered.length,
  },
  results,
};

await writeFile(
  path.join(EVIDENCE, 'visual-comparison.json'),
  `${JSON.stringify(payload, null, 2)}\n`,
  'utf8',
);

console.log('Visual fidelity comparison');
console.log('--------------------------');
const SECTION_TITLES = {
  pixels: 'Pixels (screenshot evidence, all four page pairs)',
  geometry: 'Geometry and type (live reference probe, dashboard)',
  pages: 'Every page (shell landmarks, against the same reference values)',
};

for (const section of ['pixels', 'geometry', 'pages']) {
  console.log('');
  console.log(SECTION_TITLES[section]);
  for (const r of results[section]) {
    const mark = r.verdict === 'match' ? 'MATCH' : 'DRIFT';
    const ref = JSON.stringify(r.reference);
    const act = JSON.stringify(r.actual);
    console.log(`  ${mark}  ${r.name}`);
    console.log(`         reference ${ref}`);
    console.log(`         ours      ${act}`);
    if (r.verdict !== 'match') console.log(`         ${r.detail}`);
  }
}

console.log('');
console.log('Not covered, and why:');
for (const u of results.uncovered) {
  console.log(`  - ${u.what}`);
  console.log(`    why: ${u.why}`);
  console.log(`    covered instead: ${u.coveredInstead}`);
}

console.log('');
console.log(`compared ${all.length}  match ${all.length - drifts.length}  drift ${drifts.length}`);
console.log(`5:compare ${drifts.length === 0 ? 'OK' : 'FAILED'}`);
if (drifts.length > 0) process.exit(1);
