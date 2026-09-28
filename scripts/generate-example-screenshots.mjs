#!/usr/bin/env node
/**
 * 10:screenshots (--check) / 11:screenshots:write (--write)
 *
 * Render each example page of a flat-example package to the PNG that ships beside
 * it, and prove the committed PNG still represents the committed HTML.
 *
 * Why it works this way
 * ---------------------
 * The pages are served over a loopback HTTP server and a one-line audit is
 * injected into the response on the fly, so the viewport the page really got can
 * be read back from the DOM. That read is what makes the picture trustworthy:
 * `--window-size` sizes the *window*, and on macOS the window frame costs the
 * page height it never sees, so a screenshot taken from an uncalibrated window is
 * a picture of a viewport nobody specified. Each page is therefore measured,
 * re-taken with a corrected window height until the viewport is exactly the
 * canonical one, and only then captured. The window is taller than the viewport
 * by that frame cost, so the image is cropped back to the viewport: a stored
 * screenshot spans exactly what the page rendered and nothing else.
 *
 * Calibration baseline (§65 of the task book, all of it fixed here on purpose):
 *
 *   viewport width    1280
 *   viewport height   900
 *   device pixel ratio 1        (--force-device-scale-factor=1)
 *   theme             light     (the pages carry no dark-mode switch)
 *   browser           Chromium-based, discovered from CHROME_CANDIDATES
 *   fonts             system stack resolved by the browser; no webfont is
 *                     requested, so no font-loading race exists
 *   animation         --virtual-time-budget=4000 lets timers run to a settled
 *                     state before the capture; the pages themselves animate
 *                     nothing, and `prefers-reduced-motion` is respected in the
 *                     stylesheet for the one interactive case
 *   capture timing    the picture is taken when the PNG's IEND chunk is present,
 *                     not when the process exits (Chrome does not exit here)
 *
 * `--use-mock-keychain` is passed deliberately: a throwaway profile would
 * otherwise ask the login keychain for a "Chrome Safe Storage" secret on every
 * run, which is a prompt the operator should never have to answer for a build
 * step.
 *
 * Run: npm run 11:screenshots:write   (regenerate)
 *      npm run 10:screenshots         (verify, part of `npm run check`)
 */

import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { REPO_ROOT, requestedPackages } from './lib/design-system.mjs';
import { cropPngToHeight, readPng } from './lib/png.mjs';

/** The canonical desktop viewport every committed preview is rendered at. */
const VIEWPORT = { width: 1280, height: 900 };

/** Starting guess for the window frame's height cost; measured, never trusted. */
/**
 * Slack for the freshness comparison, in milliseconds.
 *
 * The comparison is between filesystem timestamps, and a fresh `git clone` writes
 * every file within the same second — in an order the checkout decides, not the
 * repository. Without slack, CI would fail on a preview that is perfectly current
 * simply because the HTML was written a few hundred milliseconds after the PNG.
 * Five seconds covers a checkout while still catching the case the check exists
 * for: a real edit, followed by forgetting to re-render.
 */
const FRESHNESS_TOLERANCE_MS = 5000;

const FRAME_GUESS = 87;

/** How many times one page may be re-taken while the viewport is calibrated. */
const CALIBRATION_ATTEMPTS = 5;

/**
 * The flat-example packages: the ones whose `examples/` is a flat set of HTML
 * files with a PNG beside each. All three packages ship that shape; the reference
 * captures that `npm run 4:capture` and `npm run 5:compare` own live separately,
 * under `reports/evidence/`.
 */
const FLAT_EXAMPLE_PACKAGES = new Set(['arco-blue', 'jiean-red', 'industrial-steel-blue']);

/** The example pages, in the order they are rendered. */
const PAGES = ['dashboard', 'list-page', 'form-page', 'detail-page'];

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
};

const rel = (p) => path.relative(REPO_ROOT, p);

function findChrome() {
  for (const candidate of CHROME_CANDIDATES) if (existsSync(candidate)) return candidate;
  return null;
}

/**
 * The audit injected into each served page. It reports the viewport the page
 * actually got, in a payload the caller can parse out of the DOM dump.
 */
