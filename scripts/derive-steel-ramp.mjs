#!/usr/bin/env node
/**
 * 9:steel-ramp — re-derive the IndustrialSteelBlue colour family and check it.
 *
 * The IndustrialSteelBlue palette is not hand-picked and not invented from the
 * verbal description in the task specification. It is a documented transform of
 * the Arco baseline, so that the relationship "Arco baseline -> design
 * relationship -> JIEAN adaptation decision -> IndustrialSteelBlue token" stays
 * auditable:
 *
 *   1. Baseline (SOURCE_EXACT): the arcoblue family of Arco Design 2.66.16, both
 *      the light-theme ladder and the dark-theme re-mapping, as published in
 *      `@arco-design/web-react@2.66.16/dist/css/arco.css` (values are RGB
 *      triplets there) and defined in `components/style/theme/color/colors.less`
 *      (`@arcoblue-6: #165dff`, the other steps from the official palette
 *      generator). Both are recorded in the constants below.
 *
 *   2. Design relationship (JIEAN_ADAPTED): the family keeps Arco's ten-step
 *      structure and its step-to-role mapping (6 = default, 5 = hover,
 *      7 = active, 3 = disabled, 1 = subtle), and keeps the contrast behaviour of
 *      the pale tints and the deep shades, but moves the hue to a cool industrial
 *      210 degrees, reduces saturation, and deepens the interactive core.
 *
 *   3. The transform, per step n:
 *        hue        = 210 degrees (Arco: 211.3 to 224.1 degrees across the ramp)
 *        saturation = saturation(arco_n) * 0.38
 *        luminance  = luminance(arco_n) * 0.78   for n in {5, 6, 7}
 *                   = luminance(arco_n)           otherwise
 *      The sRGB colour holding that luminance at that hue and saturation is
 *      solved for here, so the file records numbers rather than adjectives.
 *
 *   4. Dark theme: Arco does not invert its ramp mechanically; it re-maps it
 *      (dark `--arcoblue-1` is the darkest step and `--arcoblue-10` the lightest,
 *      and dark step 6 is lighter than light step 6). IndustrialSteelBlue mirrors
 *      that behaviour with `primary-on-dark`: the same hue and saturation
 *      treatment, holding the luminance of Arco's own dark-theme step 6, so every
 *      dark-theme contrast relationship transfers unchanged.
 *
 * Usage:
 *   node scripts/derive-steel-ramp.mjs --check   compare against DESIGN.md
 *   node scripts/derive-steel-ramp.mjs --write   write the evidence file
 */

import { writeFile } from 'node:fs/promises';
import path from 'node:path';

import { REPO_ROOT, loadContract } from './lib/design-system.mjs';

export const PACKAGE = 'industrial-steel-blue';

/** Arco Design 2.66.16, `--arcoblue-1` .. `--arcoblue-10`, light theme. */
const ARCO_LIGHT = [
  [232, 243, 255],
  [190, 218, 255],
  [148, 191, 255],
  [106, 161, 255],
  [64, 128, 255],
  [22, 93, 255],
  [14, 66, 210],
  [7, 44, 166],
  [3, 26, 121],
  [0, 13, 77],
];

/** Arco Design 2.66.16, `--arcoblue-1` .. `--arcoblue-10`, dark re-mapping. */
const ARCO_DARK = [
  [0, 13, 77],
  [4, 27, 121],
  [14, 50, 166],
  [29, 77, 210],
  [48, 111, 255],
  [60, 126, 255],
  [104, 159, 255],
  [147, 190, 255],
  [190, 218, 255],
  [234, 244, 255],
];

/** The transform, as documented above. */
export const TRANSFORM = {
  hue: 210,
  saturationFactor: 0.38,
  coreLuminanceFactor: 0.78,
  coreSteps: [5, 6, 7],
};

/** Steps used as semantic tokens, mirroring Arco's own step-to-role mapping. */
export const ROLE_STEPS = {
  'primary-hover': 5,
  primary: 6,
  'primary-active': 7,
  'primary-disabled': 3,
  'primary-subtle': 1,
};

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const toLinear = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const fromLinear = (c) =>
  c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055;

