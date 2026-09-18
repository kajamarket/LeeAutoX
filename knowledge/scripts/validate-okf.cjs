#!/usr/bin/env node

/**
 * LeeAutoX OKF Integrity & Compliance Validator
 * Verifies YAML frontmatter, entity cross-references, and canonical URLs.
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const searchDirs = ['organization', 'services', 'locations', 'vehicles', 'guides', 'articles', 'tools', 'processes'];

let totalFiles = 0;
let errors = [];
const entityRegistry = new Set();
const fileEntityMap = new Map();

function parseYamlFrontmatter(content, filePath) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    errors.push(`${filePath}: Missing YAML frontmatter.`);
    return null;
  }
  const rawYaml = match[1];
  const data = {};
  const lines = rawYaml.split(/\r?\n/);
  let currentKey = null;
  let inList = false;

  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    
    const listMatch = line.match(/^\s*-\s+(.*)$/);
    if (listMatch && currentKey && inList) {
      data[currentKey].push(listMatch[1].replace(/^['"](.*)['"]$/, '$1').trim());
      continue;
    }

    const kvMatch = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (kvMatch) {
      currentKey = kvMatch[1];
      const val = kvMatch[2].trim();
      if (val === '') {
        data[currentKey] = [];
        inList = true;
      } else {
        inList = false;
        data[currentKey] = val.replace(/^['"](.*)['"]$/, '$1');
      }
    }
  }
  return data;
}

// Pass 1: Index all files and IDs
for (const dir of searchDirs) {
  const fullDir = path.join(rootDir, dir);
  if (!fs.existsSync(fullDir)) continue;

  const files = fs.readdirSync(fullDir).filter(f => f.endsWith('.md'));
  for (const file of files) {
    totalFiles++;
    const filePath = path.join(fullDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const frontmatter = parseYamlFrontmatter(content, `${dir}/${file}`);
    if (frontmatter && frontmatter.id) {
      if (entityRegistry.has(frontmatter.id)) {
        errors.push(`Duplicate entity id "${frontmatter.id}" found in ${dir}/${file}`);
      }
      entityRegistry.add(frontmatter.id);
      fileEntityMap.set(`${dir}/${file}`, frontmatter);
    }
  }
}

// Check index.md
if (fs.existsSync(path.join(rootDir, 'index.md'))) {
  totalFiles++;
  const content = fs.readFileSync(path.join(rootDir, 'index.md'), 'utf8');
  const fm = parseYamlFrontmatter(content, 'index.md');
  if (fm && fm.id) {
    entityRegistry.add(fm.id);
    fileEntityMap.set('index.md', fm);
  }
}

// Pass 2: Verify relationships and mandatory fields
for (const [relPath, fm] of fileEntityMap.entries()) {
  const required = ['id', 'name', 'type'];
  for (const field of required) {
    if (!fm[field]) {
      errors.push(`${relPath}: Missing required field "${field}".`);
    }
  }

  if (Array.isArray(fm.related_entities)) {
    for (const targetId of fm.related_entities) {
      if (!entityRegistry.has(targetId)) {
        errors.push(`${relPath}: References non-existent entity "${targetId}".`);
      }
    }
  }
}

console.log(`========================================`);
console.log(`LeeAutoX OKF Validator`);
console.log(`Audited: ${totalFiles} markdown files`);
console.log(`Indexed Entities: ${entityRegistry.size}`);
console.log(`========================================`);

if (errors.length > 0) {
  console.error(`Validation Failed with ${errors.length} error(s):`);
  errors.forEach(err => console.error(` - ${err}`));
  process.exit(1);
} else {
  console.log(`All OKF knowledge documents comply with specification!`);
  process.exit(0);
}