const VIEWPORT_AUDIT = `<script type="application/json" id="__viewport__">{"width":0}</script>
<script>(function(){var p=document.getElementById('__viewport__');if(p){p.textContent=JSON.stringify({width:window.innerWidth,height:window.innerHeight,dpr:window.devicePixelRatio});}})();</script>`;

/** Serve the repository root, injecting the viewport audit into every HTML page. */
async function startServer() {
  const server = createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
      const abs = path.join(REPO_ROOT, pathname);
      if (!abs.startsWith(REPO_ROOT)) {
        res.writeHead(403).end('outside the repository');
        return;
      }
      let body = await readFile(abs);
      if (path.extname(abs) === '.html') {
        body = Buffer.from(
          body.toString('utf8').replace('</body>', `${VIEWPORT_AUDIT}\n</body>`),
          'utf8',
        );
      }
      res.writeHead(200, { 'content-type': MIME[path.extname(abs)] ?? 'application/octet-stream' });
      res.end(body);
    } catch (err) {
      res.writeHead(err.code === 'ENOENT' ? 404 : 500).end(String(err.message));
    }
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }));
  });
}

/**
 * Run one headless Chrome task, resolving on the result rather than on exit.
 *
 * Chrome does not terminate after `--dump-dom` or `--screenshot` here; it writes
 * its whole result and then idles. So completion is read from the result itself —
 * the DOM dump ends at `</html>`, a PNG is complete once its IEND chunk is
 * present — and the process group is then killed, including Chrome's helpers.
 */
function runChrome(chrome, args, { resolveOn, pngPath, hardTimeoutMs = 60000 }) {
  return new Promise((resolve, reject) => {
    const child = spawn(chrome, args, { stdio: ['ignore', 'pipe', 'pipe'], detached: true });
    let stdout = '';
    let stderr = '';
    let settled = false;
    let poll = null;

    const cleanup = () => {
      if (poll) clearInterval(poll);
      clearTimeout(timer);
      try {
        process.kill(-child.pid, 'SIGKILL');
      } catch {
        try {
          child.kill('SIGKILL');
        } catch {
          /* already gone */
        }
      }
    };

    const settle = (fn, value) => {
      if (settled) return;
      settled = true;
      cleanup();
      fn(value);
    };

    const timer = setTimeout(() => {
      settle(
        reject,
        new Error(`headless Chrome timed out after ${hardTimeoutMs}ms\n${stderr.slice(0, 600)}`),
      );
    }, hardTimeoutMs);

    child.stdout.on('data', (d) => {
      stdout += d;
      if (resolveOn === 'dom' && /<\/html>/.test(stdout)) settle(resolve, { stdout, stderr });
    });
    child.stderr.on('data', (d) => {
      stderr += d;
    });
    child.on('error', (err) => settle(reject, err));
    child.on('close', () => settle(resolve, { stdout, stderr }));

    if (resolveOn === 'png') {
      poll = setInterval(async () => {
        try {
          const buf = await readFile(pngPath);
          if (buf.length > 8 && buf.subarray(-8).toString('latin1').includes('IEND')) {
            settle(resolve, { stdout, stderr, bytes: buf.length });
          }
        } catch {
          /* not written yet */
        }
      }, 150);
    }
  });
}

/** Flags shared by both invocations, including the throwaway profile. */
function baseFlags(profileDir, windowHeight) {
  return [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    // Never ask the login keychain for the profile's storage secret.
    '--use-mock-keychain',
    `--window-size=${VIEWPORT.width},${windowHeight}`,
    `--user-data-dir=${profileDir}`,
  ];
}

