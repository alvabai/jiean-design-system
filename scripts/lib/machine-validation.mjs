/**
 * The JIEAN structural checks behind `npm run 1:validate`.
 *
 * The official DESIGN.md implementation answers "is this a valid contract?". These
 * checks answer the questions a design system still has to answer after that:
 *
 *   - does the contract carry every required section, in the required order?
 *   - does every token reference resolve?
 *   - are the mandatory component categories, component states and typography roles
 *     actually covered, and does the coverage table name things that exist?
 *   - has another design system's vocabulary leaked in as if it were ours?
 *   - does any legacy name survive?
 *
 * Every check is deterministic and reads only the contract and the files shipped
 * beside it. The result is written to `<package>/reports/machine-validation.json`
 * so a reviewer, or an agent, can read the verdict without running anything.
 */

import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

/** Top-level keys a contract must declare (`version`, `name`, ... ). */
export const REQUIRED_KEYS = [
  'version',
  'name',
  'description',
  'colors',
  'typography',
  'spacing',
  'rounded',
  'components',
];

/** The canonical section order, before any extension sections. */
export const CANONICAL_SECTIONS = [
  'Overview',
  'Colors',
  'Typography',
  'Layout',
  'Elevation & Depth',
  'Shapes',
  'Components',
  "Do's and Don'ts",
];

/** The JIEAN extension sections and the order they must follow. */
export const EXTENSION_SECTIONS = [
  'Motion',
  'Responsive Behavior',
  'Iteration Guide',
  'Known Gaps',
  'Reference Sources',
];

/**
 * Packages that must carry the extension sections.
 *
 * All three packages carry them. The extension set was introduced with
 * `industrial-steel-blue`; `arco-blue` and `jiean-red` were brought up to the same
 * standard afterwards, so the set is now every package in the repository.
 */
export const EXTENDED_PACKAGES = new Set(['arco-blue', 'jiean-red', 'industrial-steel-blue']);

/**
 * Packages the structural layer is enforced on.
 *
 * Every package. The layer was introduced with `industrial-steel-blue`, and
 * `arco-blue` and `jiean-red` were upgraded to it afterwards; no package is
 * grandfathered any more, so nothing is reported as waived.
 */
export const STRUCTURAL_PACKAGES = new Set(['arco-blue', 'jiean-red', 'industrial-steel-blue']);

/** Mandatory component categories. Every entry must appear in the coverage table. */
export const MANDATORY_COMPONENTS = {
  Actions: ['Button', 'Link', 'Dropdown action'],
  Inputs: [
    'Input',
    'Textarea',
    'Select',
    'Cascader',
    'Date picker',
    'Time picker',
    'Checkbox',
    'Radio',
    'Switch',
    'Form',
  ],
  'Data display': [
    'Tag',
    'Card',
    'Table',
    'List',
    'Badge',
    'Statistic',
    'Descriptions',
  ],
  Navigation: [
    'Tabs',
    'Pagination',
    'Menu',
    'Sidebar',
    'Breadcrumb',
    'Page header',
    'Steps',
  ],
  Feedback: [
    'Message',
    'Notification',
    'Alert',
    'Tooltip',
    'Popover',
    'Modal',
    'Drawer',
    'Progress',
    'Spin',
    'Skeleton',
    'Empty',
  ],
};

/**
 * Required state coverage. `token` names the contract token that must exist for
 * that state; `null` means the state is carried by a documented rule and the
 * state table must say so.
 */
