#!/usr/bin/env node
/**
 * 3:verify-generated — prove that the generated artifacts really come from the
 * contract, and re-audit the contrast numbers that the documentation quotes.
 *
 * This is the check that makes the repository trustworthy rather than merely
 * consistent. It verifies five independent things:
 *
 *   1. every generated artifact exists, parses, and is non-empty;
 *   2. the contract hash recorded inside the derived files matches the contract
 *      on disk right now;
 *   3. the derived file loses nothing from the contract, and agrees value for
 *      value with the official exporter wherever both describe the same thing;
 *   4. the known limitations of the official exporter are still true (if
 *      upstream fixes them, this fails loudly instead of the docs going stale);
 *   5. the WCAG contrast audit still produces exactly the set of failures the
 *      documentation records as deliberate exceptions.
 *
 * Nothing here re-implements token resolution; the model comes from the official
 * linter (see scripts/lib/design-system.mjs).
 */

import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { lint } from '@google/design.md/linter';

import {
  REPO_ROOT,
  cssCustomProperties,
  formatColor,
  loadContract,
  packagePaths,
  requestedPackages,
} from './lib/design-system.mjs';

const rel = (p) => path.relative(REPO_ROOT, p);
const packages = requestedPackages();

// ---------------------------------------------------------------------------
// Colour maths (WCAG 2.x relative luminance)
// ---------------------------------------------------------------------------

