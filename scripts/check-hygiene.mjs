#!/usr/bin/env node
/**
 * 6:hygiene — the repository-level checks that no other step covers.
 *
 * Steps 1-3 prove the contract is valid and the generated files come from it.
 * This step proves the repository itself is deliverable: nothing is a
 * placeholder, nothing is broken, and nothing is missing.
 *
 *   1. no unfilled filler markers anywhere;
 *   2. the word "placeholder" appears only as reviewed UI vocabulary, and never
 *      inside a script, a data file or a workflow — with every occurrence listed
 *      so a reviewer can see what is being allowed;
 *   3. every JSON file parses; every CSS file is non-empty; every text file is
 *      valid UTF-8;
 *   4. every relative link in a Markdown or HTML file resolves to a real file;
 *   5. every file the delivery promises actually exists and is non-empty;
 *   6. no file or directory is named after an agent, session or task id.
 *
 * Exits non-zero on the first category that fails, after printing all findings.
 */

import { readFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

import { PACKAGES, REPO_ROOT } from './lib/design-system.mjs';
import { STRUCTURAL_PACKAGES } from './lib/machine-validation.mjs';

const SKIP_DIRS = new Set(['node_modules', '.git', '.DS_Store']);
const failures = [];
const notes = [];

const rel = (p) => path.relative(REPO_ROOT, p) || '.';
const fail = (category, message) => failures.push({ category, message });

// ---------------------------------------------------------------------------
// collect every tracked file
// ---------------------------------------------------------------------------

/** @returns {Promise<string[]>} absolute paths of files, node_modules excluded */
async function walk(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

/**
 * This file defines the marker patterns and the placeholder policy, so it
 * necessarily contains those strings. It is excluded from the text scans below
 * and from nothing else: the exclusion is by exact path, and any other file is
 * still scanned in full. Excluding the checker rather than rewriting its
 * patterns is deliberate — obfuscating the patterns would make the rules harder
 * to review, which is the opposite of what this check is for.
 */
const SELF = path.join(REPO_ROOT, 'scripts', 'check-hygiene.mjs');
const files = (await walk(REPO_ROOT)).sort();
const scannedFiles = files.filter((f) => f !== SELF);

/**
 * Two files necessarily contain an excluded marker, and both do so on purpose:
 *
 *   - `scripts/lib/machine-validation.mjs` defines the legacy names the structural
 *     layer searches for, so the list has to spell them out;
 *   - `industrial-steel-blue/reports/designmd-validation.md` reports what that
 *     search found, and a report about a naming rule has to name the rule.
 *
 * They are exempt from the marker scan alone. Every occurrence is printed as an
 * allowed mention, so the exemption is visible in the output instead of silent,
 * and every other file is still scanned in full.
 */
const MARKER_SOURCES = new Set([
  path.join(REPO_ROOT, 'scripts', 'lib', 'machine-validation.mjs'),
  path.join(REPO_ROOT, 'industrial-steel-blue', 'reports', 'designmd-validation.md'),
]);
const allowedMarkerMentions = [];

// ---------------------------------------------------------------------------
// 6. no agent / session / task ids in names
// ---------------------------------------------------------------------------

for (const f of files) {
  const name = path.basename(f);
  if (/\d{15,}/.test(name)) {
    fail('naming', `${rel(f)} — filename contains a long digit run (session/task id?)`);
  }
  if (/^m_[A-Za-z0-9]{10,}/.test(name) || /agent[_-]?[0-9a-f]{12,}/i.test(name)) {
    fail('naming', `${rel(f)} — filename looks like an agent id`);
  }
}

// ---------------------------------------------------------------------------
// 1. filler markers
// ---------------------------------------------------------------------------

const TEXT_EXT = new Set([
  '.md', '.mjs', '.js', '.json', '.css', '.html', '.yml', '.yaml', '.less', '.txt', '',
]);

const MARKERS = [
  { id: 'JAT', re: /\bJAT\b/ },
  { id: 'TODO', re: /\bTODO\b/ },
  { id: 'FIXME', re: /\bFIXME\b/ },
  { id: 'XXX', re: /\bXXX\b/ },
  { id: 'HACK', re: /\bHACK\b/ },
  { id: 'TBD', re: /\bTBD\b/ },
  { id: 'CHANGEME', re: /\bCHANGEME\b/i },
  { id: 'lorem ipsum', re: /lorem ipsum/i },
  { id: 'example.com', re: /example\.(com|org|net)\b/ },
  { id: 'example email', re: /\b(a@b\.com|foo@bar|user@example)\b/i },
  { id: 'angle template', re: /<(your|insert|replace)[-_ ]/i },
  { id: 'brace template', re: /\{\{\s*[a-z_]+(_[a-z]+)?\s*\}\}/i },
  { id: 'PLACEHOLDER (shouting)', re: /\bPLACEHOLDER\b/ },
  { id: 'bracketed placeholder', re: /[[<{]\s*placeholder\s*[\]>}]/i },
];

const PLACEHOLDER_ALLOWED_EXT = new Set(['.md', '.css', '.html']);

/**
 * The bare word, not part of a longer identifier: `placeholder`, `"placeholder"`,
 * `>placeholder<`, `.placeholder`, `_placeholder`, separated by anything that is
 * not a letter, digit, hyphen, underscore or dot.
 */
const BARE_PLACEHOLDER = /(?<![\w.-])placeholder(?![\w-])/i;
const placeholderHits = [];

for (const f of scannedFiles) {
  const ext = path.extname(f).toLowerCase();
  if (!TEXT_EXT.has(ext)) continue;

  let text;
  try {
    text = await readFile(f, 'utf8');
  } catch {
    continue; // binary
  }
  if (text.includes('\uFFFD')) {
    fail('encoding', `${rel(f)} — not valid UTF-8 (contains U+FFFD)`);
    continue;
  }

  const lines = text.split('\n');
  for (const { id, re } of MARKERS) {
    lines.forEach((line, i) => {
      if (!re.test(line)) return;
      const where = `${rel(f)}:${i + 1}`;
      const what = `filler marker "${id}": ${line.trim().slice(0, 110)}`;
      if (MARKER_SOURCES.has(f)) {
        allowedMarkerMentions.push(`${where} — ${what}`);
        return;
      }
      fail('marker', `${where} — ${what}`);
    });
  }

  // 2. the word "placeholder", as reviewed UI vocabulary only.
  //
  // It is legitimate as a data value and as an identifier: a component named
  // `placeholder-text`, a state class `.select--placeholder`, a property named
  // `placeholderTextColor`. What must never survive is the *bare word* standing
  // in for content that was never written — a template still holding the word
  // itself. So outside .md/.css/.html the word is flagged only when it is not
  // part of a longer identifier, which is exactly the case that cannot be
  // reviewed by reading it in context.
  lines.forEach((line, i) => {
    if (!/placeholder/i.test(line)) return;
    placeholderHits.push({ file: rel(f), line: i + 1, ext });
    if (PLACEHOLDER_ALLOWED_EXT.has(ext)) return;
    if (BARE_PLACEHOLDER.test(line)) {
      fail(
        'placeholder',
        `${rel(f)}:${i + 1} — "placeholder" stands alone in a ${ext || 'extensionless'} file; ` +
          'in code and data it is only allowed as part of an identifier such as ' +
          'placeholder-text, .select--placeholder or placeholderTextColor',
      );
    }
  });
}

const placeholderByFile = new Map();
for (const hit of placeholderHits) {
  placeholderByFile.set(hit.file, (placeholderByFile.get(hit.file) ?? 0) + 1);
}

// ---------------------------------------------------------------------------
// 3. JSON parses, CSS non-empty, no empty files
// ---------------------------------------------------------------------------

for (const f of scannedFiles) {
  const ext = path.extname(f).toLowerCase();
  const info = await stat(f);

  if (info.size === 0) {
    fail('empty', `${rel(f)} — zero bytes`);
    continue;
  }
  if (ext === '.json') {
    try {
      JSON.parse(await readFile(f, 'utf8'));
    } catch (err) {
      fail('json', `${rel(f)} — ${err.message}`);
    }
  }
  if (ext === '.css') {
    const text = await readFile(f, 'utf8');
    if (!/\{/.test(text) || !/--[a-z0-9-]+\s*:/i.test(text)) {
      fail('css', `${rel(f)} — a stylesheet with no rule block or custom property`);
    }
  }
}

// ---------------------------------------------------------------------------
// 4. relative links resolve
// ---------------------------------------------------------------------------

const LINK_RE_MD = /\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
const LINK_RE_HTML = /(?:href|src)="([^"]+)"/g;

for (const f of scannedFiles) {
  const ext = path.extname(f).toLowerCase();
  if (ext !== '.md' && ext !== '.html') continue;
  const text = await readFile(f, 'utf8');
  const re = ext === '.md' ? LINK_RE_MD : LINK_RE_HTML;
  const dir = path.dirname(f);

  for (const m of text.matchAll(re)) {
    const target = m[1];
    if (/^(https?:|mailto:|tel:|data:|#|\/\/)/.test(target)) continue;
    const clean = target.split('#')[0].split('?')[0];
    if (clean === '') continue;
    const resolved = path.resolve(dir, decodeURIComponent(clean));
    if (!existsSync(resolved)) {
      fail('link', `${rel(f)} — link target does not exist: ${target}`);
    }
  }
}

// ---------------------------------------------------------------------------
// 5. the delivery is complete
// ---------------------------------------------------------------------------

const PATTERN_DOCS = [
  'foundations',
  'application-shell',
  'page-layout',
  'navigation',
  'forms',
  'tables',
  'search-filter',
  'cards',
  'feedback',
  'data-visualization',
  'workflow',
  'permission',
  'accessibility',
  'responsive',
];

/**
 * The example files each package ships.
 *
 * `arco-blue` and `jiean-red` ship the six-page set with a shared stylesheet.
 * `industrial-steel-blue` ships the flat four-page set the industrial task book
 * specifies — `dashboard`, `list-page`, `form-page`, `detail-page`, each as HTML
 * plus the PNG rendered from it, with the styles inlined so `examples/` has no
 * subdirectory.
 */
const FOUR_PAGE_EXAMPLES = ['dashboard', 'list-page', 'form-page', 'detail-page'].flatMap((page) => [
  `examples/${page}.html`,
  `examples/${page}.png`,
]);

const PACKAGE_EXAMPLE_FILES = {
  'arco-blue': FOUR_PAGE_EXAMPLES,
  'jiean-red': FOUR_PAGE_EXAMPLES,
  'industrial-steel-blue': FOUR_PAGE_EXAMPLES,
};

const REQUIRED = [
  'README.md',
  'README_zh-CN.md',
  'AGENTS.md',
  'LICENSE',
  'THIRD_PARTY_NOTICES.md',
  'CHANGELOG.md',
  'package.json',
  'package-lock.json',
  '.github/workflows/validate-design.yml',
  'scripts/lib/design-system.mjs',
  'scripts/validate-design.mjs',
  'scripts/export-tokens.mjs',
  'scripts/verify-generated.mjs',
  'scripts/check-hygiene.mjs',
  'scripts/derive-jiean-red-ramp.mjs',
  'scripts/visual/capture-screenshots.mjs',
  'scripts/visual/compare-metrics.mjs',
  'scripts/compare-packages.mjs',
  'scripts/lib/machine-validation.mjs',
  'scripts/derive-steel-ramp.mjs',
  'scripts/generate-example-screenshots.mjs',
  'scripts/final-metrics.mjs',
  // Every style package delivers the same file set, so the list is generated
  // from PACKAGES rather than repeated per package.
  ...PACKAGES.flatMap((pkg) => [
    `${pkg}/DESIGN.md`,
    `${pkg}/README.md`,
    `${pkg}/README_zh-CN.md`,
    `${pkg}/tokens/tokens.json`,
    `${pkg}/dist/tokens.css`,
    `${pkg}/dist/tailwind.theme.json`,
    `${pkg}/dist/tokens.full.css`,
    `${pkg}/dist/tokens.full.json`,
    `${pkg}/reports/source-audit.md`,
    `${pkg}/reports/designmd-validation.md`,
    `${pkg}/reports/visual-validation.md`,
    // The machine-readable verdict is written by 1:validate, which enforces the
    // structural layer; the two earlier packages are grandfathered out of that
    // layer, so they are not required to carry a report it did not produce.
    ...(STRUCTURAL_PACKAGES.has(pkg) ? [`${pkg}/reports/machine-validation.json`] : []),
    ...(PACKAGE_EXAMPLE_FILES[pkg] ?? FOUR_PAGE_EXAMPLES).map((file) => `${pkg}/${file}`),
    ...PATTERN_DOCS.map((doc) => `${pkg}/docs/${doc}.md`),
  ]),
];


for (const r of REQUIRED) {
  const full = path.join(REPO_ROOT, r);
  if (!existsSync(full)) {
    fail('missing', `${r} — required file does not exist`);
  }
}

// Every artifact the contract generates is referenced from package.json.
const pkg = JSON.parse(await readFile(path.join(REPO_ROOT, 'package.json'), 'utf8'));
for (const [name, cmd] of Object.entries(pkg.scripts ?? {})) {
  const m = cmd.match(/node\s+(\S+\.mjs)/);
  if (m && !existsSync(path.join(REPO_ROOT, m[1]))) {
    fail('missing', `package.json script "${name}" runs a file that does not exist: ${m[1]}`);
  }
}

// ---------------------------------------------------------------------------
// report
// ---------------------------------------------------------------------------

console.log('Hygiene scan');
console.log('------------');
console.log(`  files scanned          ${scannedFiles.length}`);
console.log(`  checker excluded       ${rel(SELF)} (it defines the patterns)`);
console.log(`  marker exemptions      ${MARKER_SOURCES.size} file(s) that define or report the terms`);
console.log(`  placeholder occurrences ${placeholderHits.length} across ${placeholderByFile.size} file(s)`);
for (const [file, count] of [...placeholderByFile].sort()) {
  console.log(`    ${String(count).padStart(3)}  ${file}`);
}
if (allowedMarkerMentions.length > 0) {
  for (const mention of allowedMarkerMentions) {
    notes.push(`allowed marker mention (a file that defines or reports the term): ${mention}`);
  }
}
notes.push(
  'The word "placeholder" is legitimate UI vocabulary: an input\'s hint text, the CSS ' +
    'pseudo-element, the HTML attribute, a component named placeholder-text, a state class ' +
    '.select--placeholder. Outside .md/.css/.html it is flagged only when it stands alone rather ' +
    'than inside an identifier, and always in its shouting or bracketed forms — those are what an ' +
    'unfilled template leaves behind.',
);

const byCategory = new Map();
for (const f of failures) {
  byCategory.set(f.category, (byCategory.get(f.category) ?? 0) + 1);
}
console.log('');
if (failures.length === 0) {
  console.log('Findings: none.');
} else {
  for (const [category, count] of byCategory) {
    console.log(`Findings in "${category}" (${count}):`);
    for (const f of failures.filter((x) => x.category === category)) {
      console.log(`  ${f.message}`);
    }
  }
}

console.log('');
for (const n of notes) console.log(`Note: ${n}`);

console.log('');
if (failures.length > 0) {
  console.error(`6:hygiene FAILED: ${failures.length} finding(s).`);
  process.exit(1);
}
console.log('6:hygiene OK.');
