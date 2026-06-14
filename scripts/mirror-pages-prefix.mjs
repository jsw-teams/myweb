#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const prefix = 'myweb';
const mirrorDir = path.join(distDir, prefix);

async function copyEntry(entryName) {
  if (entryName === prefix) return;
  await fs.cp(path.join(distDir, entryName), path.join(mirrorDir, entryName), {
    recursive: true,
    force: true,
    dereference: true
  });
}

await fs.rm(mirrorDir, { recursive: true, force: true });
await fs.mkdir(mirrorDir, { recursive: true });

const entries = await fs.readdir(distDir);
await Promise.all(entries.map(copyEntry));