export function luminance([r, g, b]) {
  const [lr, lg, lb] = [r, g, b].map((v) => toLinear(v / 255));
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

export function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const hex = ([r, g, b]) =>
  `#${[r, g, b]
    .map((v) => Math.round(v).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()}`;

/** HSL -> RGB, all channels 0-255. */
function hslToRgb(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = (((h % 360) + 360) % 360) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  const [r1, g1, b1] =
    hp < 1 ? [c, x, 0]
    : hp < 2 ? [x, c, 0]
    : hp < 3 ? [0, c, x]
    : hp < 4 ? [0, x, c]
    : hp < 5 ? [x, 0, c]
    : [c, 0, x];
  const m = l - c / 2;
  return [(r1 + m) * 255, (g1 + m) * 255, (b1 + m) * 255];
}

/** RGB -> HSL with hue in degrees, saturation and lightness in 0-1. */
export function rgbToHsl([r, g, b]) {
  const [rr, gg, bb] = [r / 255, g / 255, b / 255];
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return [0, 0, l];
  const s = d / (1 - Math.abs(2 * l - 1));
  const h =
    max === rr ? 60 * (((gg - bb) / d) % 6)
    : max === gg ? 60 * ((bb - rr) / d + 2)
    : 60 * ((rr - gg) / d + 4);
  return [(h + 360) % 360, s, l];
}

/**
 * Solve for the sRGB colour at this hue and saturation whose WCAG relative
 * luminance is `target`. Luminance rises monotonically with lightness at fixed
 * hue and saturation, so a bisection is exact enough to round-trip through 8-bit
 * sRGB.
 */
function solveForLuminance(target, hue, saturation) {
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 60; i += 1) {
    const mid = (lo + hi) / 2;
    if (luminance(hslToRgb(hue, saturation, mid)) < target) lo = mid;
    else hi = mid;
  }
  return hslToRgb(hue, saturation, (lo + hi) / 2);
}

/** The IndustrialSteelBlue ten-step family, derived from the Arco light ladder. */
export function steelFamily() {
  return ARCO_LIGHT.map((arco, i) => {
    const step = i + 1;
    const [, saturation] = rgbToHsl(arco);
    const factor = TRANSFORM.coreSteps.includes(step) ? TRANSFORM.coreLuminanceFactor : 1;
    const rgb = solveForLuminance(
      luminance(arco) * factor,
      TRANSFORM.hue,
      saturation * TRANSFORM.saturationFactor,
    );
    return {
      step,
      arco: hex(arco),
      value: hex(rgb),
      rgb: rgb.map(Math.round),
      arcoLuminance: round(luminance(arco)),
      luminance: round(luminance(rgb)),
      arcoHue: round(rgbToHsl(arco)[0], 1),
      arcoSaturation: round(rgbToHsl(arco)[1], 3),
      saturation: round(rgbToHsl(rgb)[1], 3),
      hueShift: round(rgbToHsl(arco)[0] - TRANSFORM.hue, 1),
    };
  });
}

/**
 * The dark-theme interactive colour.
 *
 * Its floor is Arco's own dark-theme step 6 luminance, so nothing about the dark
 * theme gets harder to read than in Arco. It is then raised if that is not enough
 * for 4.5:1 on the dark surface family — Arco's dark step 6 reaches 4.21:1 on
 * `dark-surface`, this package's reaches 4.5:1, and the difference is a
 * deliberate JIEAN improvement rather than accident.
 */
export function primaryOnDark() {
  const arcoDarkStep6 = ARCO_DARK[5];
  const floor = luminance(arcoDarkStep6);
  const darkSurface = [35, 35, 36]; // dark-surface
  const needed = 4.5 * (luminance(darkSurface) + 0.05) - 0.05;
  const target = Math.max(floor, needed);
  const [, saturation] = rgbToHsl(arcoDarkStep6);
  const rgb = solveForLuminance(target, TRANSFORM.hue, saturation * TRANSFORM.saturationFactor);
  return {
    value: hex(rgb),
    rgb: rgb.map(Math.round),
    arco: hex(arcoDarkStep6),
    arcoLuminance: round(floor),
    raisedFor: round(needed, 4),
    target: round(target),
    luminance: round(luminance(rgb)),
  };
}

const round = (n, digits = 4) => {
  const f = 10 ** digits;
  return Math.round(n * f) / f;
};

/** The colours this script owns in the contract. */
export function expectedTokens() {
  const family = steelFamily();
  const byStep = (n) => family.find((s) => s.step === n).value;
  const tokens = {};
  for (const [token, step] of Object.entries(ROLE_STEPS)) tokens[token] = byStep(step);
  tokens['primary-on-dark'] = primaryOnDark().value;
  return tokens;
}

