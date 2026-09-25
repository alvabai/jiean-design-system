/**
 * Shared loader for the arcopro design contract.
 *
 * The contract lives in exactly one file, `arcopro/DESIGN.md`. Everything else
 * in this repository is derived from it. This module is the only place that
 * reads the contract, so every script sees the same resolved model.
 *
 * Resolution is delegated to the official DESIGN.md implementation
 * (`@google/design.md`, the `lint` API), which returns a fully resolved design
 * system model. We deliberately do not re-implement parsing: if the upstream
 * resolver changes, `npm run 1:validate` reports it.
 */

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { lint } from '@google/design.md/linter';

export const REPO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
);

export const CONTRACT_PATH = path.join(REPO_ROOT, 'arcopro', 'DESIGN.md');

/** Paths that are written by `scripts/export-tokens.mjs`. */
export const ARTIFACTS = {
  dtcg: path.join(REPO_ROOT, 'arcopro', 'tokens', 'tokens.json'),
  cssVars: path.join(REPO_ROOT, 'arcopro', 'dist', 'tokens.css'),
  tailwind: path.join(REPO_ROOT, 'arcopro', 'dist', 'tailwind.theme.json'),
  fullCss: path.join(REPO_ROOT, 'arcopro', 'dist', 'tokens.full.css'),
  fullJson: path.join(REPO_ROOT, 'arcopro', 'dist', 'tokens.full.json'),
};

/**
 * Read and resolve the design contract.
 * @returns {Promise<{raw: string, report: import('@google/design.md/linter').LintReport}>}
 */
export async function loadContract() {
  const raw = await readFile(CONTRACT_PATH, 'utf8');
  const report = lint(raw);
  return { raw, report };
}

/** Throw if the contract has lint errors. Warnings are reported, not fatal. */
export function assertNoErrors(report) {
  const errors = report.findings.filter((f) => f.severity === 'error');
  if (errors.length > 0) {
    const detail = errors
      .map((f) => `  - ${f.path ?? '<document>'}: ${f.message}`)
      .join('\n');
    throw new Error(
      `arcopro/DESIGN.md has ${errors.length} lint error(s):\n${detail}`,
    );
  }
}

const round = (n) => Math.round(n * 1000) / 1000;

/**
 * Format a resolved colour the way the official css-vars exporter does:
 * lowercase hex, expanded to 8 digits when the colour carries alpha.
 *
 * `ResolvedColor.r/g/b` are 0-255 and `a` is 0-1; `hex` is already rendered in
 * exactly the target shape, so it is preferred and the channel maths is only a
 * fallback for a model that omits it.
 */
export function formatColor(color) {
  if (typeof color.hex === 'string' && color.hex.length > 0) return color.hex;
  const to2 = (c) =>
    Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, '0');
  const base = `#${to2(color.r)}${to2(color.g)}${to2(color.b)}`;
  if (color.a === undefined || color.a === null || color.a >= 1) return base;
  return `${base}${to2(color.a * 255)}`;
}

/** Format a resolved dimension as a CSS length. */
export function formatDimension(dim) {
  return `${round(dim.value)}${dim.unit}`;
}

/** Format any resolved token value as a CSS-ready string. */
export function formatValue(value, { typographyNames } = {}) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (value.type === 'color') return formatColor(value);
  if (value.type === 'dimension') return formatDimension(value);
  if (value.type === 'typography') {
    const name = typographyNames ? typographyNames.get(typographyKey(value)) : null;
    return name ?? formatTypographyInline(value);
  }
  return null;
}

/** A stable key for a resolved typography value, used to recover its role name. */
export function typographyKey(t) {
  return [t.fontFamily ?? '', t.fontSize ? formatDimension(t.fontSize) : '', t.fontWeight ?? '', t.lineHeight ? formatDimension(t.lineHeight) : '', t.fontFeature ?? ''].join('|');
}

function formatTypographyInline(t) {
  return [
    t.fontWeight ? String(t.fontWeight) : null,
    t.fontSize ? formatDimension(t.fontSize) : null,
    t.lineHeight ? `/ ${formatDimension(t.lineHeight)}` : null,
  ]
    .filter(Boolean)
    .join(' ');
}

/** Build a map from resolved typography shape to its role name. */
export function typographyNameIndex(state) {
  const index = new Map();
  for (const [name, value] of state.typography) index.set(typographyKey(value), name);
  return index;
}

