#!/usr/bin/env node
/**
 * 1:validate — validate every package's DESIGN.md.
 *
 * Two layers of validation, on purpose:
 *
 *   1. the official DESIGN.md implementation (`@google/design.md`'s `lint`), so a
 *      change in upstream behaviour shows up here rather than as a silent
 *      difference in `dist/`;
 *   2. the JIEAN structural checks in `scripts/lib/machine-validation.mjs`, which
 *      answer the questions the format cannot: required sections and their order,
 *      reference resolution, component and state coverage, typography and colour
 *      coverage, foreign-design-system contamination, legacy naming.
 *
 * Layer 2 writes `<package>/reports/machine-validation.json`, so a reviewer or an
 * agent can read the verdict without running anything. `npm run check` stops on
 * any lint error or any failed structural check.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { REPO_ROOT, loadContract, requestedPackages } from './lib/design-system.mjs';
import { machineValidate, STRUCTURAL_PACKAGES } from './lib/machine-validation.mjs';

const verbose = process.argv.includes('--verbose');
const packages = requestedPackages();

const severityOrder = { error: 0, warning: 1, info: 2 };
const label = { error: 'ERROR  ', warning: 'WARNING', info: 'INFO   ' };

function rel(p) {
  if (!p) return '<document>';
  return path.isAbsolute(p) ? path.relative(REPO_ROOT, p) : p;
}

const validateOne = async (pkg) => {
  const { raw, report, paths } = await loadContract(pkg);
  const findings = [...report.findings].sort(
    (a, b) => (severityOrder[a.severity] ?? 9) - (severityOrder[b.severity] ?? 9),
  );

  console.log(`Contract: ${rel(paths.contract)}`);
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

  const shown = findings.filter((f) => verbose || f.severity !== 'info');
  if (shown.length === 0) {
    console.log('Lint:     no findings at the shown severity level.');
  } else {
    for (const f of shown) {
      console.log(`${label[f.severity] ?? f.severity}  ${rel(f.path)}  ${f.message}`);
    }
  }

  const errors = findings.filter((f) => f.severity === 'error').length;

  // Layer 2 — the structural checks, and the machine-readable report.
  const { json, failures } = await machineValidate(pkg, { raw, report, paths });
  console.log('');
  for (const check of json.checks) {
    const mark = check.status === 'pass' ? 'ok  ' : check.status === 'waived' ? 'skip' : 'FAIL';
    console.log(`  ${mark}  ${check.name.padEnd(24)} ${check.detail}`);
  }
  console.log(
    `Structural: ${json.summary.passed}/${json.summary.checks} check(s) passed` +
      (json.summary.waived > 0 ? `, ${json.summary.waived} waived` : '') +
      (failures.length > 0 ? `, failed: ${failures.join(', ')}` : ''),
  );

  if (STRUCTURAL_PACKAGES.has(pkg)) {
    const reportDir = path.join(paths.dir, 'reports');
    await mkdir(reportDir, { recursive: true });
    const target = path.join(reportDir, 'machine-validation.json');
    await writeFile(target, `${JSON.stringify(json, null, 2)}\n`, 'utf8');
    console.log(`Wrote:    ${rel(target)}`);
  } else {
    console.log(
      'Wrote:    (nothing — the structural layer is waived for this package, so no report is written beside it)',
    );
  }

  const warnings = findings.filter((f) => f.severity === 'warning').length;
  const infos = findings.filter((f) => f.severity === 'info').length;
  console.log('');
  console.log(`Summary: ${errors} error(s), ${warnings} warning(s), ${infos} info.`);
  if (!verbose && infos > 0) {
    console.log('Re-run with --verbose to list info findings.');
  }
  return { pkg, errors, failures };
};

const results = [];
for (const [i, pkg] of packages.entries()) {
  if (i > 0) console.log('');
  results.push(await validateOne(pkg));
}

const failed = results.filter((r) => r.errors > 0 || r.failures.length > 0);
if (failed.length > 0) {
  console.error('');
  for (const r of failed) {
    const parts = [];
    if (r.errors > 0) parts.push(`${r.errors} lint error(s)`);
    if (r.failures.length > 0) parts.push(`failed checks: ${r.failures.join(', ')}`);
    console.error(`1:validate FAILED: ${r.pkg} — ${parts.join('; ')}`);
  }
  process.exit(1);
}

console.log(
  `\n1:validate OK — ${packages.length} contract(s): lint clean, all structural checks passed.`,
);
