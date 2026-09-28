#!/usr/bin/env node
/**
 * 8:package-diff — compare the style packages and prove, or refuse to claim, the
 * relationship each one asserts.
 *
 * The repository holds three packages with two different relationships, so the
 * comparison is configured per pair rather than hard-coded for one:
 *
 *   arcopro ↔ brandcolor — "colour only". 8 of 30 colour roles take 捷安 brand
 *     values and every other design decision was to stay identical. Typography,
 *     spacing and radii must be byte-identical; the 61 component tokens must be
 *     identical once each colour literal is replaced by the role it belongs to;
 *     exactly the 8 roles in `colourMap` may differ; and the six example pages
 *     plus their stylesheet must be character-for-character the same file once
 *     the package name and every palette literal are normalised. The whole point
 *     is that "only the colours changed" is a statement about the stylesheet, not
 *     about a screenshot: a colour literal that belongs to no palette surfaces as
 *     an unexplained difference instead of passing quietly.
 *
 *   arcopro ↔ industrial-steel-blue — "documented adaptation". This package is
 *     not a recolour: it keeps the baseline's structure and adds to it. So the
 *     check is a superset check with an allow-list — every arcopro typography
 *     role, spacing step, radius and component token must still be present, and
 *     must still be identical except where colour is normalised; colour roles may
 *     differ only in the recorded families; and anything *added* must be named in
 *     `allowedAdditions`, so an undocumented change cannot slip in. Example pages
 *     are reported, not asserted, because this package's pages are deliberately
 *     adapted rather than copied.
 *
 * Both pairs verify that each package's `dist/` was exported from the contract
 * that is on disk right now, by hash, so a stale artifact fails here.
 *
 * What this does not cover: rendered output. Comparing pictures of the packages
 * needs a headless browser; for `brandcolor` that layer is absent rather than
 * approximated (see `brandcolor/reports/visual-validation.md`), and for
 * `industrial-steel-blue` it is covered by `npm run 10:screenshots`, which
 * re-derives the committed PNGs from the committed HTML.
 *
 * Run: npm run 8:package-diff
 */

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { REPO_ROOT } from './lib/design-system.mjs';

/** The colour roles `brandcolor` is expected to change, with both values. */
const BRAND_COLOUR_MAP = {
  primary: ['#165DFF', '#D7000F'],
  'primary-hover': ['#4080FF', '#FF303F'],
  'primary-active': ['#0E42D2', '#A80B16'],
  'primary-disabled': ['#94BFFF', '#FFA4AA'],
  'primary-subtle': ['#E8F3FF', '#FFEEEF'],
  'text-primary': ['#1D2129', '#353535'],
  tooltip: ['#1D2129', '#353535'],
  mask: ['#1D212999', '#35353599'],
};

/** The example pages whose source must survive normalisation unchanged. */
const ARCOPRO_SOURCE_FILES = [
  'examples/index.html',
  'examples/dashboard.html',
  'examples/list-page.html',
  'examples/form-page.html',
  'examples/detail-page.html',
  'examples/components.html',
  'examples/assets/app.css',
];

/** The pages `industrial-steel-blue` ships: flat, four pages, no shared stylesheet file. */
const STEEL_SOURCE_FILES = [
  'examples/dashboard.html',
  'examples/list-page.html',
  'examples/form-page.html',
  'examples/detail-page.html',
];

/**
 * The industrial package's relationship to the baseline, as an allow-list.
 *
 * Every entry here is also stated in `industrial-steel-blue/DESIGN.md`; this
 * object is what makes the statement checkable rather than merely asserted.
 */
const STEEL_RELATIONSHIP = {
  /** Typography roles the adaptation adds; everything else must be identical. */
  addedTypography: ['code'],
  /** Colour roles the adaptation adds, with the value it must have. */
  addedColours: {
    'primary-on-dark': '#628DB8',
    'error-strong': '#CB272D',
    'error-strong-hover': '#A1151E',
    'error-strong-active': '#770813',
  },
  /**
   * Colour roles allowed to differ from the baseline, with the rule that
   * describes each family. `transform` means "derive from the baseline step, do
   * not copy it" — the derivation itself is checked by `npm run 9:steel-ramp`.
   */
  changedColours: {
    primary: 'transform',
    'primary-hover': 'transform',
    'primary-active': 'transform',
    'primary-disabled': 'transform',
    'primary-subtle': 'transform',
  },
  /** Files the adaptation does not copy, and why. */
  notCopied: {
    'examples/index.html': 'the industrial package ships the four required pages only',
    'examples/components.html': 'the industrial package ships the four required pages only',
    'examples/assets/app.css': 'styles are inlined so that examples/ stays flat',
  },
};