/** kebab-case a camelCase token key for CSS custom property names. */
export function kebab(key) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .toLowerCase();
}

/**
 * Flatten the resolved design system into an ordered list of CSS custom
 * properties. Order follows the contract's own group order so a diff is stable.
 *
 * This is the lossless companion to the official `css-vars` export: the official
 * export carries colours, spacing and radii; it does not carry typography or
 * component tokens (see arcopro/reports/designmd-validation.md).
 */
export function cssCustomProperties(state) {
  const typographyNames = typographyNameIndex(state);
  const out = [];

  for (const [name, color] of state.colors) {
    out.push([`--color-${kebab(name)}`, formatColor(color)]);
  }

  for (const [name, t] of state.typography) {
    const prefix = `--typography-${kebab(name)}`;
    if (t.fontFamily) out.push([`${prefix}-font-family`, t.fontFamily]);
    if (t.fontSize) out.push([`${prefix}-font-size`, formatDimension(t.fontSize)]);
    if (t.fontWeight !== undefined) out.push([`${prefix}-font-weight`, String(t.fontWeight)]);
    if (t.lineHeight) out.push([`${prefix}-line-height`, formatDimension(t.lineHeight)]);
    if (t.letterSpacing) out.push([`${prefix}-letter-spacing`, formatDimension(t.letterSpacing)]);
    if (t.fontFeature) out.push([`${prefix}-font-feature`, t.fontFeature]);
  }

  for (const [name, dim] of state.spacing) {
    out.push([`--spacing-${kebab(name)}`, formatDimension(dim)]);
  }

  for (const [name, dim] of state.rounded) {
    out.push([`--rounded-${kebab(name)}`, formatDimension(dim)]);
  }

  for (const [name, def] of state.components) {
    for (const [prop, value] of def.properties) {
      if (value === null || value === undefined) continue;
      const formatted = formatValue(value, { typographyNames });
      if (formatted !== null) {
        out.push([`--component-${kebab(name)}-${kebab(prop)}`, formatted]);
      }
    }
  }

  return out;
}

/** Serialize the design system into a lossless, human-diffable JSON document. */
export function fullJson(state, { contractPath, contractSha256, generator }) {
  const typographyNames = typographyNameIndex(state);
  const colors = {};
  const typography = {};
  const spacing = {};
  const rounded = {};
  const components = {};

  for (const [name, color] of state.colors) {
    colors[name] = {
      value: formatColor(color),
      rgb: [color.r, color.g, color.b].map(round),
      alpha: color.a ?? 1,
      luminance: round(color.luminance),
    };
  }

  for (const [name, t] of state.typography) {
    typography[name] = {
      fontFamily: t.fontFamily ?? null,
      fontSize: t.fontSize ? formatDimension(t.fontSize) : null,
      fontWeight: t.fontWeight ?? null,
      lineHeight: t.lineHeight ? formatDimension(t.lineHeight) : null,
      letterSpacing: t.letterSpacing ? formatDimension(t.letterSpacing) : null,
      fontFeature: t.fontFeature ?? null,
    };
  }

  for (const [name, dim] of state.spacing) spacing[name] = formatDimension(dim);
  for (const [name, dim] of state.rounded) rounded[name] = formatDimension(dim);

  for (const [name, def] of state.components) {
    const props = {};
    for (const [prop, value] of def.properties) {
      const formatted = formatValue(value, { typographyNames });
      if (formatted === null) continue;
      props[prop] = {
        value: formatted,
        kind: value && typeof value === 'object' ? value.type : typeof value,
      };
    }
    components[name] = {
      properties: props,
      unresolvedRefs: def.unresolvedRefs,
    };
  }

  return {
    $source: {
      contract: contractPath,
      contractSha256,
      generator,
      note:
        'Lossless derivation of arcopro/DESIGN.md. The official design.md exports ' +
        '(tokens/tokens.json, dist/tokens.css, dist/tailwind.theme.json) are the ' +
        'interoperability formats and are stored verbatim. None of them emits the ' +
        'component token table or the fontFeature setting, and the css-vars export ' +
        'omits typography entirely; this file carries the complete contract, plus ' +
        'rgb/alpha/luminance per colour for consumers that need numeric channels.',
    },
    name: state.name ?? null,
    description: state.description ?? null,
    colors,
    typography,
    spacing,
    rounded,
    components,
  };
}