/** Render one page at the canonical viewport and leave the cropped PNG behind. */
async function renderPage({ chrome, profileDir, port, pkg, page, pngPath }) {
  const url = `http://127.0.0.1:${port}/${pkg}/examples/${page}.html`;
  // A leftover PNG already ends with IEND, so the readiness poll would pass
  // before Chrome writes anything. Clearing it first makes a stale file
  // impossible to mistake for the new capture.
  await rm(pngPath, { force: true });

  let frame = FRAME_GUESS;
  let viewport = null;
  for (let attempt = 1; attempt <= CALIBRATION_ATTEMPTS; attempt += 1) {
    const dom = await runChrome(
      chrome,
      [...baseFlags(profileDir, VIEWPORT.height + frame), '--virtual-time-budget=4000', '--dump-dom', url],
      { resolveOn: 'dom' },
    );
    const m = dom.stdout.match(
      /<script type="application\/json" id="__viewport__">([\s\S]*?)<\/script>/,
    );
    if (!m) {
      throw new Error(
        `${pkg}/examples/${page}.html produced no viewport report — ` +
          'the page may not have rendered at all (check for an unclosed tag)',
      );
    }
    viewport = JSON.parse(m[1].replace(/&quot;/g, '"'));

    if (viewport.width === VIEWPORT.width && viewport.height === VIEWPORT.height) break;
    const shortfall = VIEWPORT.height - viewport.height;
    if (attempt === CALIBRATION_ATTEMPTS) {
      throw new Error(
        `${page}: the page sees ${viewport.width}x${viewport.height} after ` +
          `${CALIBRATION_ATTEMPTS} attempts. The window is being clamped by the desktop — ` +
          'close the other browser windows and re-run.',
      );
    }
    frame += shortfall;
    console.log(
      `  ${page.padEnd(11)} viewport ${viewport.width}x${viewport.height} — re-taking with a ` +
        `window ${shortfall >= 0 ? 'taller' : 'shorter'} by ${Math.abs(shortfall)}px`,
    );
  }

  await runChrome(
    chrome,
    [...baseFlags(profileDir, VIEWPORT.height + frame), '--virtual-time-budget=4000', `--screenshot=${pngPath}`, url],
    { resolveOn: 'png', pngPath },
  );

  // The window is taller than the viewport by `frame`; keep only the viewport.
  cropPngToHeight(pngPath, VIEWPORT.height, pngPath);
  const image = readPng(pngPath);
  if (image.width !== VIEWPORT.width || image.height !== VIEWPORT.height) {
    throw new Error(
      `${page}: captured ${image.width}x${image.height}, expected ` +
        `${VIEWPORT.width}x${VIEWPORT.height}`,
    );
  }
  const bytes = (await stat(pngPath)).size;
  return { page, file: rel(pngPath), bytes, width: image.width, height: image.height, viewport };
}

/**
 * The colours a preview must contain, and the ones it must not.
 *
 * Counted on the decoded pixels rather than on the HTML, because the point is to
 * prove what was *rendered*: a page can reference the right token and still paint
 * the wrong value, and the failure this catches — a preview carrying the baseline
 * palette because the stylesheet or the tokens were not the ones intended — is
 * exactly the failure that a source-level check cannot see. `primary` appears in
 * every example page (a button, a link, a selected row), so a floor of a few
 * hundred pixels is a loose test with no false negatives.
 */
const PALETTE = {
  'arco-blue': {
    required: [
      { role: 'canvas', hex: '#F2F3F5', minPixels: 20000 },
      { role: 'surface', hex: '#FFFFFF', minPixels: 100000 },
      { role: 'primary', hex: '#165DFF', minPixels: 300 },
      { role: 'text-primary', hex: '#1D2129', minPixels: 300 },
    ],
    forbidden: [
      { role: "industrial-steel-blue's primary", hex: '#3E6489' },
      { role: "jiean-red's primary", hex: '#D7000F' },
    ],
  },
  'jiean-red': {
    required: [
      { role: 'canvas', hex: '#F2F3F5', minPixels: 20000 },
      { role: 'surface', hex: '#FFFFFF', minPixels: 100000 },
      { role: 'primary', hex: '#D7000F', minPixels: 300 },
      { role: 'text-primary', hex: '#353535', minPixels: 300 },
    ],
    forbidden: [
      { role: "arco-blue's primary", hex: '#165DFF' },
      { role: "industrial-steel-blue's primary", hex: '#3E6489' },
    ],
  },
  'industrial-steel-blue': {
    required: [
      { role: 'canvas', hex: '#F2F3F5', minPixels: 20000 },
      { role: 'surface', hex: '#FFFFFF', minPixels: 100000 },
      { role: 'primary', hex: '#3E6489', minPixels: 300 },
      { role: 'text-primary', hex: '#1D2129', minPixels: 300 },
    ],
    forbidden: [
      { role: 'the baseline primary', hex: '#165DFF' },
      { role: 'the brand red', hex: '#D7000F' },
    ],
  },
};

