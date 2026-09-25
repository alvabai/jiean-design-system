#!/usr/bin/env node
/**
 * 1:validate — lint arcopro/DESIGN.md with the official DESIGN.md implementation.
 *
 * The contract is the single source of truth for this repository, so this script
 * gates everything else: `npm run check` runs it first and stops on any lint
 * error. Warnings are printed and do not fail the run; findings of `info`
 * severity are printed only in verbose mode.
 *
 * This performs no derivation of its own. It reports what the official linter
 * reports, so that a change in upstream behaviour shows up here rather than as a
 * silent difference in `dist/`.
 */

import path from 'node:path';

import { CONTRACT_PATH, REPO_ROOT, loadContract } from './lib/design-system.mjs';

const verbose = process.argv.includes('--verbose');

const severityOrder = { error: 0, warning: 1, info: 2 };
const label = { error: 'ERROR  ', warning: 'WARNING', info: 'INFO   ' };

function rel(p) {
  if (!p) return '<document>';
  return path.isAbsolute(p) ? path.relative(REPO_ROOT, p) : p;
}

const { raw, report } = await loadContract();
const findings = [...report.findings].sort(
  (a, b) => (severityOrder[a.severity] ?? 9) - (severityOrder[b.severity] ?? 9),
);

const shown = findings.filter((f) => verbose || f.severity !== 'info');

console.log(`Contract: ${rel(CONTRACT_PATH)}`);
console.log(`Bytes:    ${Buffer.byteLength(raw, 'utf8')}`);

const counts = {
  colors: report.designSystem.colors.size,
  typography: report.designSystem.typography.size,
  spacing: report.designSystem.spacing.size,
  rounded: report.designSystem.rounded.size,
  components: report.designSystem.components.size,
};
console.log(
  `Tokens:   ${counts.colors} colors, ${counts.typography} typography, ` +
    `${counts.spacing} spacing, ${counts.rounded} rounded, ${counts.components} components`,
);

const sections = report.documentSections.map((s) => s.title ?? s.heading ?? s.name);
console.log(`Sections: ${sections.length} (${sections.join(', ')})`);
console.log('');

if (shown.length === 0) {
  console.log('Lint: no findings at the shown severity level.');
} else {
  for (const f of shown) {
    console.log(`${label[f.severity] ?? f.severity}  ${rel(f.path)}  ${f.message}`);
  }
}

const errors = findings.filter((f) => f.severity === 'error').length;
const warnings = findings.filter((f) => f.severity === 'warning').length;
const infos = findings.filter((f) => f.severity === 'info').length;

console.log('');
console.log(`Summary: ${errors} error(s), ${warnings} warning(s), ${infos} info.`);
if (!verbose && infos > 0) {
  console.log('Re-run with --verbose to list info findings.');
}

if (errors > 0) {
  console.error(`\n1:validate FAILED: ${errors} lint error(s) in ${rel(CONTRACT_PATH)}.`);
  process.exit(1);
}

console.log('1:validate OK.');