export const REQUIRED_STATES = {
  Button: {
    layout: 'variants',
    variants: ['Primary', 'Secondary', 'Outline', 'Text', 'Danger'],
    states: ['Default', 'Hover', 'Active', 'Disabled', 'Focus', 'Loading'],
    tokens: {
      Primary: {
        Default: 'button-primary',
        Hover: 'button-primary-hover',
        Active: 'button-primary-active',
        Disabled: 'button-primary-disabled',
        Focus: null,
        Loading: null,
      },
      Secondary: {
        Default: 'button-secondary',
        Hover: 'button-secondary-hover',
        Active: null,
        Disabled: null,
        Focus: null,
        Loading: null,
      },
      Outline: {
        Default: 'button-outline',
        Hover: null,
        Active: null,
        Disabled: null,
        Focus: null,
        Loading: null,
      },
      Text: {
        Default: 'button-text',
        Hover: null,
        Active: null,
        Disabled: null,
        Focus: null,
        Loading: null,
      },
      Danger: {
        Default: 'button-danger',
        Hover: 'button-danger-hover',
        Active: 'button-danger-active',
        Disabled: null,
        Focus: null,
        Loading: null,
      },
    },
  },
  Input: {
    layout: 'states',
    states: ['Default', 'Hover', 'Focus', 'Error', 'Disabled', 'Read-only'],
    tokens: {
      Default: 'input',
      Hover: 'input-hover',
      Focus: 'input-focus',
      Error: 'input-error',
      Disabled: 'input-disabled',
      'Read-only': 'input-readonly',
    },
  },
  Table: {
    layout: 'states',
    states: [
      'Header',
      'Body',
      'Hover',
      'Selected',
      'Expanded',
      'Summary',
      'Empty',
      'Loading',
    ],
    tokens: {
      Header: 'table-header',
      Body: 'table-cell',
      Hover: 'table-row-hover',
      Selected: 'table-row-selected',
      Expanded: null,
      Summary: null,
      Empty: 'table-empty',
      Loading: 'table-loading',
    },
  },
};

/** Typography roles an enterprise contract must define. */
export const REQUIRED_TYPOGRAPHY = [
  'page-title',
  'section-title',
  'card-title',
  'body',
  'secondary-body',
  'label',
  'caption',
  'table',
  'button',
  'statistic',
  'code',
];

/** Colour roles an enterprise contract must define, by job. */
export const REQUIRED_COLORS = [
  'primary',
  'primary-hover',
  'primary-active',
  'primary-disabled',
  'primary-subtle',
  'primary-on-dark',
  'canvas',
  'surface',
  'surface-hover',
  'surface-pressed',
  'text-primary',
  'text-secondary',
  'text-tertiary',
  'text-disabled',
  'border',
  'border-subtle',
  'border-strong',
  'success',
  'success-subtle',
  'warning',
  'warning-subtle',
  'error',
  'error-subtle',
  'mask',
  'tooltip',
  'dark-canvas',
  'dark-surface',
  'dark-elevated',
  'dark-text',
  'dark-text-secondary',
  'dark-border',
];

/** Product names that must not appear as if this package were built on them. */
export const FOREIGN_TERMS = [
  'Ant Design',
  'AntD',
  'Material Design',
  'Material UI',
  'MUI',
  'Tailwind',
  'Bootstrap',
  'Element Plus',
  'Element UI',
  'Chakra',
  'Fluent',
  'Carbon Design',
  'Vuetify',
  'Semi Design',
  'TDesign',
  'Naive UI',
  'Atlassian',
  'Polaris',
  'Primer',
  'Radix',
  'shadcn',
  'Bulma',
];

/**
 * A foreign name is allowed when it is being cited rather than adopted: as a
 * comparison, as an attribution, or as an interop format name. The reviewer sees
 * the marker that allowed it, so a false negative is auditable.
 */
export const ALLOWED_CONTEXT = [
  'attribution',
  'baseline',
  'source',
  'reference',
  'research',
  'compared',
  'comparison',
  'unlike',
  'rather than',
  'instead of',
  'not an official',
  'tailwind theme',
  'tailwind.theme.json',
  'export format',
];