/** Count exact pixel matches for a set of hex colours in a decoded image. */
function countColours(image, hexes) {
  const counts = new Map(hexes.map((h) => [h.toUpperCase(), 0]));
  const targets = [...counts].map(([hex, count]) => ({
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
    hex,
    count,
  }));
  const channels = image.channels ?? 3;
  for (const row of image.rows) {
    for (let i = 0; i + 2 < row.length; i += channels) {
      const r = row[i];
      const g = row[i + 1];
      const b = row[i + 2];
      for (const t of targets) {
        if (t.r === r && t.g === g && t.b === b) t.count += 1;
      }
    }
  }
  for (const t of targets) counts.set(t.hex, t.count);
  return counts;
}

/** Newest modification time among the sources a preview derives from. */
async function newestSourceMtime(pkgDir) {
  // The hand-written inputs a preview derives from: the contract, which is the
  // source of every token, and the pages themselves. The *generated* token files
  // are deliberately not candidates: `2:export` rewrites them on every run, so
  // using them would flag a preview as stale every time the export step ran, even
  // when nothing it depends on had changed. A hand edit to a generated file is
  // caught where it belongs — `3:verify-generated` proves those files still match
  // the contract's sha256.
  const candidates = [
    'DESIGN.md',
    ...PAGES.map((p) => `examples/${p}.html`),
  ];
  let newest = 0;
  let newestFile = '';
  for (const file of candidates) {
    try {
      const info = await stat(path.join(pkgDir, file));
      if (info.mtimeMs > newest) {
        newest = info.mtimeMs;
        newestFile = file;
      }
    } catch {
      /* a missing source is reported by 6:hygiene, not here */
    }
  }
  return { newest, newestFile };
}

/**
 * Verify the committed PNGs: present, non-empty, real PNGs, at the canonical
 * size, and no older than the pages and the contract they were rendered from.
 */
async function check(packages) {
  const failures = [];
  const rows = [];

  for (const pkg of packages) {
    const pkgDir = path.join(REPO_ROOT, pkg);
    const palette = PALETTE[pkg];
    if (!palette) throw new Error(`no palette expectation recorded for ${pkg}`);
    const sources = await newestSourceMtime(pkgDir);
    for (const page of PAGES) {
      const htmlPath = path.join(pkgDir, 'examples', `${page}.html`);
      const pngPath = path.join(pkgDir, 'examples', `${page}.png`);
      const label = `${pkg}/examples/${page}.png`;

      if (!existsSync(pngPath)) {
        failures.push(`${label} — missing (run: npm run 11:screenshots:write)`);
        continue;
      }
      const info = await stat(pngPath);
      if (info.size === 0) {
        failures.push(`${label} — zero bytes`);
        continue;
      }
      let image;
      try {
        image = readPng(pngPath);
      } catch (err) {
        failures.push(`${label} — ${err.message}`);
        continue;
      }
      if (image.width !== VIEWPORT.width || image.height !== VIEWPORT.height) {
        failures.push(
          `${label} — ${image.width}x${image.height}, expected ` +
            `${VIEWPORT.width}x${VIEWPORT.height}`,
        );
        continue;
      }
      const counts = countColours(image, [
        ...palette.required.map((c) => c.hex),
        ...palette.forbidden.map((c) => c.hex),
      ]);
      const sample = {};
      for (const c of palette.required) {
        sample[c.role] = counts.get(c.hex.toUpperCase());
        if (sample[c.role] < c.minPixels) {
          failures.push(
            `${label} — the ${c.role} colour ${c.hex} covers only ${sample[c.role]} pixel(s), ` +
              `expected at least ${c.minPixels}; the page may not have rendered the palette it declares`,
          );
        }
      }
      for (const c of palette.forbidden) {
        const found = counts.get(c.hex.toUpperCase());
        sample[`not ${c.role}`] = found;
        if (found > 0) {
          failures.push(`${label} — contains ${found} pixel(s) of ${c.hex}, ${c.role}`);
        }
      }

      const htmlMtime = (await stat(htmlPath)).mtimeMs;
      const stale = info.mtimeMs + FRESHNESS_TOLERANCE_MS < Math.max(htmlMtime, sources.newest);
      if (stale) {
        failures.push(
          `${label} — older than ${rel(path.join(pkgDir, sources.newestFile))}; ` +
            'the picture may no longer represent the page (run: npm run 11:screenshots:write)',
        );
        continue;
      }
      rows.push({
        file: label,
        bytes: info.size,
        size: `${image.width}x${image.height}`,
        rendered: new Date(info.mtimeMs).toISOString().slice(0, 10),
        sample,
      });
    }
  }
  return { failures, rows };
}

