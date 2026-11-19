import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}
function ok(message) {
  console.log(`  ✓ ${message}`);
}
function fail(message) {
  failures.push(message);
  console.error(`  ✗ ${message}`);
}
function exists(file) {
  return fs.existsSync(path.join(root, file));
}

const skill = read('SKILL.md');
const agents = read('AGENTS.md');
const prompt = read('prompt.md');
const readme = read('README.md');
const css = read('assets/ember.css');
const guide = read('assets/styleguide.html');
const index = read('index.html');

console.log('\nEmber Pixel checks');

// 1. tokens
const tokens = {
  '--ep-bg': '#060606',
  '--ep-panel': '#0b0b0a',
  '--ep-ember': '#fc5c1e',
  '--ep-cream': '#f7f1e7',
  '--ep-muted': '#b7ac9e',
  '--ep-dim': '#8a7f72',
  '--ep-danger': '#ff3b24',
};
for (const [token, value] of Object.entries(tokens)) {
  const pattern = new RegExp(`${token}:\\s*${value};`, 'i');
  if (pattern.test(css)) ok(`${token} = ${value}`);
  else fail(`${token} missing or changed in ember.css`);
}

// 2. every adapter carries the same core
for (const [name, text] of Object.entries({ SKILL: skill, AGENTS: agents, prompt })) {
  for (const hex of ['#060606', '#FC5C1E', '#F7F1E7']) {
    if (text.toLowerCase().includes(hex.toLowerCase())) ok(`${name}: ${hex}`);
    else fail(`${name} is missing ${hex}`);
  }
  for (const font of ['Doto', 'Silkscreen', 'Fusion Pixel']) {
    if (text.includes(font)) ok(`${name}: ${font}`);
    else fail(`${name} is missing ${font}`);
  }
  if (text.includes('steps(')) ok(`${name}: steps()`);
  else fail(`${name} is missing steps() motion`);
}

// 3. library features
for (const selector of ['.ep-menu', '.ep-tip', '.ep-pagination', '.ep-skeleton', '.ep-legend', '.ep-on-ember', '.ep-table-wrap:focus-visible']) {
  if (css.includes(selector)) ok(`css: ${selector}`);
  else fail(`css is missing ${selector}`);
}

// 4. guide surface
for (const [label, needle] of [
  ['Open Graph image', 'og:image'],
  ['favicon', 'favicon.svg'],
  ['web font subset', 'Fusion Pixel Web'],
  ['theme-color', 'theme-color'],
]) {
  if (guide.includes(needle)) ok(`guide: ${label}`);
  else fail(`guide is missing ${label}`);
}
const tableWraps = (guide.match(/ep-table-wrap/g) || []).length;
const focusableWraps = (guide.match(/ep-table-wrap[^>]*tabindex="0"/g) || []).length;
if (tableWraps === 3 && focusableWraps === 3) ok('all table wrappers are keyboard focusable');
else fail(`table wrappers: ${focusableWraps}/${tableWraps} focusable`);
if ((guide.match(/inert/g) || []).length >= 5) ok('illustrative demos are inert');
else fail('illustrative demos are missing inert');
if (guide.includes('prefers-reduced-motion') && guide.includes('reduceMotion.matches')) ok('reduced motion handled in CSS and JS');
else fail('reduced motion is not handled in both CSS and JS');

// 5. redirect keeps deep links
if (index.includes('location.hash')) ok('redirect preserves the hash');
else fail('redirect drops the hash');

// 6. docs and deliverable files
for (const file of [
  'LICENSE', 'CHANGELOG.md', 'CONTRIBUTING.md', '404.html', 'index.html',
  'docs/og.png', 'assets/favicon.svg',
  'assets/fonts/FusionPixel-12px-SC-web.woff2',
  'scripts/check-docs.mjs', 'scripts/check-subset.py', 'scripts/build-subset.py',
  '.github/workflows/checks.yml',
]) {
  if (exists(file)) ok(`file: ${file}`);
  else fail(`missing file: ${file}`);
}

// 7. README
if (readme.includes('MIT')) ok('README declares MIT');
else fail('README does not declare MIT');
if (readme.includes('https://seaison.github.io/ember-pixel/')) ok('README links the live guide');
else fail('README is missing the live guide link');

// 8. local README links resolve
const linkPattern = /\]\(([^)]+)\)/g;
let match;
while ((match = linkPattern.exec(readme)) !== null) {
  const target = match[1];
  if (/^(https?:|mailto:|#)/.test(target)) continue;
  const clean = decodeURI(target.split('#')[0]);
  if (!exists(clean)) fail(`README link does not resolve: ${target}`);
}

// 9. local guide assets resolve
const attrPattern = /(?:href|src)="([^"]+)"/g;
while ((match = attrPattern.exec(guide)) !== null) {
  const target = match[1];
  if (/^(https?:|data:|#|\/)/.test(target)) continue;
  const clean = target.split('#')[0];
  if (!fs.existsSync(path.join(root, 'assets', clean))) fail(`guide asset does not resolve: ${target}`);
}

console.log('');
if (failures.length) {
  console.error(`${failures.length} check(s) failed.`);
  process.exit(1);
}
console.log('All checks passed.');