/**
 * Checks that were waived for the packages written before this layer existed.
 *
 * The set is empty: `arco-blue` and `jiean-red` were upgraded to the structural
 * layer, so every check now runs on every package. The constant is kept so the
 * history stays legible, and so that re-using this list is a deliberate act rather
 * than an oversight.
 */
export const WAIVED_FOR_EARLIER_PACKAGES = new Set([]);

/** Names this package must not use for itself. */
export const LEGACY_TERMS = [
  'JAT Design System',
  'JAT Design',
  'JAT UI',
  'jat-design',
  'arcopro-design',
  'arcopro',
  'brandcolor',
];

const OK = (detail, extra = {}) => ({ status: 'pass', detail, ...extra });
const BAD = (detail, extra = {}) => ({ status: 'fail', detail, ...extra });

/** Split a contract into front matter, body and the "# Title" line. */
export function splitContract(raw) {
  const start = raw.indexOf('---');
  const end = raw.indexOf('\n---', start + 3);
  const frontmatter = start === 0 && end > 0 ? raw.slice(start + 3, end) : null;
  const body = end > 0 ? raw.slice(end + 4) : raw;
  return { frontmatter, body };
}

/** Top-level YAML keys, read as "column 0 and a colon". */
export function topLevelKeys(frontmatter) {
  const keys = [];
  for (const line of frontmatter.split('\n')) {
    const m = /^([A-Za-z][A-Za-z0-9_-]*):/.exec(line);
    if (m) keys.push(m[1]);
  }
  return keys;
}

/** Every `{group.name}` or `{group.name.property}` reference in a contract. */
export function tokenReferences(frontmatter) {
  const refs = [];
  const re = /\{([a-z][a-z0-9-]*(?:\.[A-Za-z0-9-]+){1,2})\}/g;
  for (const m of frontmatter.matchAll(re)) refs.push(m[1]);
  return refs;
}

/** Does a dotted reference resolve inside the resolved design system? */
export function resolvesReference(ref, system) {
  const [group, name, property] = ref.split('.');
  const table = system[group];
  if (!table || typeof table.get !== 'function') return false;
  const entry = table.get(name);
  if (!entry) return false;
  if (property === undefined) return true;
  // A component sub-token, or a nested group such as `colors.primary.hex`.
  if (typeof entry.get === 'function') return entry.has(property);
  return Object.prototype.hasOwnProperty.call(entry, property);
}

/**
 * Resolve a name as it is written inside a markdown table cell.
 *
 * Table cells are prose, so a few forms are legitimate and are not token
 * references at all: a suffix such as `-hover` inside a parenthesised list, a
 * family such as `alert-*`, a `docs/...` path, or a sentence. A bare name is
 * searched across every token group; a dotted name must resolve exactly.
 */
export function resolvesName(name, system) {
  if (!name || name.includes(' ')) return true;
  if (/^[-+]/.test(name)) return true;
  if (name.startsWith('docs/') || name.startsWith('http')) return true;
  if (name.endsWith('*')) {
    const stem = name.slice(0, -1);
    return Object.values(system).some(
      (table) =>
        table && typeof table.keys === 'function' && [...table.keys()].some((k) => k.startsWith(stem)),
    );
  }
  if (resolvesReference(name, system)) return true;
  if (!name.includes('.')) {
    return Object.values(system).some(
      (table) => table && typeof table.has === 'function' && table.has(name),
    );
  }
  return false;
}

const SECTION_RE = /^##\s+(.+?)\s*$/gm;

/** The "## " sections of a contract, in document order. */
export function sectionsOf(body) {
  const out = [];
  for (const m of body.matchAll(SECTION_RE)) out.push(m[1]);
  return out;
}