const srgb = (hex) => {
  const h = hex.replace('#', '');
  const v = h.length === 8 ? h.slice(0, 6) : h;
  return [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16));
};
const alphaOf = (hex) => {
  const h = hex.replace('#', '');
  return h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
};
/** Composite `fg` (which may carry alpha) over opaque `bg`. */
const composite = (fg, bg) => {
  const a = alphaOf(fg);
  if (a >= 1) return fg;
  const f = srgb(fg);
  const b = srgb(bg);
  return `#${f
    .map((v, i) => Math.round(v * a + b[i] * (1 - a)).toString(16).padStart(2, '0'))
    .join('')}`;
};
const luminance = (hex) => {
  const [r, g, b] = srgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (fg, bg) => {
  const a = luminance(composite(fg, bg));
  const b = luminance(bg);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
};

let packageFailures = 0;
for (const [index, pkg] of packages.entries()) {
  if (index > 0) console.log('');
  const checks = [];
  const check = (name, ok, detail = '') => checks.push({ name, ok: Boolean(ok), detail });
  const { contract: CONTRACT_PATH, artifacts: ARTIFACTS } = packagePaths(pkg);
  // ---------------------------------------------------------------------------
  // Load the contract
  // ---------------------------------------------------------------------------

  const { raw, report } = await loadContract(pkg);
  const state = report.designSystem;
  const sha256 = createHash('sha256').update(raw, 'utf8').digest('hex');

  const colorHex = (name) => {
    const c = state.colors.get(name);
    if (!c) throw new Error(`no such colour token: ${name}`);
    return formatColor(c);
  };
  const resolveColor = (ref) => (ref.startsWith('#') ? ref : colorHex(ref));

  // ---------------------------------------------------------------------------
  // 1. artifacts exist, parse, non-empty
  // ---------------------------------------------------------------------------

  const files = {};
  for (const [key, p] of Object.entries(ARTIFACTS)) {
    try {
      files[key] = await readFile(p, 'utf8');
      check(`artifact present: ${rel(p)}`, files[key].length > 0, `${files[key].length} bytes`);
    } catch (err) {
      check(`artifact present: ${rel(p)}`, false, err.code ?? String(err));
    }
  }

  const jsonOf = (key) => {
    if (files[key] === undefined) return null;
    try {
      return JSON.parse(files[key]);
    } catch (err) {
      check(`artifact parses as JSON: ${rel(ARTIFACTS[key])}`, false, err.message);
      return null;
    }
  };

  const dtcg = jsonOf('dtcg');
  const tailwind = jsonOf('tailwind');
  const fullJson = jsonOf('fullJson');

  check('official dtcg export parses', dtcg !== null);
  check('official tailwind export parses', tailwind !== null);
  check('derived full json parses', fullJson !== null);

  // ---------------------------------------------------------------------------
  // 2. provenance: recorded contract hash matches the contract on disk
  // ---------------------------------------------------------------------------

  if (files.fullCss) {
    const m = files.fullCss.match(/Source sha256\s*:\s*([0-9a-f]{64})/);
    check(
      'dist/tokens.full.css records the current contract sha256',
      m !== null && m[1] === sha256,
      m ? m[1] : 'no Source sha256 line found',
    );
  }
  if (fullJson) {
    check(
      'dist/tokens.full.json records the current contract sha256',
      fullJson.$source?.contractSha256 === sha256,
      fullJson.$source?.contractSha256 ?? 'missing $source.contractSha256',
    );
  }
  check('contract sha256 computed', /^[0-9a-f]{64}$/.test(sha256), sha256);

  // ---------------------------------------------------------------------------
  // 3. lossless derivation and agreement with the official exporter
  // ---------------------------------------------------------------------------

  const expected = cssCustomProperties(state);
  const expectedMap = new Map(expected);

  if (files.fullCss) {
    const declared = new Map();
    for (const line of files.fullCss.split('\n')) {
      const m = line.match(/^\s*(--[a-z0-9-]+)\s*:\s*(.+?);\s*$/i);
      if (m) declared.set(m[1], m[2]);
    }
    check(
      'dist/tokens.full.css declares every expected custom property',
      expected.every(([k]) => declared.has(k)),
      `${declared.size} declared, ${expected.length} expected`,
    );
    const mismatched = expected.filter(([k, v]) => declared.get(k) !== v);
    check(
      'dist/tokens.full.css values match the resolved contract',
      mismatched.length === 0,
      mismatched.length ? mismatched.slice(0, 5).map(([k, v]) => `${k}=${declared.get(k)}≠${v}`).join('; ') : '',
    );

    // Agreement with the official css-vars export on every property both define.
    if (files.cssVars) {
      const official = new Map();
      for (const line of files.cssVars.split('\n')) {
        const m = line.match(/^\s*(--[a-z0-9-]+)\s*:\s*(.+?);\s*$/i);
        if (m) official.set(m[1], m[2]);
      }
      const shared = [...official.keys()].filter((k) => declared.has(k));
      const diffs = shared.filter((k) => declared.get(k) !== official.get(k));
      check(
        'derived values agree with the official css-vars export',
        shared.length > 0 && diffs.length === 0,
        `${shared.length} shared properties, ${diffs.length} difference(s)` +
          (diffs.length ? `: ${diffs.slice(0, 5).join(', ')}` : ''),
      );
    }
  }

  if (fullJson) {
    const typoComplete = [...state.typography.keys()].every(
      (name) => fullJson.typography?.[name]?.lineHeight,
    );
    check('every typography role keeps its line-height in the derived json', typoComplete);

    const featured = [...state.typography.keys()].filter(
      (name) => state.typography.get(name).fontFeature,
    );
    check(
      'font-feature settings survive in the derived json',
      featured.length > 0 &&
        featured.every((n) => fullJson.typography[n].fontFeature === state.typography.get(n).fontFeature),
      `${featured.length} role(s) carry a font-feature`,
    );

    check(
      'every component token survives in the derived json',
      Object.keys(fullJson.components ?? {}).length === state.components.size,
      `${Object.keys(fullJson.components ?? {}).length} of ${state.components.size}`,
    );
  }

  // ---------------------------------------------------------------------------
  // 4. the toolchain's known limitations are still true
  // ---------------------------------------------------------------------------

  if (files.cssVars) {
    check(
      'LIMITATION: official css-vars export omits typography and component tokens',
      !/^\s*--typography-/m.test(files.cssVars) && !/^\s*--component-/m.test(files.cssVars),
      'colours, spacing and radii only',
    );
  }

  if (tailwind) {
    const extend = tailwind.theme?.extend ?? {};
    const sizes = Object.values(extend.fontSize ?? {});
    check(
      'official tailwind export carries lineHeight and fontWeight per size',
      sizes.length === state.typography.size &&
        sizes.every((s) => Array.isArray(s) && s[1]?.lineHeight && s[1]?.fontWeight),
      `${sizes.length} fontSize entr(ies)`,
    );
    const serialized = JSON.stringify(extend);
    check(
      'LIMITATION: official tailwind export omits fontFeature and component tokens',
      !serialized.includes('tnum') &&
        !serialized.includes('fontFeature') &&
        extend.components === undefined,
      `${Object.keys(extend).join(', ')} only`,
    );
  }

  if (dtcg) {
    const roles = Object.values(dtcg.typography ?? {});
    check(
      'LIMITATION: official dtcg export omits fontFeature and component tokens',
      dtcg.components === undefined && !JSON.stringify(dtcg).includes('tnum'),
    );
    check(
      'LIMITATION: official dtcg emits lineHeight as a bare number, dropping its unit',
      roles.length === state.typography.size &&
        roles.every((r) => typeof r.$value?.lineHeight === 'number') &&
        roles.every((r) => typeof r.$value?.fontSize === 'object'),
      `${roles.length} entr(ies): fontSize keeps {value,unit}, lineHeight does not`,
    );
  }

  {
    // The pitfall that actually broke this repository once: the resolver accepts a
    // unitless `lineHeight` without complaint and then silently drops it, so the
    // value never reaches any export. Both halves are asserted so that a future
    // upstream fix is noticed rather than depended on.
    const probe = (lineHeight) => `---
version: alpha
name: probe
description: probe
colors:
  primary: "#165DFF"
typography:
  body:
    fontFamily: "Inter"
    fontSize: 14px
    fontWeight: 400
    lineHeight: ${lineHeight}
spacing:
  s: 16px
rounded:
  r: 2px
---
# probe
`;
    const unitless = lint(probe('1.5715'));
    const dimension = lint(probe('22px'));
    check(
      'TOOLCHAIN PITFALL still holds: a unitless lineHeight is silently dropped by the resolver',
      unitless.designSystem.typography.get('body').lineHeight === undefined &&
        unitless.findings.every((f) => f.severity !== 'error'),
      'no error, no warning, value lost — the contract must use a px Dimension',
    );
    check(
      'a px lineHeight survives both resolution and every export',
      dimension.designSystem.typography.get('body').lineHeight?.value === 22,
    );
  }

  // ---------------------------------------------------------------------------
  // 5. contrast audit
  // ---------------------------------------------------------------------------

  /**
   * Every pair quoted in arco-blue/docs/accessibility.md. `min` is the WCAG
   * threshold the pair must meet to be considered compliant for its use.
   * Pairs below their `min` must be listed in WAIVED below, which is the
   * machine-readable form of the "preserved exceptions" section.
   */
  const CONTRAST_PAIRS = [
    { label: 'text-primary on surface', fg: 'text-primary', bg: 'surface', min: 4.5 },
    { label: 'text-primary on canvas', fg: 'text-primary', bg: 'canvas', min: 4.5 },
    { label: 'text-primary on surface-hover', fg: 'text-primary', bg: 'surface-hover', min: 4.5 },
    { label: 'text-primary on surface-pressed', fg: 'text-primary', bg: 'surface-pressed', min: 4.5 },
    { label: 'text-primary on primary-subtle', fg: 'text-primary', bg: 'primary-subtle', min: 4.5 },
    { label: 'text-primary on success-subtle', fg: 'text-primary', bg: 'success-subtle', min: 4.5 },
    { label: 'text-primary on warning-subtle', fg: 'text-primary', bg: 'warning-subtle', min: 4.5 },
    { label: 'text-primary on error-subtle', fg: 'text-primary', bg: 'error-subtle', min: 4.5 },
    { label: 'text-secondary on surface', fg: 'text-secondary', bg: 'surface', min: 4.5 },
    { label: 'text-secondary on canvas', fg: 'text-secondary', bg: 'canvas', min: 4.5 },
    { label: 'text-secondary on surface-pressed', fg: 'text-secondary', bg: 'surface-pressed', min: 4.5 },
    { label: 'text-secondary on primary-subtle', fg: 'text-secondary', bg: 'primary-subtle', min: 4.5 },
    { label: 'text-secondary on border', fg: 'text-secondary', bg: 'border', min: 4.5 },
    { label: 'text-tertiary on surface', fg: 'text-tertiary', bg: 'surface', min: 4.5 },
    { label: 'text-tertiary on canvas', fg: 'text-tertiary', bg: 'canvas', min: 4.5 },
    { label: 'text-tertiary on surface-hover', fg: 'text-tertiary', bg: 'surface-hover', min: 4.5 },
    { label: 'text-disabled on surface', fg: 'text-disabled', bg: 'surface', min: 4.5 },
    { label: 'primary on surface', fg: 'primary', bg: 'surface', min: 4.5 },
    { label: 'primary on canvas', fg: 'primary', bg: 'canvas', min: 4.5 },
    { label: 'primary on primary-subtle', fg: 'primary', bg: 'primary-subtle', min: 4.5 },
    { label: 'white on primary fill', fg: '#ffffff', bg: 'primary', min: 4.5 },
    { label: 'error on surface', fg: 'error', bg: 'surface', min: 4.5 },
    { label: 'white on error fill', fg: '#ffffff', bg: 'error', min: 4.5 },
    { label: 'error on error-subtle', fg: 'error', bg: 'error-subtle', min: 4.5 },
    { label: 'warning on surface', fg: 'warning', bg: 'surface', min: 4.5 },
    { label: 'warning on warning-subtle', fg: 'warning', bg: 'warning-subtle', min: 4.5 },
    { label: 'success on surface', fg: 'success', bg: 'surface', min: 4.5 },
    { label: 'success on success-subtle', fg: 'success', bg: 'success-subtle', min: 4.5 },
    { label: 'white on tooltip fill', fg: '#ffffff', bg: 'tooltip', min: 4.5 },
    { label: 'dark-text on dark-canvas', fg: 'dark-text', bg: 'dark-canvas', min: 4.5 },
    { label: 'dark-text on dark-surface', fg: 'dark-text', bg: 'dark-surface', min: 4.5 },
    { label: 'dark-text on dark-elevated', fg: 'dark-text', bg: 'dark-elevated', min: 4.5 },
    { label: 'dark-text on dark-border', fg: 'dark-text', bg: 'dark-border', min: 4.5 },
    { label: 'dark-text-secondary on dark-canvas', fg: 'dark-text-secondary', bg: 'dark-canvas', min: 4.5 },
    { label: 'dark-text-secondary on dark-surface', fg: 'dark-text-secondary', bg: 'dark-surface', min: 4.5 },
    { label: 'dark-text-secondary on dark-elevated', fg: 'dark-text-secondary', bg: 'dark-elevated', min: 4.5 },
    { label: 'primary on dark-canvas', fg: 'primary', bg: 'dark-canvas', min: 4.5 },
    { label: 'primary on dark-surface', fg: 'primary', bg: 'dark-surface', min: 4.5 },
    { label: 'primary on dark-elevated', fg: 'primary', bg: 'dark-elevated', min: 4.5 },
    { label: 'primary focus ring on surface (non-text)', fg: 'primary', bg: 'surface', min: 3 },
    { label: 'primary on canvas (non-text)', fg: 'primary', bg: 'canvas', min: 3 },
    { label: 'border on surface (structural)', fg: 'border', bg: 'surface', min: 0 },
    { label: 'border-strong on surface (structural)', fg: 'border-strong', bg: 'surface', min: 0 },
    { label: 'surface on canvas (structural)', fg: 'surface', bg: 'canvas', min: 0 },
  ];

  /**
   * The documented "preserved exceptions" from arco-blue/docs/accessibility.md.
   * A pair belongs here only if the documentation names it AND gives a mitigation.
   * Each id is E1..E5 from that document.
   */
  const WAIVED = new Map([
    ['text-tertiary on surface', 'E1'],
    ['text-tertiary on canvas', 'E1'],
    ['text-tertiary on surface-hover', 'E1'],
    ['text-disabled on surface', 'E2'],
    ['error on surface', 'E3'],
    ['white on error fill', 'E3'],
    ['error on error-subtle', 'E3'],
    ['warning on surface', 'E4'],
    ['warning on warning-subtle', 'E4'],
    ['success on surface', 'E4'],
    ['success on success-subtle', 'E4'],
    ['primary on dark-canvas', 'E5'],
    ['primary on dark-surface', 'E5'],
    ['primary on dark-elevated', 'E5'],
  ]);

  const audit = [];
  for (const pair of CONTRAST_PAIRS) {
    const ratio = contrast(resolveColor(pair.fg), resolveColor(pair.bg));
    audit.push({ ...pair, ratio });
  }

  const newFailures = audit.filter(
    (p) => p.ratio < p.min && !WAIVED.has(p.label),
  );
  check(
    'contrast audit finds no undocumented AA failure',
    newFailures.length === 0,
    newFailures.map((p) => `${p.label} ${p.ratio.toFixed(2)}:1 < ${p.min}:1`).join('; '),
  );

  const staleWaivers = [...WAIVED.keys()].filter((label) => {
    const p = audit.find((a) => a.label === label);
    return !p || p.ratio >= p.min;
  });
  check(
    'every documented contrast exception is still an actual failure',
    staleWaivers.length === 0,
    staleWaivers.length
      ? `now passing (update arco-blue/docs/accessibility.md): ${staleWaivers.join(', ')}`
      : '',
  );

  // ---------------------------------------------------------------------------
  // Report
  // ---------------------------------------------------------------------------

  const width = Math.max(...checks.map((c) => c.name.length));
  console.log(`Generated artifacts — package ${pkg}`);
  console.log('------------------');
  for (const [key, p] of Object.entries(ARTIFACTS)) {
    console.log(`  ${rel(p).padEnd(38)} ${files[key]?.length ?? 0} bytes  (${key})`);
  }
  console.log(`  contract sha256${' '.repeat(23)}${sha256}`);
  console.log('');
  console.log(
    `Contract model: ${state.colors.size} colors, ${state.typography.size} typography, ` +
      `${state.spacing.size} spacing, ${state.rounded.size} rounded, ${state.components.size} components`,
  );
  console.log(`Derived custom properties: ${expected.length}`);
  console.log('');
  console.log('Contrast audit (WCAG 2.x relative luminance)');
  console.log('--------------------------------------------');
  for (const p of [...audit].sort((a, b) => a.ratio - b.ratio)) {
    const state_ = p.ratio >= p.min ? 'ok  ' : WAIVED.has(p.label) ? 'waiv' : 'FAIL';
    const waiver = WAIVED.get(p.label) ? `  ${WAIVED.get(p.label)}` : '';
    console.log(`  ${state_}  ${p.ratio.toFixed(2).padStart(6)}:1  (min ${p.min})  ${p.label}${waiver}`);
  }
  console.log('');
  console.log('Checks');
  console.log('------');

  let failed = 0;
  for (const c of checks) {
    if (!c.ok) failed += 1;
    console.log(`${c.ok ? 'PASS' : 'FAIL'}  ${c.name}${c.detail ? `  — ${c.detail}` : ''}`);
  }

  console.log('');
  if (failed > 0) {
    packageFailures += 1;
    console.log(`3:verify-generated FAILED for ${pkg}: ${failed} check(s).`);
  } else {
    console.log(`3:verify-generated OK for ${pkg} (${checks.length} checks).`);
  }
}

if (packageFailures > 0) {
  console.error(
    `\n3:verify-generated FAILED: ${packageFailures} of ${packages.length} package(s) have failing checks.`,
  );
  process.exit(1);
}
console.log(`\n3:verify-generated OK — ${packages.length} package(s) verified.`);
