#!/usr/bin/env node
/**
 * Compare the two style packages in this repository and prove — or refuse to
 * claim — that they differ in nothing but colour.
 *
 * `brandcolor` is `arcopro` with the colour layer replaced: 8 of 30 colour roles
 * take 捷安 brand values, and every other design decision was to stay identical.
 * That claim is checkable without a browser, so this script checks it in two
 * layers and fails the moment an unexplained difference appears.
 *
 *   tokens  — `dist/tokens.full.json` of both packages. Typography, spacing and
 *             radii must be byte-identical; the 61 component tokens must be
 *             identical once every colour literal is replaced by the role it
 *             belongs to; and of the 30 colour roles, exactly the 8 in COLOUR_MAP
 *             may differ, each in the recorded direction. Each file is also
 *             checked against the contract it names, by hash.
 *
 *   source  — the six example pages and their stylesheet. The package's own name
 *             and every colour literal are normalised to their role, after which
 *             the two packages must be character-for-character the same file.
 *             This is what makes "only the colours changed" a statement about the
 *             stylesheet rather than about a screenshot: no rule, no length, no
 *             spacing, no font and no selector may differ, and a colour literal
 *             that belongs to no palette shows up as an unexplained difference
 *             instead of passing quietly.
 *
 * What this does not cover: rendered output. Comparing pictures of the two
 * packages needs a headless browser that can be given a stable viewport, which
 * this machine could not provide; the render layer is genuinely absent rather
 * than approximated — see `brandcolor/reports/visual-validation.md`.
 *
 * Usage: node scripts/compare-packages.mjs
 */

import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

import { REPO_ROOT, PACKAGES } from './lib/design-system.mjs';

/**
 * The colour roles that are expected to differ, with both values.
 *
 * The other 22 roles must match exactly. `primary` and the three brand-grey
 * roles are literals from the brand guide; the four derived steps keep the WCAG
 * relative luminance of their `arcopro` counterpart, which `npm run 7:brand-ramp`
 * asserts on its own.
 */
const COLOUR_MAP = {
  primary: ['#165DFF', '#D7000F'],
  'primary-hover': ['#4080FF', '#FF303F'],
  'primary-active': ['#0E42D2', '#A80B16'],
  'primary-disabled': ['#94BFFF', '#FFA4AA'],
  'primary-subtle': ['#E8F3FF', '#FFEEEF'],
  'text-primary': ['#1D2129', '#353535'],
  tooltip: ['#1D2129', '#353535'],
  mask: ['#1D212999', '#35353599'],
};

/** Token groups that must match without any normalisation at all. */
const GROUPS_EXACT = ['typography', 'spacing', 'rounded'];

/** Token groups that carry colour and must match once colour is normalised. */
const GROUPS_NORMALISED = ['components'];

/** The example pages whose source must survive normalisation unchanged. */
const SOURCE_FILES = [
  'examples/index.html',
  'examples/dashboard.html',
  'examples/list-page.html',
  'examples/form-page.html',
  'examples/detail-page.html',
  'examples/components.html',
  'examples/assets/app.css',
];

const read = (file) => readFile(path.join(REPO_ROOT, file), 'utf8');
const sha256 = (text) => createHash('sha256').update(text, 'utf8').digest('hex');

/**
 * A colour token's value as written by the exporter: the hex of the colour, with
 * its alpha as a trailing hex byte when it is translucent (`mask`), so the
 * comparison sees the whole value rather than a truncated prefix.
 */
const valueOf = (token) => String(token?.value ?? '').toUpperCase();

/**
 * Every spelling a palette can take in text: the hex as written, its 6-digit
 * form, and the rgb()/rgba() spellings a stylesheet would use. Longest first, so
 * that `#35353599` is replaced before `#353535` can match inside it.
 */
