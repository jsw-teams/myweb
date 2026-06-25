import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('..', import.meta.url));

export async function readSiteConfig(root = projectRoot) {
  const raw = await fs.readFile(path.join(root, 'config.yml'), 'utf8');
  return parseSiteConfig(raw);
}

export function parseSiteConfig(raw) {
  return {
    siteUrl: readRequiredScalar(raw, 'siteUrl'),
    blogUrl: readRequiredScalar(raw, 'blogUrl'),
    defaultLocale: readScalar(raw, 'defaultLocale', 'zh-TW'),
    activeLocales: readList(raw, 'activeLocales', ['zh-CN', 'zh-TW', 'en']),
    siteName: readMap(raw, 'siteName'),
    shortName: readScalar(raw, 'shortName', 'JS.Gripe'),
    zhName: readMap(raw, 'zhName'),
    description: readMap(raw, 'description'),
    author: readMap(raw, 'author'),
    theme: { name: readNestedScalar(raw, 'theme', 'name', 'intro') },
    icons: readMap(raw, 'icons'),
    sitemap: { entryLimit: Number(readNestedScalar(raw, 'sitemap', 'entryLimit', '50000')) },
    robots: {
      header: readNestedList(raw, 'robots', 'header', []),
      contentSignal: readNestedScalar(raw, 'robots', 'contentSignal', 'ai-train=no, search=yes, ai-input=yes')
    },
    llms: readMap(raw, 'llms')
  };
}

function readScalar(raw, key, fallback = '') {
  const match = raw.match(new RegExp(`^${escapeRegExp(key)}:\\s*(.+?)\\s*$`, 'm'));
  return match ? unquote(match[1]) : fallback;
}

function readRequiredScalar(raw, key) {
  const value = readScalar(raw, key);
  if (!value) throw new Error(`Missing required config.yml field: ${key}`);
  return value;
}

function readNestedScalar(raw, section, key, fallback = '') {
  const block = readBlock(raw, section, 0);
  const match = block.match(new RegExp(`^  ${escapeRegExp(key)}:\\s*(.+?)\\s*$`, 'm'));
  return match ? unquote(match[1]) : fallback;
}

function readMap(raw, key) {
  const block = readBlock(raw, key, 0);
  const values = {};
  for (const line of block.split(/\r?\n/)) {
    const match = line.match(/^  ([\w-]+):\s*(.+?)\s*$/);
    if (match) values[match[1]] = unquote(match[2]);
  }
  return values;
}

function readList(raw, key, fallback = []) {
  const block = readBlock(raw, key, 0);
  const values = [];
  for (const line of block.split(/\r?\n/)) {
    const match = line.match(/^  -\s*(.+?)\s*$/);
    if (match) values.push(unquote(match[1]));
  }
  return values.length ? values : fallback;
}

function readNestedList(raw, section, key, fallback = []) {
  const block = readBlock(raw, section, 0);
  const nested = readBlock(block, key, 2);
  const values = [];
  for (const line of nested.split(/\r?\n/)) {
    const match = line.match(/^    -\s*(.+?)\s*$/);
    if (match) values.push(unquote(match[1]));
  }
  return values.length ? values : fallback;
}

function readBlock(raw, key, indent) {
  const spaces = ' '.repeat(indent);
  const start = raw.search(new RegExp(`^${spaces}${escapeRegExp(key)}:\\s*$`, 'm'));
  if (start < 0) return '';
  const rest = raw.slice(start).split(/\r?\n/).slice(1);
  const lines = [];
  for (const line of rest) {
    if (line.trim() && !line.startsWith(`${spaces}  `)) break;
    lines.push(line);
  }
  return lines.join('\n');
}

function unquote(value) {
  return String(value).trim().replace(/^["']|["']$/g, '');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
