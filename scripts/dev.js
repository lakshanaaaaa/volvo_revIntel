#!/usr/bin/env node
/**
 * Single-command dev launcher: starts both backend (Express) and frontend (Vite)
 * concurrently in the same terminal with colored output.
 *
 * Usage:
 *   npm run dev          → starts both backend + frontend
 *   npm run dev:backend  → backend only
 *   npm run dev:frontend → frontend only
 *   npm start            → alias for npm run dev
 */
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const backendDir = join(root, 'backend');
const frontendDir = join(root, 'frontend');

const args = process.argv.slice(2);
const onlyBackend = args.includes('--backend');
const onlyFrontend = args.includes('--frontend');
const runBoth = !onlyBackend && !onlyFrontend;

const processes = [];

function tag(name, color) {
  const colors = {
    backend:  '\x1b[34m',   // blue
    frontend: '\x1b[32m',   // green
    reset:    '\x1b[0m',
  };
  return `${colors[name] || ''}[${name.toUpperCase()}]${colors.reset}`;
}

function startProcess(name, cwd, cmd, cmdArgs) {
  const proc = spawn(cmd, cmdArgs, {
    cwd,
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: true,
    env: { ...process.env, FORCE_COLOR: '1' },
  });

  proc.stdout.on('data', (data) => {
    data.toString().split('\n').forEach(line => {
      if (line.trim()) console.log(`${tag(name)} ${line}`);
    });
  });

  proc.stderr.on('data', (data) => {
    data.toString().split('\n').forEach(line => {
      if (line.trim()) console.log(`${tag(name)} ${line}`);
    });
  });

  proc.on('close', (code) => {
    console.log(`${tag(name)} exited with code ${code}`);
    processes.forEach(p => p.kill());
    process.exit(code);
  });

  processes.push(proc);
  return proc;
}

console.log('\n\x1b[36m========================================\x1b[0m');
console.log('\x1b[36m  Revenue Intelligence Inbox — Dev Server\x1b[0m');
console.log('\x1b[36m========================================\x1b[0m\n');

if (runBoth || onlyBackend) {
  console.log('  Starting backend  → http://localhost:3001');
  startProcess('backend', backendDir, 'npm', ['run', 'dev']);
}

if (runBoth || onlyFrontend) {
  console.log('  Starting frontend → http://localhost:5173\n');
  // Small delay so backend starts first
  setTimeout(() => {
    startProcess('frontend', frontendDir, 'npm', ['run', 'dev']);
  }, runBoth ? 2000 : 0);
}

if (runBoth) {
  console.log('\n  Both servers starting. Press Ctrl+C to stop.\n');
}

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n  Shutting down...');
  processes.forEach(p => p.kill());
  process.exit(0);
});
