#!/usr/bin/env node
/**
 * One-command installer: installs root, backend, and frontend dependencies.
 * Usage: npm run install:all
 */
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const dirs = [
  { name: 'Root',    path: root,                          label: 'root' },
  { name: 'Backend', path: join(root, 'backend'),        label: 'backend' },
  { name: 'Frontend', path: join(root, 'frontend'),      label: 'frontend' },
];

console.log('\n========================================');
console.log('  Revenue Intelligence Inbox — Installer');
console.log('========================================\n');

for (const dir of dirs) {
  const pkgPath = join(dir.path, 'package.json');
  if (!existsSync(pkgPath)) {
    console.log(`  ⏭  ${dir.name}: no package.json found, skipping\n`);
    continue;
  }
  console.log(`  📦 Installing ${dir.name} dependencies...`);
  try {
    execSync('npm install', { cwd: dir.path, stdio: 'inherit' });
    console.log(`  ✅ ${dir.name} dependencies installed\n`);
  } catch (err) {
    console.error(`  ❌ ${dir.name} install failed: ${err.message}\n`);
    process.exit(1);
  }
}

console.log('========================================');
console.log('  All dependencies installed!');
console.log('  Run: npm run dev  (starts both servers)');
console.log('========================================\n');
