#!/usr/bin/env node
/**
 * 4:capture — render every reference page and record what the browser actually
 * computed, so the visual comparison in step 5 is based on measurement rather
 * than on reading the source.
 *
 * Why it works this way
 * ---------------------
 * The audit script must run *inside* the page, in the page's own URL context, so
 * that its relative stylesheet links resolve exactly as they would for a person
 * opening the file. Copying the pages into a scratch directory would break those
 * links, so instead this script serves the repository over a loopback HTTP server
 * and injects the audit function into the HTML response on the fly. The files on
 * disk are never modified.
 *
 * The browser is driven with `--headless=new` and `--dump-dom` / `--screenshot`,
 * which need no WebSocket client and no third-party dependency. A throwaway
 * `--user-data-dir` is used so the operator's own browser profile is untouched.
 *
 * Output
 * ------
 *   arcopro/reports/evidence/captures/<page>.json   measured computed styles
 *   arcopro/reports/evidence/captures/<page>.png    viewport screenshot
 *
 * Run: npm run 4:capture
 */

import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile, rm, mkdtemp } from 'node:fs/promises';

import { readPng, cropPngToHeight } from '../lib/png.mjs';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { REPO_ROOT, PACKAGES, requestedPackages } from '../lib/design-system.mjs';

/** Viewport matching the reference-site capture, which required >= 1100px. */
const VIEWPORT = { width: 1270, height: 848 };

/**
 * `--window-size` sizes the browser window, not the page viewport: in
 * `--headless=new` on macOS the window frame costs height the page never sees.
 * Measured on Chrome 153 by requesting 1270x935 and reading back
 * `innerWidth`/`innerHeight`, that cost was 87px, which is the default below.
 *
 * It is not a constant of the browser: it moves with the desktop state (a
 * running Chrome session, a window clamped by the display, a changed toolbar).
 * So the default is only a starting point — every page is calibrated against the
 * viewport the page really gets, and the capture is re-taken with a corrected
 * window height until the viewport matches. A capture that never reaches the
 * reference viewport fails rather than being written, because a picture taken in
 * a different viewport cannot be compared with the reference pixel for pixel.
 *
 * Because the window is taller than the viewport by that cost, Chrome's
 * screenshot comes back taller as well; the picture is cropped back to the
 * viewport before it is kept, so a stored screenshot spans exactly what the page
 * rendered.
 */
const WINDOW_CHROME_PX = 87;

/** How many times one page may be re-taken while the viewport is calibrated. */
const CALIBRATION_ATTEMPTS = 5;

/** The reference pages of one package, in the order they are captured. */
const pagesFor = (pkg) => [
  { id: 'dashboard', file: `${pkg}/examples/dashboard.html` },
  { id: 'list', file: `${pkg}/examples/list-page.html` },
  { id: 'form', file: `${pkg}/examples/form-page.html` },
  { id: 'detail', file: `${pkg}/examples/detail-page.html` },
  { id: 'components', file: `${pkg}/examples/components.html` },
  { id: 'index', file: `${pkg}/examples/index.html` },
];

/** Where one package's captures are written. */
const outDirFor = (pkg) => path.join(REPO_ROOT, pkg, 'reports', 'evidence', 'captures');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.md': 'text/markdown; charset=utf-8',
};

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

function findChrome() {
  for (const candidate of CHROME_CANDIDATES) if (existsSync(candidate)) return candidate;
  return null;
}

// ---------------------------------------------------------------------------
// the in-page audit
// ---------------------------------------------------------------------------

/**
 * Runs inside the page. Mirrors the element list used when the Arco Pro
 * reference pages were measured, so step 5 compares like with like: structural
 * landmarks plus the first instance of each repeating control.
 */