/** The rows of the first markdown table after a given "### " heading. */
export function tableRowsAfter(body, heading) {
  const start = body.indexOf(`### ${heading}`);
  if (start < 0) return { found: false, rows: [] };
  const rest = body.slice(start);
  const rows = [];
  for (const line of rest.split('\n').slice(1)) {
    if (/^#{2,3} /.test(line)) break;
    const cells = line.split('|');
    if (cells.length < 3) continue;
    const clean = cells.slice(1, -1).map((c) => c.trim());
    if (clean.every((c) => /^-{2,}$/.test(c) || c === '')) continue;
    rows.push(clean);
  }
  return { found: true, rows };
}

/** Every backticked name in a string. */
export function backticked(text) {
  return [...text.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
}

/** Read every file the contamination and legacy scans must cover. */
export async function packageFiles(paths) {
  const files = [paths.contract];
  const docs = path.join(paths.dir, 'docs');
  const examples = path.join(paths.dir, 'examples');
  const add = async (dir, filter) => {
    let entries = [];
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) await add(full, filter);
      else if (filter(entry.name)) files.push(full);
    }
  };
  await add(docs, (n) => n.endsWith('.md'));
  await add(examples, (n) => /\.(html|css|md)$/.test(n));
  return files;
}

/**
 * Run every structural check for one package.
 *
 * @param {string} pkg package directory name
 * @param {{raw: string, report: object, paths: object}} ctx resolved contract
 * @returns {Promise<{json: object, failures: string[]}>}
 */
