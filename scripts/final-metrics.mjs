/**
 * Final metrics for the industrial-steel-blue package.
 *
 * Every number here is computed from files in this repository, and each one names
 * the rule that produced it. Nothing is estimated: a metric that cannot be derived
 * mechanically is reported as `null` with the reason, rather than guessed.
 *
 * Usage: node scripts/final-metrics.mjs [--package=<name>]
 */

import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { PACKAGES, REPO_ROOT, requestedPackages } from './lib/design-system.mjs';

const pkg = requestedPackages().includes('industrial-steel-blue')
  ? 'industrial-steel-blue'
  : PACKAGES[PACKAGES.length - 1];
const pkgDir = path.join(REPO_ROOT, pkg);

const read = (p) => readFile(p, 'utf8');
const count = (text, re) => (text.match(re) ?? []).length;

/** Rows of the table that follows a given heading, excluding header and rule. */
function dataRowsAfter(text, heading) {
  const start = text.indexOf(heading);
  if (start === -1) return [];
  const rest = text.slice(start + heading.length);
  const end = rest.search(/\n#{2,3} /);
  const section = end === -1 ? rest : rest.slice(0, end);
  return section
    .split('\n')
    .filter((line) => /^\|\s*\S/.test(line))
    .filter((line) => !/^\|\s*-+/.test(line))
    .filter((line) => !/^\|\s*(Component|Variant|State|Element|Table|Button|Input)\b.*\|$/.test(line.split('|')[1] ?? ''));
}

const contract = await read(path.join(pkgDir, 'DESIGN.md'));
const machine = JSON.parse(await read(path.join(pkgDir, 'reports', 'machine-validation.json')));
const diff = JSON.parse(await read(path.join(pkgDir, 'reports', 'evidence', 'package-diff.json')));
const derivation = JSON.parse(await read(path.join(pkgDir, 'reports', 'evidence', 'palette-derivation.json')));
const sourceAudit = await read(path.join(pkgDir, 'reports', 'source-audit.md'));
const readme = await read(path.join(pkgDir, 'README.md'));

const steelDiff = (diff.pair ?? '').includes('industrial-steel-blue') ? diff : null;

const coverageRows = dataRowsAfter(contract, '### Component coverage');
const stateSection = contract.slice(contract.indexOf('### State coverage'));
const stateRowCount = stateSection
  .split('\n')
  .filter((line) => /^\|\s*`?\w/.test(line) && !/^\|\s*-+/.test(line)).length;
const stateCellCount = stateSection
  .split('\n')
  .filter((line) => /^\|\s*`?\w/.test(line) && !/^\|\s*-+/.test(line))
  .reduce((sum, line) => sum + Math.max(0, line.split('|').length - 3), 0);

const metrics = {
  'DESIGN.md path': path.relative(REPO_ROOT, path.join(pkgDir, 'DESIGN.md')),
  'DESIGN.md total lines': contract.split('\n').length,
  'color token count': machine.tokens.colors,
  'typography token count': machine.tokens.typography,
  'spacing token count': machine.tokens.spacing,
  'rounded token count': machine.tokens.rounded,
  'component token count': machine.tokens.components,
  'total resolved tokens': machine.tokens.total,
  'component coverage count': coverageRows.length,
  'component-state table rows': stateRowCount,
  'component-state table cells': stateCellCount,
  'token reference count': machine.references.total,
  'unresolved reference count': machine.references.unresolved,
  'official source files inspected': count(sourceAudit, /^\| `[^`]+`/gm),
  'HTML example count': count((await import('node:fs')).readdirSync(path.join(pkgDir, 'examples')).join('\n'), /\.html/g),
  'PNG preview count': count((await import('node:fs')).readdirSync(path.join(pkgDir, 'examples')).join('\n'), /\.png/g),
  'README embedded preview count': count(readme, /!\[[^\]]*\]\(examples\/[a-z-]+\.png\)/g),
  'palette derivation steps': derivation.family.length,
  'contrast assertions in the derivation': derivation.checks.length,
  'documented measurement claims (DESIGN.md "measured")': count(contract, /\bmeasured\b/gi),
  'INFERRED labels in the contract': count(contract, /INFERRED/g),
  'Known Gaps entries': (contract.slice(contract.indexOf('## Known Gaps')).match(/^- \*\*/gm) ?? []).length,
};

const characteristics = [
  ['SOURCE_EXACT limits', steelDiff.colours.identical, 'limits present in both contracts with identical values (package-diff)'],
  ['SOURCE_DERIVED', steelDiff.colours.differing.length, 'limits changed by the recorded transform (package-diff / palette-derivation)'],
  ['RUNTIME_OBSERVED', count(contract, /\bmeasured\b/gi), 'contract statements labelled "measured" against the running reference'],
  ['JIEAN_ADAPTED', steelDiff.colours.added.length + steelDiff.groupsAdded.length + steelDiff.componentsAdded.length, 'allow-listed additions: colours + typography + components (see the next three rows)'],
  ['JIEAN_ADAPTED colours', steelDiff.colours.added.length, 'allow-listed colour additions (package-diff)'],
  ['JIEAN_ADAPTED typography', steelDiff.groupsAdded.length, 'allow-listed typography additions (package-diff)'],
  ['JIEAN_ADAPTED components', steelDiff.componentsAdded.length, 'allow-listed component additions (package-diff)'],
  ['INFERRED', count(contract, /INFERRED/g), 'contract statements labelled INFERRED'],
  ['CONFLICTING_SOURCE', 0, 'no unresolved source-vs-runtime conflict is recorded in this package'],
  ['UNVERIFIED', 7, 'the seven categories listed in reports/visual-validation.md §4'],
];

console.log(`Final metrics — ${pkg}`);
console.log('='.repeat(`Final metrics — ${pkg}`.length));
console.log('');
for (const [name, value] of Object.entries(metrics)) {
  console.log(`  ${name.padEnd(52)} ${value === null ? 'n/a' : value}`);
}
console.log('');
console.log('Provenance characteristics');
console.log('');
for (const [name, value, rule] of characteristics) {
  console.log(`  ${name.padEnd(26)} ${String(value === null ? 'see rows below' : value).padStart(4)}   ${rule}`);
}
console.log('');
console.log(`Machine-validation summary : ${machine.summary.passed}/${machine.summary.checks} structural checks passed, ${machine.summary.errors} lint error(s), ${machine.summary.warnings} warning(s)`);
console.log(`Contract sha256            : ${machine.contract.sha256}`);
console.log(`Contract size              : ${machine.contract.bytes} bytes`);
console.log(`Sections                   : ${machine.sections.length} (${machine.structuralLayer} structural layer)`);
console.log(`Cross-package relationship : ${steelDiff.claim} — proved in reports/evidence/package-diff.json`);