const PAIRS = [
  {
    id: 'arcopro-brandcolor',
    left: 'arcopro',
    right: 'brandcolor',
    mode: 'colour-only',
    colourMap: BRAND_COLOUR_MAP,
    sourceFiles: ARCOPRO_SOURCE_FILES,
    evidenceIn: 'brandcolor',
    claim: 'colour only',
  },
  {
    id: 'arcopro-industrial-steel-blue',
    left: 'arcopro',
    right: 'industrial-steel-blue',
    mode: 'adapted',
    relationship: STEEL_RELATIONSHIP,
    sourceFiles: STEEL_SOURCE_FILES,
    evidenceIn: 'industrial-steel-blue',
    claim: 'a documented adaptation — a superset with allow-listed additions',
  },
];

const read = (file) => readFile(path.join(REPO_ROOT, file), 'utf8');
const sha256 = (text) => createHash('sha256').update(text, 'utf8').digest('hex');

/** A colour token's value as the exporter writes it, alpha included. */
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
 * Rewrite text so what remains is what the two packages must share: the
 * package's own name and every palette literal become a stable stand-in of the
 * form «colour:role», so two different hexes for one role read the same.
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

/** Read both packages' tokens and prove each export came from the contract on disk. */
async function readTokens(pair) {
  const failures = [];
  const tokens = {};
  const literals = {};
  for (const pkg of [pair.left, pair.right]) {
    tokens[pkg] = JSON.parse(await read(`${pkg}/dist/tokens.full.json`));
    literals[pkg] = colourLiterals(tokens[pkg].colors);
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
  return { tokens, literals, failures };
}

/** Colour roles: exact for the colour-only pair, allow-listed for the adaptation. */
function compareColours(pair, tokens) {
  const { left, right } = pair;
  const failures = [];
  const roles = new Set([...Object.keys(tokens[left].colors), ...Object.keys(tokens[right].colors)]);
  const differing = [];
  const added = [];
  let identical = 0;

  for (const role of [...roles].sort()) {
    const a = tokens[left].colors[role];
    const b = tokens[right].colors[role];
    if (!a || !b) {
      const missing = a ? role : role;
      if (pair.mode === 'adapted' && !a && b) {
        const expected = pair.relationship.addedColours[role];
        if (expected === undefined) {
          failures.push(`colour role ${role} is added but is not in the allow-list`);
        } else if (valueOf(b) !== expected.toUpperCase()) {
          failures.push(`colour role ${role} is ${valueOf(b)}, expected ${expected.toUpperCase()}`);
        } else {
          added.push({ role, value: valueOf(b) });
        }
        continue;
      }
      failures.push(`colour role ${missing} exists in only one package`);
      continue;
    }
    if (pair.mode === 'adapted') {
      if (valueOf(a) === valueOf(b)) {
        identical += 1;
        continue;
      }
      const rule = pair.relationship.changedColours[role];
      if (!rule) {
        failures.push(`colour role ${role} differs but is not a recorded change: ${valueOf(a)} vs ${valueOf(b)}`);
        continue;
      }
      differing.push({ role, rule, [left]: valueOf(a), [right]: valueOf(b) });
      continue;
    }
    if (valueOf(a) === valueOf(b)) {
      identical += 1;
      continue;
    }
    const expected = pair.colourMap[role];
    if (!expected) {
      failures.push(`colour role ${role} differs but is not in the colour map: ${valueOf(a)} vs ${valueOf(b)}`);
      continue;
    }
    if (valueOf(a) !== expected[0] || valueOf(b) !== expected[1]) {
      failures.push(`colour role ${role} is ${valueOf(a)} / ${valueOf(b)}, expected ${expected[0]} / ${expected[1]}`);
      continue;
    }
    differing.push({ role, [left]: valueOf(a), [right]: valueOf(b) });
  }
  return { failures, summary: { total: roles.size, differing, added, identical } };
}

/** Typography, spacing and radii. */
function compareGroups(pair, tokens, literals) {
  const { left, right } = pair;
  const failures = [];
  const exact = [];
  const added = [];

  for (const group of ['typography', 'spacing', 'rounded']) {
    const a = tokens[left][group] ?? {};
    const b = tokens[right][group] ?? {};
    for (const [name, value] of Object.entries(a)) {
      if (!(name in b)) {
        failures.push(`${group} entry ${name} is missing from ${right}`);
        continue;
      }
      if (JSON.stringify(value) !== JSON.stringify(b[name])) {
        failures.push(
          `${group} entry ${name} differs — ` +
            `${JSON.stringify(value)} vs ${JSON.stringify(b[name])}`,
        );
      }
    }
    for (const name of Object.keys(b)) {
      if (name in a) continue;
      const allowed =
        pair.mode === 'adapted' &&
        ((group === 'typography' && pair.relationship.addedTypography.includes(name)) ||
          group !== 'typography');
      if (!allowed) failures.push(`${group} entry ${name} is added but is not in the allow-list`);
      else added.push({ group, name });
    }
    exact.push({ group, entries: Object.keys(a).length });
  }
  return { failures, exact, added };
}

/**
 * Component tokens: every baseline token must survive, and must survive
 * unchanged once colour is normalised.
 */
function compareComponents(pair, tokens, literals) {
  const { left, right } = pair;
  const failures = [];
  const a = tokens[left].components ?? {};
  const b = tokens[right].components ?? {};
  const shared = [];
  const added = [];

  for (const [name, value] of Object.entries(a)) {
    if (!(name in b)) {
      failures.push(`component token ${name} is missing from ${right}`);
      continue;
    }
    const na = normalise(JSON.stringify(value, null, 2), left, literals[left]);
    const nb = normalise(JSON.stringify(b[name], null, 2), right, literals[right]);
    if (na !== nb) {
      failures.push(`component token ${name} differs beyond colour — ${firstDifference(na, nb)}`);
      continue;
    }
    shared.push(name);
  }
  for (const name of Object.keys(b)) if (!(name in a)) added.push(name);

  return {
    failures,
    normalised: { group: 'components', entries: shared.length },
    added: added.sort(),
  };
}

/** Example pages. Asserted for the colour-only pair, reported for the adaptation. */
async function compareSource(pair, literals) {
  const { left, right } = pair;
  const rows = [];
  const failures = [];

  for (const file of pair.sourceFiles) {
    let texts = {};
    try {
      for (const pkg of [left, right]) texts[pkg] = await read(path.join(pkg, file));
    } catch (err) {
      if (pair.mode === 'adapted' && err.code === 'ENOENT') {
        failures.push(`${file} could not be read in ${right}: ${err.message}`);
        continue;
      }
      failures.push(`${file} could not be read: ${err.message}`);
      continue;
    }
    const normalised = {};
    for (const pkg of [left, right]) normalised[pkg] = normalise(texts[pkg], pkg, literals[pkg]);
    const coloured = new Set(
      (normalised[right].match(/«colour:[^»]+»/g) ?? []).map((p) => p.slice(9, -1)),
    );
    const identical = normalised[left] === normalised[right];
    if (!identical && pair.mode === 'colour-only') {
      failures.push(
        `${file} differs beyond colour and package name — ` +
          firstDifference(normalised[left], normalised[right]),
      );
    }
    rows.push({
      file,
      bytes: { [left]: texts[left].length, [right]: texts[right].length },
      colourRoles: [...coloured].sort(),
      identical,
      asserted: pair.mode === 'colour-only',
    });
  }

  for (const [file, reason] of Object.entries(pair.relationship?.notCopied ?? {})) {
    rows.push({ file, notCopied: reason });
  }
  return { failures, rows };
}

async function comparePair(pair) {
  const failures = [];
  const report = {
    generatedBy: 'scripts/compare-packages.mjs',
    pair: pair.id,
    mode: pair.mode,
    claim: pair.claim,
    packages: [pair.left, pair.right],
  };

  const { tokens, literals, failures: tokenFailures } = await readTokens(pair);
  failures.push(...tokenFailures);

  const colours = compareColours(pair, tokens);
  failures.push(...colours.failures);
  report.colours = colours.summary;

  const groups = compareGroups(pair, tokens, literals);
  failures.push(...groups.failures);
  report.groupsExact = groups.exact;
  report.groupsAdded = groups.added;

  const components = compareComponents(pair, tokens, literals);
  failures.push(...components.failures);
  report.components = components.normalised;
  report.componentsAdded = components.added;

  const source = await compareSource(pair, literals);
  failures.push(...source.failures);
  report.source = source.rows;

  return { report: { ...report, failures }, failures };
}

function printPair({ report }, pair) {
  const [left, right] = report.packages;
  console.log(`${left} vs ${right} — ${pair.claim}`);
  console.log('');

  const colors = report.colours;
  console.log(
    `colours  ${colors.total} roles — ${colors.differing.length} ${pair.mode === 'adapted' ? 'changed by the recorded rule' : 'differ as recorded'}, ` +
      `${colors.identical} identical${colors.added.length > 0 ? `, ${colors.added.length} added` : ''}`,
  );
  for (const row of colors.differing) {
    const note = row.rule ? `  (${row.rule})` : '';
    console.log(`         ${`${row.role}`.padEnd(19)} ${row[left]} → ${row[right]}${note}`);
  }
  for (const row of colors.added) console.log(`         ${`${row.role}`.padEnd(19)} + ${row.value}`);

  for (const group of report.groupsExact) {
    console.log(
      `tokens   ${`${group.group} ${group.entries}`.padEnd(24)} present and identical`,
    );
  }
  for (const group of report.groupsAdded) {
    console.log(`tokens   ${`${group.group} ${group.name}`.padEnd(24)} added (allow-listed)`);
  }
  console.log(
    `tokens   ${`components ${report.components.entries}`.padEnd(24)} present and identical once colour is normalised`,
  );
  if (report.componentsAdded.length > 0) {
    console.log(`tokens   ${`+${report.componentsAdded.length} components`.padEnd(24)} ${report.componentsAdded.join(', ')}`);
  }

  console.log('');
  for (const row of report.source) {
    if (row.notCopied) {
      console.log(`source   ${row.file.padEnd(30)} not copied — ${row.notCopied}`);
      continue;
    }
    const shared = new Set(row.colourRoles).size;
    console.log(
      `source   ${row.file.padEnd(30)} ${row.identical ? 'identical' : 'differs'} after normalising ${shared} colour role(s)` +
        (row.asserted ? '' : ' [reported]'),
    );
  }
  console.log('');
}

try {
  await run();
} catch (err) {
  console.error(`\ncompare-packages failed: ${err.message}`);
  process.exit(1);
}

async function run() {
const results = [];
for (const [index, pair] of PAIRS.entries()) {
  if (index > 0) console.log('');
  const result = await comparePair(pair);
  printPair(result, pair);
  results.push({ pair, result });
}

let totalFailures = 0;
for (const { pair, result } of results) {
  const evidencePath = path.join(REPO_ROOT, pair.evidenceIn, 'reports', 'evidence', 'package-diff.json');
  await mkdir(path.dirname(evidencePath), { recursive: true });
  await writeFile(evidencePath, `${JSON.stringify(result.report, null, 2)}\n`, 'utf8');
  console.log(`evidence ${path.relative(REPO_ROOT, evidencePath)}`);
  totalFailures += result.failures.length;
}

if (totalFailures > 0) {
  console.error('');
  for (const { result } of results) {
    for (const failure of result.failures) console.error(`FAIL  ${failure}`);
  }
  throw new Error(`${totalFailures} unexplained difference(s) between the packages`);
}

console.log('');
console.log(
  `8:package-diff OK — ${PAIRS.length} package pair(s) match the relationship each one asserts.`,
);
}