export async function machineValidate(pkg, { raw, report, paths }) {
  const system = report.designSystem;
  const { frontmatter, body } = splitContract(raw);
  const sections = sectionsOf(body);
  const checks = [];
  const push = (name, result) => checks.push({ name, ...result });

  // 1. Front matter parses, and the official implementation accepted it.
  const lintErrors = report.findings.filter((f) => f.severity === 'error');
  push(
    'yaml-frontmatter',
    frontmatter && lintErrors.length === 0
      ? OK('front matter is delimited by --- and parses with the official parser', {
          bytes: Buffer.byteLength(frontmatter, 'utf8'),
        })
      : BAD(
          frontmatter
            ? `${lintErrors.length} lint error(s) mean the front matter does not parse cleanly`
            : 'no --- delimited front matter found',
        ),
  );

  // 2. Required top-level keys.
  const keys = frontmatter ? topLevelKeys(frontmatter) : [];
  const missingKeys = REQUIRED_KEYS.filter((k) => !keys.includes(k));
  push(
    'required-keys',
    missingKeys.length === 0
      ? OK(`all ${REQUIRED_KEYS.length} required keys present`, { keys })
      : BAD(`missing top-level key(s): ${missingKeys.join(', ')}`, { keys }),
  );

  // 3. Token references resolve.
  const refs = frontmatter ? tokenReferences(frontmatter) : [];
  const unresolved = [...new Set(refs.filter((r) => !resolvesReference(r, system)))];
  const componentUnresolved = [...system.components]
    .filter(([, def]) => def.unresolvedRefs && def.unresolvedRefs.length > 0)
    .map(([name, def]) => `${name}: ${def.unresolvedRefs.join(', ')}`);
  push(
    'reference-resolution',
    unresolved.length === 0 && componentUnresolved.length === 0
      ? OK(`${refs.length} reference(s), all resolved`, {
          total: refs.length,
          resolved: refs.length,
          unresolved: 0,
        })
      : BAD('unresolved references', {
          total: refs.length,
          resolved: refs.length - unresolved.length,
          unresolved: unresolved.length,
          detail: [...unresolved, ...componentUnresolved],
        }),
  );

  // 4. Colour values.
  const badColours = [];
  for (const [name, colour] of system.colors) {
    const hex = colour.hex ?? '';
    if (!/^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(hex)) badColours.push(`${name} -> ${hex}`);
    const rawValue = new RegExp(`^\\s{2}${name}:\\s*(.+)$`, 'm').exec(frontmatter ?? '');
    if (rawValue && !/^("[^"]+"|'[^']+'|\{[^}]+\})$/.test(rawValue[1].trim())) {
      badColours.push(`${name} -> ${rawValue[1].trim()} (unexpected literal form)`);
    }
  }
  push(
    'colour-values',
    badColours.length === 0
      ? OK(`${system.colors.size} colour(s) resolve to a 6 or 8 digit hex`)
      : BAD('colour value(s) not in an accepted form', { detail: badColours }),
  );

  // 5. Required sections.
  const required = EXTENDED_PACKAGES.has(pkg)
    ? [...CANONICAL_SECTIONS, ...EXTENSION_SECTIONS]
    : CANONICAL_SECTIONS;
  const missingSections = required.filter((s) => !sections.includes(s));
  push(
    'required-sections',
    missingSections.length === 0
      ? OK(`${sections.length} section(s); all ${required.length} required section(s) present`, {
          required,
          missing: [],
        })
      : BAD(`missing section(s): ${missingSections.join(', ')}`, { required, missing: missingSections }),
  );

  // 6. Section order.
  const orderProblems = [];
  const canonicalOrder = sections.filter((s) => CANONICAL_SECTIONS.includes(s));
  if (canonicalOrder.join('|') !== CANONICAL_SECTIONS.filter((s) => sections.includes(s)).join('|')) {
    orderProblems.push(`canonical sections are out of order: ${canonicalOrder.join(' -> ')}`);
  }
  const extensionOrder = sections.filter((s) => EXTENSION_SECTIONS.includes(s));
  const expectedExtensions = EXTENSION_SECTIONS.filter((s) => sections.includes(s));
  if (extensionOrder.join('|') !== expectedExtensions.join('|')) {
    orderProblems.push(`extension sections are out of order: ${extensionOrder.join(' -> ')}`);
  }
  if (extensionOrder.length > 0 && sections.indexOf(extensionOrder[0]) < sections.indexOf("Do's and Don'ts")) {
    orderProblems.push('an extension section appears before Do\'s and Don\'ts');
  }
  push(
    'section-order',
    orderProblems.length === 0
      ? OK('canonical sections first, extension sections after', { sections })
      : BAD(orderProblems.join('; '), { sections }),
  );

  // 7. Component coverage: every mandatory component has a row, and every token
  //    or doc path that row names resolves.
  const coverage = tableRowsAfter(body, 'Component coverage');
  const covered = new Map();
  const coverageProblems = [];
  for (const row of coverage.rows) {
    if (row.length < 4) continue;
    covered.set(`${row[0]}|${row[1]}`, row);
  }
  for (const [category, components] of Object.entries(MANDATORY_COMPONENTS)) {
    for (const component of components) {
      const row = covered.get(`${category}|${component}`);
      if (!row) {
        coverageProblems.push(`no coverage row for ${category} / ${component}`);
        continue;
      }
      for (const name of backticked(row[3])) {
        if (!resolvesName(name, system)) {
          coverageProblems.push(`${category} / ${component} cites unknown token \`${name}\``);
        }
      }
    }
  }
  push(
    'coverage-matrix',
    coverage.found && coverageProblems.length === 0
      ? OK(
          `${covered.size} coverage row(s); all ${Object.values(MANDATORY_COMPONENTS).flat().length} mandatory component(s) covered`,
          { rows: covered.size, mandatory: Object.values(MANDATORY_COMPONENTS).flat().length },
        )
      : BAD(
          coverage.found
            ? coverageProblems.slice(0, 8).join('; ')
            : 'no "### Component coverage" table found',
          { detail: coverageProblems },
        ),
  );

  // 8. State coverage: every required state has a token or a documented rule,
  //    and the state table's own token names resolve.
  const states = tableRowsAfter(body, 'State coverage');
  const stateProblems = [];
  // A state name can head rows in more than one table (an Input and a Table both
  // have a Hover state), so rows are kept as a list and picked by expected token.
  const rowsByName = new Map();
  for (const row of states.rows) {
    if (row.length < 2) continue;
    if (!rowsByName.has(row[0])) rowsByName.set(row[0], []);
    rowsByName.get(row[0]).push(row);
  }
  const rowFor = (name, expected) => {
    const candidates = rowsByName.get(name) ?? [];
    if (candidates.length === 0) return null;
    if (expected) return candidates.find((r) => (r[1] ?? '').includes(expected)) ?? candidates[0];
    return candidates[0];
  };
  const inspectCell = (where, cell, expected) => {
    for (const name of backticked(cell)) {
      if (!resolvesName(name, system)) {
        stateProblems.push(`${where}: cites unknown token \`${name}\``);
      }
    }
    if (expected) {
      if (!resolvesReference(`components.${expected}`, system)) {
        stateProblems.push(`${where}: token \`${expected}\` does not exist`);
      }
      if (!cell.includes(expected)) stateProblems.push(`${where}: row does not name \`${expected}\``);
    } else if (!/rule:/i.test(cell)) {
      stateProblems.push(`${where}: no token and no documented rule`);
    }
  };

  for (const [component, spec] of Object.entries(REQUIRED_STATES)) {
    if (spec.layout === 'variants') {
      // One row per variant; one column per state, in the order declared above.
      for (const variant of spec.variants) {
        const row = rowFor(variant);
        if (!row) {
          stateProblems.push(`no state row for ${component} / ${variant}`);
          continue;
        }
        spec.states.forEach((state, index) => {
          inspectCell(`${variant} / ${state}`, row[index + 1] ?? '', spec.tokens[variant]?.[state]);
        });
      }
    } else {
      // One row per state, with the token in the second column.
      for (const state of spec.states) {
        const row = rowFor(state, spec.tokens[state]);
        if (!row) {
          stateProblems.push(`no state row for ${component} / ${state}`);
          continue;
        }
        inspectCell(`${component} / ${state}`, row[1] ?? '', spec.tokens[state]);
      }
    }
  }
  push(
    'state-coverage',
    states.found && stateProblems.length === 0
      ? OK('every required variant and state is tokenised or has a documented rule', {
          tableRows: states.rows.length,
        })
      : BAD(
          states.found ? stateProblems.slice(0, 8).join('; ') : 'no "### State coverage" table found',
          { detail: stateProblems },
        ),
  );

  // 9. Typography coverage.
  const missingTypography = REQUIRED_TYPOGRAPHY.filter((r) => !system.typography.has(r));
  push(
    'typography-coverage',
    missingTypography.length === 0
      ? OK(`all ${REQUIRED_TYPOGRAPHY.length} required role(s) defined (${system.typography.size} total)`)
      : BAD(`missing role(s): ${missingTypography.join(', ')}`),
  );

  // 10. Colour coverage, plus the Info policy.
  const missingColors = REQUIRED_COLORS.filter((r) => !system.colors.has(r));
  const infoPolicy =
    /informational notice reuses/i.test(body) || system.components.has('alert-info');
  push(
    'colour-coverage',
    missingColors.length === 0 && infoPolicy
      ? OK(
          `all ${REQUIRED_COLORS.length} required colour role(s) defined (${system.colors.size} total); Info is a documented policy`,
          { infoPolicy: 'documented: informational notices reuse the primary tint' },
        )
      : BAD(
          [
            missingColors.length > 0 ? `missing role(s): ${missingColors.join(', ')}` : null,
            infoPolicy ? null : 'no documented Info policy',
          ]
            .filter(Boolean)
            .join('; '),
        ),
  );

  // 11. Foreign-design-system contamination.
  const files = await packageFiles(paths);
  const contamination = [];
  let scannedLines = 0;
  for (const file of files) {
    const text = await readFile(file, 'utf8');
    const lines = text.split('\n');
    scannedLines += lines.length;
    lines.forEach((line, index) => {
      const lower = line.toLowerCase();
      for (const term of FOREIGN_TERMS) {
        if (!lower.includes(term.toLowerCase())) continue;
        const window = lines
          .slice(Math.max(0, index - 2), Math.min(lines.length, index + 3))
          .join(' ')
          .toLowerCase();
        const marker = ALLOWED_CONTEXT.find((a) => window.includes(a));
        if (!marker) {
          contamination.push({
            file: path.relative(paths.dir, file),
            line: index + 1,
            term,
            text: line.trim().slice(0, 120),
          });
        }
      }
    });
  }
  push(
    'foreign-contamination',
    contamination.length === 0
      ? OK(
          `${files.length - 1} file(s) and ${scannedLines} line(s) scanned for ${FOREIGN_TERMS.length} foreign design-system names`,
          { scanned: files.length - 1 },
        )
      : BAD(`${contamination.length} un-attributed foreign name(s)`, { detail: contamination }),
  );

  // 12. Legacy naming.
  const legacy = [];
  for (const file of files) {
    const text = await readFile(file, 'utf8');
    text.split('\n').forEach((line, index) => {
      for (const term of LEGACY_TERMS) {
        if (line.toLowerCase().includes(term.toLowerCase())) {
          legacy.push({
            file: path.relative(paths.dir, file),
            line: index + 1,
            term,
            text: line.trim().slice(0, 120),
          });
        }
      }
    });
  }
  push(
    'legacy-naming',
    legacy.length === 0
      ? OK(`${LEGACY_TERMS.length} legacy name(s) searched, none found`)
      : BAD(`${legacy.length} legacy name(s) found`, { detail: legacy }),
  );

  if (!STRUCTURAL_PACKAGES.has(pkg)) {
    for (const check of checks) {
      if (check.status !== 'fail' || !WAIVED_FOR_EARLIER_PACKAGES.has(check.name)) continue;
      check.waivedFinding = check.detail;
      check.status = 'waived';
      check.detail =
        `waived for ${pkg}: the rule is part of the structural layer introduced with ` +
        'industrial-steel-blue; the gap is recorded as open work in the repository README';
    }
  }

  const failures = checks.filter((c) => c.status === 'fail').map((c) => c.name);
  const json = {
    $source:
      `Generated by scripts/validate-design.mjs (1:validate) from ${pkg}/DESIGN.md; ` +
      'do not edit by hand — re-run `npm run 1:validate`.',
    package: pkg,
    contract: {
      path: `${pkg}/DESIGN.md`,
      bytes: Buffer.byteLength(raw, 'utf8'),
      sha256: createHash('sha256').update(raw, 'utf8').digest('hex'),
    },
    tokens: {
      colors: system.colors.size,
      typography: system.typography.size,
      spacing: system.spacing.size,
      rounded: system.rounded.size,
      components: system.components.size,
      total:
        system.colors.size +
        system.typography.size +
        system.spacing.size +
        system.rounded.size +
        system.components.size,
    },
    references: {
      total: refs.length,
      resolved: refs.length - unresolved.length,
      unresolved: unresolved.length,
    },
    lint: {
      errors: lintErrors.length,
      warnings: report.findings.filter((f) => f.severity === 'warning').length,
      info: report.findings.filter((f) => f.severity === 'info').length,
      findings: report.findings.map((f) => ({
        severity: f.severity,
        path: f.path ?? null,
        message: f.message,
      })),
    },
    sections,
    checks,
    summary: {
      checks: checks.length,
      passed: checks.filter((c) => c.status === 'pass').length,
      failed: failures.length,
      failures,
      waived: checks.filter((c) => c.status === 'waived').length,
      errors: lintErrors.length,
      warnings: report.findings.filter((f) => f.severity === 'warning').length,
    },
    structuralLayer: STRUCTURAL_PACKAGES.has(pkg)
      ? 'enforced'
      : 'waived (package predates the structural layer)',
  };

  return { json, failures };
}