function colourLiterals(palette) {
  const forms = new Map();
  const add = (text, role) => {
    if (typeof text !== 'string' || text.length === 0) return;
    const key = text.toLowerCase();
    if (!forms.has(key)) forms.set(key, role);
  };
  for (const [role, token] of Object.entries(palette)) {
    add(token.value, role);
    if (typeof token.value === 'string' && token.value.length > 7) add(token.value.slice(0, 7), role);
    if (Array.isArray(token.rgb)) {
      const [r, g, b] = token.rgb;
      add(`rgb(${r}, ${g}, ${b})`, role);
      if (typeof token.alpha === 'number' && token.alpha < 1) {
        add(`rgba(${r}, ${g}, ${b}, ${token.alpha})`, role);
        add(`rgba(${r}, ${g}, ${b},${token.alpha})`, role);
      }
    }
  }
  return [...forms.entries()].sort((a, b) => b[0].length - a[0].length);
}

/**
 * Rewrite text so that what remains is what the two packages must share: the
 * package's own name and every palette literal become a stable stand-in of the
 * form «colour:role», so that two different hexes for the same role read the same.
 */
function normalise(text, pkg, literals) {
  let out = text.split(pkg).join('«package»');
  for (const [literal, role] of literals) {
    out = out.split(literal).join(`«colour:${role}»`);
    out = out.split(literal.toUpperCase()).join(`«colour:${role}»`);
  }
  return out;
}

/** Where two strings first disagree, with a little context. */
function firstDifference(a, b) {
  const limit = Math.min(a.length, b.length);
  for (let i = 0; i < limit; i += 1) {
    if (a[i] !== b[i]) {
      const from = Math.max(0, i - 40);
      return (
        `offset ${i}: ${JSON.stringify(a.slice(from, i + 40))} vs ` +
        `${JSON.stringify(b.slice(from, i + 40))}`
      );
    }
  }
  return `one text is ${a.length} characters, the other ${b.length}`;
}