const AUDIT_SCRIPT = `
<script>
(function () {
  var PROPS = [
    'display','position','top','left','right','bottom','zIndex','boxSizing',
    'width','height','minWidth','paddingTop','paddingRight','paddingBottom','paddingLeft',
    'marginTop','marginRight','marginBottom','marginLeft','gap','gridTemplateColumns',
    'backgroundColor','color','border','borderTop','borderBottom','borderLeft','borderRight',
    'borderRadius','boxShadow','fontSize','fontWeight','lineHeight','fontFamily','fontFeatureSettings',
    'textAlign','alignItems','justifyContent','overflow','flexDirection',
    /* the shell's edges are 1px rules, so their widths and colours are evidence
       in their own right and not only their shorthand */
    'borderTopWidth','borderRightWidth','borderBottomWidth','borderLeftWidth',
    'borderBottomColor','borderRightColor'
  ];
  var TARGETS = [
    ['root', 'html'],
    ['shell', '.shell'],
    ['header', '.shell__header'],
    ['brand', '.brand'],
    ['brandMark', '.brand__mark'],
    ['brandName', '.brand__name'],
    ['headerSearch', '.header-search'],
    ['headerSearchInput', '.header-search input'],
    ['headerTools', '.header-tools'],
    ['iconButton', '.icon-button'],
    ['avatar', '.avatar'],
    ['sider', '.shell__sidebar'],
    ['menuWrap', '.sidebar__scroll'],
    ['menuGroup', '.menu-group'],
    ['menuGroupLabel', '.menu-group__label'],
    ['menuItem', '.menu-item'],
    ['menuSelected', '.menu-item--selected'],
    ['content', '.shell__content'],
    ['contentInner', '.shell__content-inner'],
    ['breadcrumb', '.breadcrumb'],
    ['breadcrumbHome', '.breadcrumb__home'],
    ['breadcrumbSep', '.breadcrumb__sep'],
    ['breadcrumbLast', '.breadcrumb__current'],
    ['hero', '.hero'],
    ['heroName', '.hero__name'],
    ['heroMeta', '.hero__meta'],
    ['card', '.card'],
    ['cardHead', '.card__head'],
    ['cardTitle', '.card__title'],
    ['cardSurfaceMock', '.surface-mock--card'],
    ['divider', '.divider'],
    ['dividerVertical', '.divider--vertical'],
    ['btnPrimary', '.btn--primary'],
    ['btnSecondary', '.btn--secondary'],
    ['btnText', '.btn--text'],
    ['btnLg', '.btn--lg'],
    ['btnSm', '.btn--sm'],
    ['btnGroup', '.btn-group'],
    ['input', '.input'],
    ['select', '.select'],
    ['selectPlaceholder', '.select--placeholder'],
    ['textarea', '.textarea'],
    ['fieldLabel', '.field__label'],
    ['fieldHint', '.field__hint'],
    ['formGrid', '.form-grid'],
    ['formActions', '.form-actions'],
    ['search', '.search'],
    ['searchFields', '.search__fields'],
    ['searchLabel', '.search-field__label'],
    ['searchControl', '.search-field__control'],
    ['searchActions', '.search__actions'],
    ['toolbar', '.toolbar'],
    ['tableWrap', '.table-wrap'],
    ['table', '.table'],
    ['tableSort', '.table__sort'],
    ['tableEmpty', '.table__empty'],
    ['theadCell', '.table th'],
    ['bodyRow', '.table tbody tr'],
    ['bodyCell', '.table td'],
    ['status', '.status'],
    ['statusDot', '.status__dot'],
    ['tag', '.tag'],
    ['tagSuccess', '.tag--success'],
    ['tagWarning', '.tag--warning'],
    ['tagError', '.tag--error'],
    ['alert', '.alert'],
    ['alertSuccess', '.alert--success'],
    ['pagination', '.pagination'],
    ['paginationItem', '.pagination__item'],
    ['paginationActive', '.pagination__item--active'],
    ['dashboard', '.dashboard'],
    ['dashboardMain', '.dashboard__main'],
    ['dashboardRail', '.dashboard__rail'],
    ['railList', '.rail-list'],
    ['railNote', '.rail-note'],
    ['kpiRow', '.kpi-row'],
    ['kpi', '.kpi'],
    ['kpiIcon', '.kpi__icon'],
    ['kpiTitle', '.kpi__title'],
    ['kpiValue', '.kpi__value'],
    ['kpiUnit', '.kpi__unit'],
    ['chartHead', '.chart-head'],
    ['chartTitle', '.chart-title'],
    ['chartSubtitle', '.chart-subtitle'],
    ['steps', '.steps'],
    ['step', '.step'],
    ['stepIndex', '.step__index'],
    ['stepLine', '.step__line'],
    ['stepTitle', '.step__title'],
    ['stepActive', '.step--active'],
    ['stepDone', '.step--done'],
    ['descGrid', '.desc-grid'],
    ['descLabel', '.desc__label'],
    ['descValue', '.desc__value'],
    ['swatch', '.swatch'],
    ['swatchChip', '.swatch__chip'],
    ['swatchMeta', '.swatch__meta'],
    ['typeSample', '.type-sample'],
    ['typeSampleMeta', '.type-sample__meta'],
    ['tooltipBubble', '.tooltip-bubble'],
    ['modalDemo', '.modal-demo'],
    ['modalHeader', '.modal-demo__header'],
    ['modalBody', '.modal-demo__body'],
    ['modalFooter', '.modal-demo__footer'],
    ['popupDemo', '.popup-demo'],
    ['switch', '.switch'],
    ['checkboxBox', '.checkbox__box'],
    ['radioDot', '.radio__dot'],
    ['specRow', '.spec-row'],
    ['specLabel', '.spec-label']
  ];

  /* [name, host selector, pseudo-element]. A rule drawn by a pseudo-element has
     no layout box, so this is the only way to read where it resolved. */
  var PSEUDO_TARGETS = [
    ['sidebarRule', '.shell__sidebar', '::after']
  ];
  var PSEUDO_PROPS = ['content', 'position', 'top', 'right', 'bottom', 'left', 'width', 'height', 'backgroundColor'];

  function read(el) {
    if (!el) return null;
    var cs = getComputedStyle(el);
    var rect = el.getBoundingClientRect();
    var out = {
      selector: null,
      tag: el.tagName.toLowerCase(),
      id: el.id || null,
      className: typeof el.className === 'string' ? el.className : null,
      rect: {
        x: Math.round(rect.x * 100) / 100,
        y: Math.round(rect.y * 100) / 100,
        width: Math.round(rect.width * 100) / 100,
        height: Math.round(rect.height * 100) / 100
      },
      style: {}
    };
    for (var i = 0; i < PROPS.length; i++) {
      var p = PROPS[i];
      var v = cs[p];
      if (v !== undefined && v !== null && v !== '') out.style[p] = v;
    }
    return out;
  }

  function measure() {
    var result = {
      /* The page's own path, not location.href: the capture is served on an
         ephemeral loopback port, and a port number in a committed evidence file
         would make every run produce a diff without a measurement changing. */
      page: location.pathname,
      viewport: { width: window.innerWidth, height: window.innerHeight },
      devicePixelRatio: window.devicePixelRatio,
      scrollWidth: document.documentElement.scrollWidth,
      scrollHeight: document.documentElement.scrollHeight,
      metrics: {},
      pseudo: {}
    };
    for (var i = 0; i < TARGETS.length; i++) {
      var name = TARGETS[i][0];
      var sel = TARGETS[i][1];
      var m = null;
      try { m = read(document.querySelector(sel)); } catch (e) { m = null; }
      if (m) { m.selector = sel; result.metrics[name] = m; }
    }

    /* A rule drawn by a pseudo-element has no layout box at all, so no element
       reading can locate it. These few are recorded here so the comparison can
       state where the rule resolved instead of inferring it from pixels alone. */
    for (var j = 0; j < PSEUDO_TARGETS.length; j++) {
      var pname = PSEUDO_TARGETS[j][0];
      var psel = PSEUDO_TARGETS[j][1];
      var ppseudo = PSEUDO_TARGETS[j][2];
      var host = document.querySelector(psel);
      if (!host) continue;
      var pcs = getComputedStyle(host, ppseudo);
      var entry = { selector: psel, pseudo: ppseudo, style: {} };
      for (var k = 0; k < PSEUDO_PROPS.length; k++) {
        entry.style[PSEUDO_PROPS[k]] = pcs[PSEUDO_PROPS[k]];
      }
      entry.host = read(host);
      result.pseudo[pname] = entry;
    }
    var slot = document.getElementById('__arcopro_audit__');
    if (!slot) {
      slot = document.createElement('script');
      slot.type = 'application/json';
      slot.id = '__arcopro_audit__';
      document.body.appendChild(slot);
    }
    slot.textContent = JSON.stringify(result);
  }

  measure();
  window.addEventListener('load', measure);
})();
</script>
`;