/** Contrast checks that make the transform falsifiable rather than decorative. */
export function amplitudeChecks(tokens) {
  const rgbOf = (h) => {
    const m = /^#?([0-9a-f]{6})$/i.exec(h);
    if (!m) throw new Error(`not a 6-digit hex: ${h}`);
    const n = parseInt(m[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const white = [255, 255, 255];
  const canvas = [242, 243, 245];
  const darkCanvas = [23, 23, 26];
  const darkSurface = [35, 35, 36];
  const y = (h) => luminance(rgbOf(h));
  return [
    ['white on primary fill meets AA', contrast(white, rgbOf(tokens.primary)), 4.5],
    ['primary as text on surface exceeds the Arco baseline', contrast(rgbOf(tokens.primary), white), 5.15],
    ['primary as text on canvas meets AA', contrast(rgbOf(tokens.primary), canvas), 4.5],
    ['hover is lighter than default', y(tokens['primary-hover']) > y(tokens.primary), true],
    ['active is darker than default', y(tokens['primary-active']) < y(tokens.primary), true],
    ['disabled is darker than subtle', y(tokens['primary-disabled']) < y(tokens['primary-subtle']), true],
    ['primary on dark canvas meets 4.5:1', contrast(rgbOf(tokens['primary-on-dark']), darkCanvas), 4.5],
    ['primary on dark surface meets 4.5:1', contrast(rgbOf(tokens['primary-on-dark']), darkSurface), 4.5],
  ];
}

const argv = process.argv.slice(2);
const wantsWrite = argv.includes('--write');
const wantsCheck = argv.includes('--check');

const tokens = expectedTokens();
const family = steelFamily();
const dark = primaryOnDark();
const failed = [];

for (const [label, actual, minimum] of amplitudeChecks(tokens)) {
  const ok = typeof minimum === 'boolean' ? actual === minimum : actual >= minimum;
  const shown = typeof actual === 'number' ? round(actual, 3) : String(actual);
  console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${label}: ${shown}${typeof minimum === 'number' ? ` (>= ${minimum})` : ''}`);
  if (!ok) failed.push(label);
}

console.log('');
console.log(`Family (hue ${TRANSFORM.hue}, saturation x${TRANSFORM.saturationFactor}, core luminance x${TRANSFORM.coreLuminanceFactor}):`);
for (const s of family) {
  console.log(
    `  ${String(s.step).padStart(2)}  arco ${s.arco}  ->  ${s.value}` +
      `   hue ${s.arcoHue} -> ${TRANSFORM.hue} (shift ${s.hueShift})` +
      `   light ${s.arcoLuminance} -> ${s.luminance}`,
  );
}
console.log(`  primary-on-dark ${dark.value} (Arco dark step 6 ${dark.arco}, luminance ${dark.arcoLuminance})`);
console.log('');
console.log('Token values:');
for (const [k, v] of Object.entries(tokens)) console.log(`  ${k.padEnd(18)} ${v}`);

if (failed.length > 0) {
  console.error(`\n9:steel-ramp FAILED — ${failed.length} check(s): ${failed.join('; ')}`);
  process.exit(1);
}

if (wantsCheck) {
  const { report, paths } = await loadContract(PACKAGE);
  const mismatches = [];
  for (const [token, value] of Object.entries(tokens)) {
    const actual = report.designSystem.colors.get(token);
    const formatted = actual?.hex?.toUpperCase();
    if (formatted !== value) mismatches.push(`${token}: DESIGN.md ${formatted ?? '<missing>'} != derived ${value}`);
  }
  if (mismatches.length > 0) {
    console.error(`\n9:steel-ramp FAILED — ${path.relative(REPO_ROOT, paths.contract)} has drifted:`);
    for (const m of mismatches) console.error(`  - ${m}`);
    process.exit(1);
  }
  console.log(`\n9:steel-ramp OK — ${path.relative(REPO_ROOT, paths.contract)} matches the derivation.`);
}

if (wantsWrite) {
  const target = path.join(
    REPO_ROOT,
    PACKAGE,
    'reports',
    'evidence',
    'palette-derivation.json',
  );
  await writeFile(
    target,
    `${JSON.stringify(
      {
        $source:
          'Re-derivable with `node scripts/derive-steel-ramp.mjs`; this file is its output.',
        baseline: {
          primary: 'Arco Design 2.66.16 arcoblue family',
          light: ARCO_LIGHT.map(hex),
          dark: ARCO_DARK.map(hex),
          sources: [
            'components/style/theme/color/colors.less (@arcoblue-6: #165dff)',
            '@arco-design/web-react@2.66.16/dist/css/arco.css (resolved --arcoblue-1..10, both themes)',
            'components/style/theme/default.less (motion and typography variables)',
          ],
        },
        transform: TRANSFORM,
        roleSteps: ROLE_STEPS,
        family,
        primaryOnDark: dark,
        tokens,
        checks: amplitudeChecks(tokens).map(([label, actual, minimum]) => ({
          label,
          actual: typeof actual === 'number' ? round(actual, 3) : actual,
          minimum,
          pass: typeof minimum === 'boolean' ? actual === minimum : actual >= minimum,
        })),
      },
      null,
      2,
    )}\n`,
    'utf8',
  );
  console.log(`\nwrote ${path.relative(REPO_ROOT, target)}`);
}

if (!wantsCheck && !wantsWrite) {
  console.log('\n(run with --check to compare against DESIGN.md, or --write to write the evidence file)');
}