async function main() {
  const [left, right] = PACKAGES;
  const failures = [];
  const report = { generatedBy: 'scripts/compare-packages.mjs', packages: PACKAGES };

  // --- tokens ---------------------------------------------------------------
  const tokens = {};
  for (const pkg of PACKAGES) {
    tokens[pkg] = JSON.parse(await read(`${pkg}/dist/tokens.full.json`));
    const contract = await read(`${pkg}/DESIGN.md`);
    const named = tokens[pkg].$source?.contractSha256;
    if (named !== sha256(contract)) {
      failures.push(
        `${pkg}/dist/tokens.full.json was exported from a different contract than the ` +
          `${pkg}/DESIGN.md on disk (${String(named).slice(0, 12)}… vs ${sha256(contract).slice(0, 12)}…)`,
      );
    }
    if (tokens[pkg].$source?.contract !== `${pkg}/DESIGN.md`) {
      failures.push(`${pkg}/dist/tokens.full.json names ${tokens[pkg].$source?.contract} as its contract`);
    }
  }

  const roles = new Set([...Object.keys(tokens[left].colors), ...Object.keys(tokens[right].colors)]);
  const differing = [];
  let identicalColours = 0;
  for (const role of [...roles].sort()) {
    const a = tokens[left].colors[role];
    const b = tokens[right].colors[role];
    if (!a || !b) {
      failures.push(`colour role ${role} exists in only one package`);
      continue;
    }
    const expected = COLOUR_MAP[role];
    if (!expected) {
      if (JSON.stringify(a) !== JSON.stringify(b)) {
        failures.push(
          `colour role ${role} differs but is not in COLOUR_MAP: ` +
            `${valueOf(a)} vs ${valueOf(b)}`,
        );
      } else {
        identicalColours += 1;
      }
      continue;
    }
    if (valueOf(a) !== expected[0] || valueOf(b) !== expected[1]) {
      failures.push(
        `colour role ${role} is ${valueOf(a)} / ${valueOf(b)}, ` +
          `expected ${expected[0]} / ${expected[1]}`,
      );
      continue;
    }
    differing.push({ role, [left]: valueOf(a), [right]: valueOf(b), token: b.value });
  }
  report.colours = { total: roles.size, differing, identical: identicalColours };

  const literals = {};
  for (const pkg of PACKAGES) literals[pkg] = colourLiterals(tokens[pkg].colors);

  report.groupsExact = [];
  for (const group of GROUPS_EXACT) {
    const a = JSON.stringify(tokens[left][group], null, 2);
    const b = JSON.stringify(tokens[right][group], null, 2);
    if (a !== b) {
      failures.push(`${group} tokens differ — ${firstDifference(a, b)}`);
      continue;
    }
    report.groupsExact.push({ group, entries: Object.keys(tokens[left][group] ?? {}).length });
  }

  report.groupsNormalised = [];
  for (const group of GROUPS_NORMALISED) {
    const a = normalise(JSON.stringify(tokens[left][group], null, 2), left, literals[left]);
    const b = normalise(JSON.stringify(tokens[right][group], null, 2), right, literals[right]);
    const coloured = new Set((b.match(/«colour:[^»]+»/g) ?? []).map((p) => p.slice(9, -1)));
    if (a !== b) {
      failures.push(`${group} tokens differ beyond colour — ${firstDifference(a, b)}`);
      continue;
    }
    report.groupsNormalised.push({
      group,
      entries: Object.keys(tokens[left][group] ?? {}).length,
      colourRoles: [...coloured].sort(),
    });
  }

  // --- source ---------------------------------------------------------------
  report.source = [];
  for (const file of SOURCE_FILES) {
    const texts = {};
    for (const pkg of PACKAGES) texts[pkg] = await read(path.join(pkg, file));
    const normalised = {};
    for (const pkg of PACKAGES) normalised[pkg] = normalise(texts[pkg], pkg, literals[pkg]);
    const coloured = new Set((normalised[right].match(/«colour:[^»]+»/g) ?? []).map((p) => p.slice(9, -1)));
    const identical = normalised[left] === normalised[right];
    if (!identical) {
      failures.push(`${file} differs beyond colour and package name — ${firstDifference(normalised[left], normalised[right])}`);
    }
    report.source.push({
      file,
      bytes: { [left]: texts[left].length, [right]: texts[right].length },
      colourRoles: [...coloured].sort(),
      identical,
    });
  }

  // --- output ---------------------------------------------------------------
  console.log(`${left} vs ${right}`);
  console.log('');
  console.log(
    `tokens   colours ${report.colours.total} roles — ${differing.length} differ as recorded, ` +
      `${identicalColours} identical`,
  );
  for (const row of differing) {
    console.log(`           ${`${row.role}`.padEnd(17)} ${row[left]} → ${row[right]}`);
  }
  for (const group of report.groupsExact) {
    console.log(`tokens   ${`${group.group} ${group.entries}`.padEnd(26)} identical`);
  }
  for (const group of report.groupsNormalised) {
    console.log(
      `tokens   ${`${group.group} ${group.entries}`.padEnd(26)} identical once colour is ` +
        `normalised (${group.colourRoles.length} roles appear in it)`,
    );
  }
  console.log('');
  const rolesInSource = new Set(report.source.flatMap((s) => s.colourRoles));
  console.log(
    `source   ${report.source.length} files identical after normalising the package name and ` +
      `${rolesInSource.size} colour roles`,
  );
  for (const entry of report.source) {
    console.log(`           ${entry.file.padEnd(30)} ${entry.identical ? 'identical' : 'DIFFERS'}`);
  }

  const evidencePath = path.join(REPO_ROOT, right, 'reports', 'evidence', 'package-diff.json');
  await mkdir(path.dirname(evidencePath), { recursive: true });
  await writeFile(
    evidencePath,
    `${JSON.stringify({ ...report, failures }, null, 2)}\n`,
    'utf8',
  );
  console.log(`evidence ${path.relative(REPO_ROOT, evidencePath)}`);

  if (failures.length > 0) {
    console.error('');
    for (const failure of failures) console.error(`FAIL  ${failure}`);
    throw new Error(`${failures.length} unexplained difference(s): the packages differ in more than colour`);
  }
  console.log('');
  console.log(`8:package-diff OK — ${left} and ${right} differ in colour only.`);
}

main().catch((err) => {
  console.error(`\ncompare-packages failed: ${err.message}`);
  process.exit(1);
});
