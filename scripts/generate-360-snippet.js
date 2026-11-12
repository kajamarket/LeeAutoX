#!/usr/bin/env node
/**
 * CLI 360 Snippet Generator
 * Usage:
 *   node scripts/generate-360-snippet.js --id 12 --frames 36 --ext jpg --panoee https://tour.panoee.com/...
 */

const args = process.argv.slice(2);
function getArg(name, defaultValue = '') {
  const index = args.findIndex(a => a === `--${name}` || a.startsWith(`--${name}=`));
  if (index === -1) return defaultValue;
  const val = args[index];
  if (val.includes('=')) return val.split('=')[1];
  return args[index + 1] || defaultValue;
}

const id = getArg('id', '1');
const frames = parseInt(getArg('frames', '36'), 10);
const ext = getArg('ext', 'jpg');
const customFilename = getArg('filename', '');
let folder = getArg('folder', `/cars/${id}/exterior/`);
if (!folder.endsWith('/')) folder += '/';
const panoee = getArg('panoee', '');
const demo = args.includes('--demo') || getArg('demo') === 'true';

const hasExterior = Boolean(folder);
const hasInterior = Boolean(panoee);

console.log('\n--- Paste this snippet into car ' + id + ' in src/data/inventory.ts ---\n');

let lines = [];
lines.push('    view360: {');

if (hasExterior) {
  lines.push('      exterior: {');
  lines.push(`        folder: "${folder}",`);
  if (customFilename) {
    lines.push(`        filename: "${customFilename}",`);
  } else if (ext !== 'jpg') {
    lines.push(`        ext: "${ext}",`);
  }
  lines.push(`        amount: ${frames}${demo ? ',' : ''}`);
  if (demo) {
    lines.push('        demo: true');
  }
  lines.push(`      }${hasInterior ? ',' : ''}`);
}

if (hasInterior) {
  lines.push('      interior: {');
  if (panoee.includes('<iframe') || panoee.includes('src=')) {
    lines.push(`        embed: '${panoee}'`);
  } else {
    lines.push(`        embed: '<iframe src="${panoee}" width="100%" height="100%" frameborder="0" allowfullscreen allow="accelerometer; gyroscope; magnetometer; xr-spatial-tracking"></iframe>'`);
  }
  lines.push('      }');
}

lines.push('    }');

console.log(lines.join('\n'));
console.log('\n--------------------------------------------------------------\n');
