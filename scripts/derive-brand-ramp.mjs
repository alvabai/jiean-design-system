#!/usr/bin/env node
/**
 * Derive the `brandcolor` primary ramp from the JIEAN brand red, and check the
 * contract against that derivation.
 *
 * Rule: keep each `arco-blue` step's WCAG relative luminance, move the hue to the
 * brand hue, keep the step's saturation. Luminance is what every contrast pair
 * in `scripts/verify-generated.mjs` is computed from, so preserving it makes
 * the whole accessibility audit transfer with nearly the same ratios instead of
 * being re-litigated colour by colour.
 *
 * `primary` is not derived: the brand supplies it as a literal (#D7000F), and its
 * luminance is therefore lower than the blue it replaces — which moves the
 * tightest pairs in the safe direction and is reported below.
 *
 * The rule is only worth anything if it can fail, so `--check` re-derives every
 * step from the *sibling contract* (`arco-blue/DESIGN.md`, the shape being
 * transferred) and from the *brand literal*, then compares the result with
 * `brandcolor/DESIGN.md`. Both files are read through the resolved model, not by
 * re-parsing YAML here.
 *
 * Run: node scripts/derive-brand-ramp.mjs           # print the derivation
 *      node scripts/derive-brand-ramp.mjs --check   # fail if the contract drifts
 */

import path from 'node:path';

import { PACKAGES, formatColor, loadContract, REPO_ROOT } from './lib/design-system.mjs';

const CHECK = process.argv.includes('--check');
const SOURCE_PACKAGE = PACKAGES[0];
const BRAND_PACKAGE = 'brandcolor';

/** The brand literal: 捷安红, R215 G0 B15. */
const BRAND_RED = '#D7000F';

/** 深灰, R53 G53 B53 — the secondary brand colour, and the roles it takes. */
const BRAND_GREY = '#353535';
const BRAND_GREY_ROLES = ['text-primary', 'tooltip'];
const BRAND_MASK = { rgb: [53, 53, 53], alpha: 0.6, role: 'mask' };

/** The four steps of the primary ramp that are derived; `primary` is given. */
const DERIVED_STEPS = ['primary-hover', 'primary-active', 'primary-disabled', 'primary-subtle'];

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function rgbToHex([r, g, b]) {
  return `#${[r, g, b]
    .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0'))
    .join('')}`;
}

