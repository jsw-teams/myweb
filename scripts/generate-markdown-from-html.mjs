#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const distDir = path.join(root, 'dist');

async function main() {
  const htmlFiles = await findFiles(distDir, (file) => file.endsWith('.html'));
  let count = 0;

  for (const file of htmlFiles) {
    const relative = toPosix(path.relative(distDir, file));
    if (relative === '404.html') continue;

    const html = await fs.readFile(file, 'utf8');
    const markdownHref = getMarkdownHref(html);

    if (!markdownHref) continue;

    const markdownPath = hrefToDistPath(markdownHref);
    const mainHtml = getMainHtml(html);
    const markdown = htmlToMarkdown(mainHtml);

    await fs.mkdir(path.dirname(markdownPath), { recursive: true });
    await fs.writeFile(markdownPath, `${markdown.trim()}\n`, 'utf8');
    count += 1;
  }

  console.log(`Generated Markdown mirrors from HTML: ${count} file(s).`);
}

async function findFiles(dir, include) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...await findFiles(full, include));
      continue;
    }

    if (entry.isFile() && include(full)) {
      files.push(full);
    }
  }

  return files;
}

function getMarkdownHref(html) {
  const links = [...html.matchAll(/<link\b[^>]*>/gi)].map((match) => match[0]);

  for (const link of links) {
    const rel = getAttr(link, 'rel');
    const type = getAttr(link, 'type');
    const href = getAttr(link, 'href');

    if (!rel || !type || !href) continue;

    const isAlternate = rel.split(/\s+/).some((item) => item.toLowerCase() === 'alternate');
    if (isAlternate && type.toLowerCase() === 'text/markdown') {
      return href;
    }
  }

  return '';
}

function hrefToDistPath(href) {
  const url = new URL(href, 'https://js.gripe/');
  const pathname = decodeURIComponent(url.pathname).replace(/^\/+/, '');
  return path.join(distDir, pathname);
}

function getMainHtml(html) {
  const match = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  return match ? match[1] : html;
}

function htmlToMarkdown(input) {
  let html = input;

  html = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, '')
    .replace(/<picture\b[\s\S]*?<\/picture>/gi, '')
    .replace(/<img\b[^>]*>/gi, '')
    .replace(/<nav\b[^>]*class=["'][^"']*language-links[^"']*["'][\s\S]*?<\/nav>/gi, '')
    .replace(/<div\b[^>]*class=["'][^"']*language-links[^"']*["'][\s\S]*?<\/div>/gi, '');

  html = html.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (_, attrs, text) => {
    const href = getAttrFromAttrs(attrs, 'href');
    const label = cleanInline(text);

    if (!href || !label) return label;
    if (href.startsWith('#')) return label;

    return `[${label}](${toAbsoluteIfInternal(href)})`;
  });

  html = html
    .replace(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi, (_, text) => `\n# ${cleanInline(text)}\n`)
    .replace(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi, (_, text) => `\n## ${cleanInline(text)}\n`)
    .replace(/<h3\b[^>]*>([\s\S]*?)<\/h3>/gi, (_, text) => `\n### ${cleanInline(text)}\n`)
    .replace(/<p\b[^>]*>([\s\S]*?)<\/p>/gi, (_, text) => {
      const value = cleanInline(text);
      return value ? `\n${value}\n` : '\n';
    })
    .replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, (_, text) => {
      const value = cleanInline(text);
      return value ? `\n- ${value}` : '';
    })
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(?:article|section|div|ul|ol)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ');

  return decodeHtml(html)
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function cleanInline(value) {
  return decodeHtml(
    String(value)
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

function getAttr(tag, name) {
  const match = tag.match(new RegExp(`\\s${escapeRegExp(name)}\\s*=\\s*(["'])(.*?)\\1`, 'i'));
  return match ? decodeHtml(match[2]) : '';
}

function getAttrFromAttrs(attrs, name) {
  const match = attrs.match(new RegExp(`\\b${escapeRegExp(name)}\\s*=\\s*(["'])(.*?)\\1`, 'i'));
  return match ? decodeHtml(match[2]) : '';
}

function toAbsoluteIfInternal(href) {
  try {
    const url = new URL(href, 'https://js.gripe/');
    return url.toString();
  } catch {
    return href;
  }
}

function decodeHtml(value) {
  return String(value)
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)));
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function toPosix(value) {
  return value.split(path.sep).join('/');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