async function write(packages) {
  const chrome = findChrome();
  if (!chrome) {
    throw new Error(
      'no headless-capable browser found. Set CHROME_PATH to a Chromium-based binary.',
    );
  }
  const profileDir = await mkdtemp(path.join(tmpdir(), 'jiean-screenshots-chrome-'));
  const { server, port } = await startServer();
  const results = [];
  console.log(`browser : ${chrome}`);
  console.log(`viewport: ${VIEWPORT.width}x${VIEWPORT.height} @1x, light theme`);
  console.log('');
  try {
    for (const pkg of packages) {
      const outDir = path.join(REPO_ROOT, pkg, 'examples');
      await mkdir(outDir, { recursive: true });
      console.log(`package : ${pkg}`);
      for (const page of PAGES) {
        const result = await renderPage({
          chrome,
          profileDir,
          port,
          pkg,
          page,
          pngPath: path.join(outDir, `${page}.png`),
        });
        results.push(result);
        console.log(
          `  ${`${page}.png`.padEnd(18)} ${String(result.bytes).padStart(7)} bytes  ` +
            `${result.width}x${result.height}`,
        );
      }
    }
  } finally {
    server.close();
    await rm(profileDir, { recursive: true, force: true });
  }
  return results;
}

const mode = process.argv.includes('--write') ? 'write' : 'check';
const requested = process.argv.filter((a) => !a.startsWith('--'));
const packages = requestedPackages(requested).filter((pkg) => FLAT_EXAMPLE_PACKAGES.has(pkg));

if (packages.length === 0) {
  console.log(
    'No flat-example package selected. `arco-blue` and `jiean-red` keep their captures under ' +
      'reports/evidence and are handled by npm run 4:capture. Nothing to do.',
  );
  process.exit(0);
}

try {
  if (mode === 'write') {
    const results = await write(packages);
    console.log('');
    console.log(
      `11:screenshots:write OK — ${results.length} preview(s) rendered at ` +
        `${VIEWPORT.width}x${VIEWPORT.height} from the committed HTML.`,
    );
  } else {
    const { failures, rows } = await check(packages);
    console.log('Preview check');
    console.log('-------------');
    for (const row of rows) {
      console.log(`  ${row.file.padEnd(42)} ${String(row.bytes).padStart(7)} bytes  ${row.size}  ${row.rendered}`);
      console.log(
        `      pixels: canvas ${row.sample.canvas}, surface ${row.sample.surface}, ` +
          `primary ${row.sample.primary}, text ${row.sample['text-primary']}, ` +
          `baseline blue ${row.sample['not the baseline primary']}, brand red ${row.sample['not the brand red']}`,
      );
    }
    console.log('');
    if (failures.length > 0) {
      for (const failure of failures) console.error(`FAIL  ${failure}`);
      throw new Error(`${failures.length} preview(s) are missing, stale or not what the README promises`);
    }
    console.log(
      `10:screenshots OK — ${rows.length} preview(s) present, ${VIEWPORT.width}x${VIEWPORT.height}, ` +
        'no older than the pages and the contract they were rendered from, and each carries ' +
        'the declared palette on its pixels.',
    );
  }
} catch (err) {
  console.error(`\ngenerate-example-screenshots failed: ${err.message}`);
  process.exit(1);
}