const channelToLinear = (v) => {
  const c = v / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

/** WCAG 2.x relative luminance. */
function luminance(rgb) {
  const [r, g, b] = rgb.map(channelToLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function rgbToHsl([r, g, b]) {
  const [rr, gg, bb] = [r / 255, g / 255, b / 255];
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === rr) h = ((gg - bb) / d + (gg < bb ? 6 : 0)) / 6;
  else if (max === gg) h = ((bb - rr) / d + 2) / 6;
  else h = ((rr - gg) / d + 4) / 6;
  return [h * 360, s, l];
}

function hslToRgb([h, s, l]) {
  const hue = (((h % 360) + 360) % 360) / 360;
  if (s === 0) return [l * 255, l * 255, l * 255];
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const toChannel = (t) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };
  return [toChannel(hue + 1 / 3) * 255, toChannel(hue) * 255, toChannel(hue - 1 / 3) * 255];
}

/** Find the HSL lightness whose sRGB rounding lands on the target luminance. */
function solveLightness(hue, saturation, target) {
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 200; i += 1) {
    const mid = (lo + hi) / 2;
    if (luminance(hslToRgb([hue, saturation, mid])) < target) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

const round = (n, d = 4) => Number(n.toFixed(d));
const brandHue = rgbToHsl(hexToRgb(BRAND_RED))[0];

/** Derive one step: the source step's luminance and saturation, the brand hue. */
function derive(sourceHex, sourceLuminance) {
  const saturation = rgbToHsl(hexToRgb(sourceHex))[1];
  const lightness = solveLightness(brandHue, saturation, sourceLuminance);
  const hex = rgbToHex(hslToRgb([brandHue, saturation, lightness]));
  return { hex, saturation, lightness, luminance: luminance(hexToRgb(hex)) };
}

const hexOf = (entry) => formatColor(entry).slice(0, 7);
const alphaOf = (entry) => (entry && typeof entry.a === 'number' ? entry.a : 1);

const sourceColors = (await loadContract(SOURCE_PACKAGE)).report.designSystem.colors;
const brandColors = (await loadContract(BRAND_PACKAGE)).report.designSystem.colors;

// ----------------------------------------------------------------- the table
console.log(`brand anchor   ${BRAND_RED}  hue ${round(brandHue, 2)}deg`);
console.log(`brand grey     ${BRAND_GREY}  roles: ${[...BRAND_GREY_ROLES, BRAND_MASK.role].join(', ')}`);
console.log('');
console.log('step                 source     lum     derived    lum     d(lum)   H/S/L of derived');

const derivedRows = DERIVED_STEPS.map((name) => {
  const sourceHex = hexOf(sourceColors.get(name));
  const sourceLuminance = sourceColors.get(name).luminance;
  const row = { name, sourceHex, sourceLuminance, ...derive(sourceHex, sourceLuminance) };
  console.log(
    `${name.padEnd(20)} ${sourceHex}  ${round(sourceLuminance).toFixed(4)}  ${row.hex}  ${round(row.luminance).toFixed(4)}  ` +
      `${(row.luminance - sourceLuminance >= 0 ? '+' : '')}${round(row.luminance - sourceLuminance, 5).toFixed(5)}  ` +
      `${round(brandHue, 1)}/${round(row.saturation * 100, 1)}%/${round(row.lightness * 100, 1)}%`,
  );
  return row;
});

const primary = brandColors.get('primary');
console.log(
  `${'primary'.padEnd(20)} ${hexOf(sourceColors.get('primary'))}  ` +
    `${round(sourceColors.get('primary').luminance).toFixed(4)}  ${hexOf(primary)}  ` +
    `${round(primary.luminance).toFixed(4)}  ` +
    `${(primary.luminance - sourceColors.get('primary').luminance >= 0 ? '+' : '')}` +
    `${round(primary.luminance - sourceColors.get('primary').luminance, 5).toFixed(5)}  ` +
    'given by the brand, not derived',
);

if (!CHECK) {
  console.log('');
  console.log('Pass --check to assert that both contracts agree with this derivation.');
  process.exit(0);
}

// ----------------------------------------------------------------- the check
const problems = [];
const expect = (ok, message) => {
  if (!ok) problems.push(message);
};

expect(
  hexOf(primary) === BRAND_RED.toLowerCase(),
  `${BRAND_PACKAGE}/DESIGN.md primary is ${hexOf(primary)}, expected the brand literal ${BRAND_RED}`,
);

for (const row of derivedRows) {
  const actual = hexOf(brandColors.get(row.name));
  expect(
    actual === row.hex.toLowerCase(),
    `${BRAND_PACKAGE}/DESIGN.md ${row.name} is ${actual}, derivation says ${row.hex}`,
  );
}

for (const role of BRAND_GREY_ROLES) {
  const entry = brandColors.get(role);
  expect(
    entry !== undefined && hexOf(entry).toLowerCase() === BRAND_GREY.toLowerCase(),
    `${BRAND_PACKAGE}/DESIGN.md ${role} is ${entry ? hexOf(entry) : 'missing'}, expected the brand grey ${BRAND_GREY}`,
  );
}

const mask = brandColors.get(BRAND_MASK.role);
expect(
  mask !== undefined &&
    [mask.r, mask.g, mask.b].every((v, i) => v === BRAND_MASK.rgb[i]) &&
    Math.abs(alphaOf(mask) - BRAND_MASK.alpha) < 1e-9,
  `${BRAND_PACKAGE}/DESIGN.md ${BRAND_MASK.role} is ${mask ? formatColor(mask) : 'missing'}, ` +
    `expected rgb(${BRAND_MASK.rgb.join(', ')}) at alpha ${BRAND_MASK.alpha}`,
);

// The derivation is only meaningful while the source ramp still has the shape it
// was transferred from: if the sibling's steps move, this must fail rather than
// silently keep applying an old rule.
const sourceShadowed = Object.fromEntries(
  ['primary', ...DERIVED_STEPS].map((n) => [n, hexOf(sourceColors.get(n))]),
);
expect(
  new Set(Object.values(sourceShadowed)).size === 5,
  `${SOURCE_PACKAGE}/DESIGN.md primary ramp is not five distinct steps: ` +
    JSON.stringify(sourceShadowed),
);

console.log('');
console.log(
  `checked ${DERIVED_STEPS.length} derived steps against ${SOURCE_PACKAGE}/DESIGN.md luminance, ` +
    `the ${BRAND_GREY_ROLES.length + 1} brand-grey roles against ${BRAND_GREY}, ` +
    `and the primary literal against ${BRAND_RED}`,
);
if (problems.length > 0) {
  console.error('');
  for (const p of problems) console.error(`  FAIL  ${p}`);
  console.error(`\n7:brand-ramp FAILED — ${problems.length} drift(s)`);
  process.exit(1);
}
console.log(`7:brand-ramp OK — ${path.relative(REPO_ROOT, 'brandcolor/DESIGN.md')} matches the derivation`);