function instrument(html) {
  if (html.includes('<script>\n(function () {\n  var PROPS')) return html;
  return html.replace(/<\/body>/i, `${AUDIT_SCRIPT}\n</body>`);
}

// ---------------------------------------------------------------------------
// static server with on-the-fly instrumentation
// ---------------------------------------------------------------------------

const targetPaths = new Set(
  PACKAGES.flatMap((pkg) => pagesFor(pkg)).map((p) => `/${p.file}`),
);

function startServer() {
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://127.0.0.1');
      const relPath = decodeURIComponent(url.pathname).replace(/^\/+/, '');
      const abs = path.resolve(REPO_ROOT, relPath);
      if (!abs.startsWith(REPO_ROOT)) {
        res.writeHead(403).end('forbidden');
        return;
      }
      const ext = path.extname(abs).toLowerCase();
      res.setHeader('Content-Type', MIME[ext] ?? 'application/octet-stream');

      // Read fully rather than streaming: a stream emits ENOENT asynchronously,
      // after this try/catch has returned, which crashes the process on any
      // missing request such as the browser's automatic /favicon.ico.
      const body =
        targetPaths.has('/' + relPath) && ext === '.html'
          ? Buffer.from(instrument(await readFile(abs, 'utf8')), 'utf8')
          : await readFile(abs);
      res.end(body);
    } catch (err) {
      res.writeHead(err.code === 'ENOENT' ? 404 : 500).end(String(err.message));
    }
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }));
  });
}

// ---------------------------------------------------------------------------
// headless Chrome
// ---------------------------------------------------------------------------

/**
 * Run one headless Chrome task and return its standard output.
 *
 * Chrome on macOS does not terminate after `--dump-dom` or `--screenshot`: it
 * writes its complete result and then stays alive with no display attached. So
 * completion is detected from the result itself rather than from process exit:
 * the DOM dump is complete at `</html>`, and a written PNG is complete at its
 * `IEND` chunk. Once the result is complete the whole process group is killed.
 *
 * The child is spawned detached so that `process.kill(-pid)` reaches Chrome's
 * helper processes as well; a stray helper would keep holding the profile
 * directory. `hardTimeoutMs` bounds a run that never produces its terminator.
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
      settle(reject, new Error(`headless Chrome timed out after ${hardTimeoutMs}ms\n${stderr.slice(0, 600)}`));
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
          // a PNG is complete once its IEND chunk is present
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

/** Flags shared by both Chrome invocations, plus the throwaway profile. */
function baseFlags(profileDir, chromePx = WINDOW_CHROME_PX) {
  return [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    // A throwaway profile would otherwise ask the login keychain for its
    // "Chrome Safe Storage" secret on every run — a prompt nobody should have to
    // answer for a build step. The mock keychain keeps the profile throwaway.
    '--use-mock-keychain',
    `--window-size=${VIEWPORT.width},${VIEWPORT.height + chromePx}`,
    `--user-data-dir=${profileDir}`,
  ];
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

async function main() {
  const chrome = findChrome();
  if (!chrome) {
    throw new Error(
      'no headless-capable browser found. Set CHROME_PATH to a Chromium-based ' +
        'binary to run the visual capture.',
    );
  }

  const packages = requestedPackages();
  const profileDir = await mkdtemp(path.join(tmpdir(), 'jiean-design-system-chrome-'));
  const { server, port } = await startServer();
  console.log(`browser : ${chrome}`);
  console.log(`server  : http://127.0.0.1:${port} (repository root)`);
  console.log(`viewport: ${VIEWPORT.width}x${VIEWPORT.height}`);
  console.log('');

  const captured = [];

  try {
    for (const [pkgIndex, pkg] of packages.entries()) {
      const pages = pagesFor(pkg);
      const outDir = outDirFor(pkg);
      await mkdir(outDir, { recursive: true });
      const summary = [];
      const viewportWarnings = [];
      if (pkgIndex > 0) console.log('');
      console.log(`package : ${pkg}`);

      for (const page of pages) {
      const url = `http://127.0.0.1:${port}/${page.file}`;
      const jsonPath = path.join(outDir, `${page.id}.json`);
      const pngPath = path.join(outDir, `${page.id}.png`);
      /* Chrome writes --screenshot straight to this path, and the readiness
         check looks for a complete PNG on it. A PNG left over from an earlier
         run already ends with IEND, so the check would pass before Chrome has
         written anything and the process group would be killed mid-write,
         leaving the previous run's picture in place. Clearing the target first
         makes an incomplete or stale PNG impossible to mistake for the new one. */
      await rm(pngPath, { force: true });

      /* Calibrate the window height for this page before taking its picture.
         The frame's cost in pixels is measured, not assumed: the DOM pass reports
         the viewport the page really got, and the window is resized by exactly the
         shortfall before the next attempt. Only a page that landed on the
         reference viewport is screenshotted. */
      let chromePx = WINDOW_CHROME_PX;
      let audit = null;
      for (let attempt = 1; attempt <= CALIBRATION_ATTEMPTS; attempt += 1) {
        const dom = await runChrome(
          chrome,
          [...baseFlags(profileDir, chromePx), '--virtual-time-budget=4000', '--dump-dom', url],
          { resolveOn: 'dom' },
        );

        const m = dom.stdout.match(
          /<script type="application\/json" id="__arcopro_audit__">([\s\S]*?)<\/script>/,
        );
        if (!m) {
          throw new Error(
            `no audit payload found in the DOM for ${page.id}; ` +
              'the page may not have rendered (check that it has no unclosed tag)',
          );
        }
        audit = JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&'));

        const got = audit.viewport;
        if (got.height === VIEWPORT.height && got.width === VIEWPORT.width) break;
        const shortfall = VIEWPORT.height - got.height;
        if (attempt === CALIBRATION_ATTEMPTS) {
          throw new Error(
            `${page.id}: the page sees a ${got.width}x${got.height} viewport after ` +
              `${CALIBRATION_ATTEMPTS} attempts with window heights of ` +
              `${VIEWPORT.height + chromePx - shortfall}px and ${VIEWPORT.height + chromePx}px. ` +
              'The window is being clamped by the desktop, and a capture taken now would not ' +
              'be comparable with the reference. Close the other browser windows and re-run.',
          );
        }
        console.log(
          `${page.id.padEnd(11)} viewport ${got.width}x${got.height} — ` +
            `re-taking with a window ${shortfall >= 0 ? 'taller' : 'shorter'} by ` +
            `${Math.abs(shortfall)}px`,
        );
        chromePx += shortfall;
      }

      await runChrome(
        chrome,
        [
          ...baseFlags(profileDir, chromePx),
          '--virtual-time-budget=4000',
          `--screenshot=${pngPath}`,
          url,
        ],
        { resolveOn: 'png', pngPath },
      );

      /* Chrome writes the screenshot as tall as the window it was given, so the
         picture carries the window frame's height that the page never sees: a
         1270x848 viewport comes back 1270x935 with the viewport in its top 848
         rows. Cropping to the viewport the page actually rendered at keeps the
         stored picture directly comparable with a reference screenshot. */
      const shot = readPng(pngPath);
      const size = { width: shot.width, height: shot.height };
      if (size.width !== VIEWPORT.width) {
        throw new Error(
          `${page.id}: the screenshot is ${size.width}x${size.height} when ` +
            `${VIEWPORT.width}x${VIEWPORT.height} was requested; refusing to keep a screenshot ` +
            'that may be stale',
        );
      }
      if (size.height !== VIEWPORT.height) {
        if (size.height < VIEWPORT.height) {
          throw new Error(
            `${page.id}: the screenshot is only ${size.height}px tall, shorter than the ` +
              `${VIEWPORT.height}px viewport it should contain`,
          );
        }
        const cropped = cropPngToHeight(shot, VIEWPORT.height, pngPath);
        size.height = cropped.height;
        const check = readPng(pngPath);
        if (check.height !== VIEWPORT.height || check.pixel(0, 0) !== shot.pixel(0, 0)) {
          throw new Error(`${page.id}: cropping the screenshot to the viewport did not round-trip`);
        }
      }
      await writeFile(jsonPath, `${JSON.stringify(audit, null, 2)}\n`, 'utf8');

      const measured = Object.keys(audit.metrics).length;
      const vp = audit.viewport;
      const viewportNote =
        vp.width === VIEWPORT.width && vp.height === VIEWPORT.height
          ? `${vp.width}x${vp.height}`
          : `${vp.width}x${vp.height} (expected ${VIEWPORT.width}x${VIEWPORT.height})`;
      if (vp.width !== VIEWPORT.width || vp.height !== VIEWPORT.height) {
        viewportWarnings.push(`${page.id}: viewport ${vp.width}x${vp.height}`);
      }
      if (vp.width < 1100) {
        throw new Error(
          `${page.id} rendered in a ${vp.width}px-wide viewport, but this design system is ` +
            'not responsive below 1100px — the measurement would not describe the real layout.',
        );
      }

      const pngBytes = (await readFile(pngPath)).length;
      summary.push({ id: page.id, measured, viewport: vp, png: size, bytes: pngBytes, windowChromePx: chromePx });
      console.log(
        `${page.id.padEnd(11)} ${String(measured).padStart(3)} elements measured  ` +
          `${size ? `${size.width}x${size.height}` : '??'} png  viewport ${viewportNote}`,
      );
    }
      const thin = summary.filter((s) => s.measured < 15);
      if (thin.length > 0) {
        throw new Error(
          `too few elements matched on: ${thin.map((s) => `${s.id} (${s.measured})`).join(', ')}. ` +
            'A page whose selectors do not match produces an empty comparison, which would ' +
            'silently pass step 5.',
        );
      }

      await writeFile(
        path.join(outDir, 'capture-summary.json'),
        `${JSON.stringify(
          {
            package: pkg,
            requestedViewport: VIEWPORT,
            windowChromePxDefault: WINDOW_CHROME_PX,
            browser: chrome,
            viewportMismatches: viewportWarnings,
            pages: summary,
          },
          null,
          2,
        )}\n`,
        'utf8',
      );

      if (viewportWarnings.length > 0) {
        console.log('');
        console.log('WARNING — captured viewport differs from the reference viewport:');
        for (const w of viewportWarnings) console.log(`  ${w}`);
        console.log(
          'Re-calibrate WINDOW_CHROME_PX in this file, or record the difference in ' +
            'reports/visual-validation.md, before trusting a pixel-for-pixel comparison.',
        );
      }

      captured.push({ pkg, pages: summary.length, outDir });
    }
  } finally {
    server.close();
    await rm(profileDir, { recursive: true, force: true });
  }

  console.log('');
  for (const c of captured) {
    console.log(
      `  ${c.pkg.padEnd(10)} ${c.pages} pages → ${path.relative(REPO_ROOT, c.outDir)}`,
    );
  }
  console.log(
    `4:capture OK — ${captured.reduce((n, c) => n + c.pages, 0)} pages for ${packages.length} package(s).`,
  );
}

main().catch((err) => {
  console.error(`\ncapture-screenshots failed: ${err.message}`);
  process.exit(1);
});
