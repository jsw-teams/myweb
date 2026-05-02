#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const projectRoot = fileURLToPath(new URL('..', import.meta.url));
const defaultDistDir = path.join(projectRoot, 'dist');
const legacySitemapViewFiles = ['sitemap.xsl', 'sitemap.css'];

export async function generateSeoFiles(options = {}) {
  const distDir = path.resolve(options.distDir ?? defaultDistDir);
  const siteUrl = stripTrailingSlash(options.siteUrl ?? await getAstroSiteUrl(projectRoot));
  const pages = await collectPages(distDir, siteUrl);
  const markdownFiles = await collectMarkdownFiles(distDir, siteUrl);

  if (pages.length === 0) {
    throw new Error(`No HTML pages were found in ${distDir}`);
  }

  await removeLegacySitemapViewFiles(distDir);
  await copyAstroSitemap(distDir);
  await fs.writeFile(path.join(distDir, 'robots.txt'), buildRobotsTxt(siteUrl), 'utf8');
  await fs.writeFile(path.join(distDir, 'llms.txt'), buildLlmsTxt(siteUrl, pages), 'utf8');
  await fs.writeFile(path.join(distDir, 'llms-full.txt'), buildLlmsFullTxt(siteUrl, pages, markdownFiles), 'utf8');

  return {
    pages: pages.length,
    markdownFiles: markdownFiles.length
  };
}

async function copyAstroSitemap(distDir) {
  const primary = path.join(distDir, 'sitemap-0.xml');
  const canonical = path.join(distDir, 'sitemap.xml');
  try {
    await fs.copyFile(primary, canonical);
  } catch {
    throw new Error('Expected @astrojs/sitemap to generate sitemap-0.xml before SEO finalization.');
  }
}

async function removeLegacySitemapViewFiles(distDir) {
  await Promise.all(
    legacySitemapViewFiles.map((fileName) => fs.rm(path.join(distDir, fileName), { force: true }))
  );
}

async function getAstroSiteUrl(root) {
  const configPath = path.join(root, 'astro.config.mjs');
  const { default: config } = await import(pathToFileURL(configPath).href);
  if (typeof config?.site !== 'string' || config.site.trim() === '') {
    throw new Error('astro.config.mjs must define a site URL to generate SEO files.');
  }
  return config.site;
}

async function collectPages(distDir, siteUrl) {
  const htmlFiles = await findFiles(distDir, (file) => file.endsWith('.html'));
  const pagesByUrl = new Map();

  for (const filePath of htmlFiles) {
    const relativePath = toPosixPath(path.relative(distDir, filePath));
    if (relativePath === '404.html') continue;

    const html = await fs.readFile(filePath, 'utf8');
    const robots = getMetaContent(html, 'name', 'robots');
    if (robots && /\bnoindex\b/i.test(robots)) continue;

    const routePath = routePathFromHtml(relativePath);
    const canonical = getCanonicalUrl(html, siteUrl, routePath);
    const markdownUrl = getMarkdownUrl(html, siteUrl);
    const page = {
      url: canonical,
      path: new URL(canonical).pathname,
      lastmod: await getLastmod(filePath),
      title: getTitle(html) || canonical,
      description: getMetaContent(html, 'name', 'description') ?? '',
      markdownUrl,
      alternates: getAlternates(html, siteUrl)
    };

    if (!pagesByUrl.has(page.url)) {
      pagesByUrl.set(page.url, page);
    }
  }

  return [...pagesByUrl.values()].sort(compareByUrlPath);
}

async function collectMarkdownFiles(distDir, siteUrl) {
  const markdownRoot = path.join(distDir, 'md');
  try {
    await fs.access(markdownRoot);
  } catch {
    return [];
  }

  const files = await findFiles(markdownRoot, (file) => file.endsWith('.md'));
  const items = [];

  for (const filePath of files) {
    const relativePath = toPosixPath(path.relative(distDir, filePath));
    const pathname = `/${relativePath}`;
    items.push({
      path: pathname,
      url: new URL(pathname, `${siteUrl}/`).toString(),
      content: trimTrailingBlankLines(await fs.readFile(filePath, 'utf8'))
    });
  }

  return items.sort(compareByUrlPath);
}

async function getLastmod(filePath) {
  const stats = await fs.stat(filePath);
  return stats.mtime.toISOString();
}

async function findFiles(dir, includeFile) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await findFiles(entryPath, includeFile));
      continue;
    }

    if (entry.isFile() && includeFile(entryPath)) {
      files.push(entryPath);
    }
  }

  return files;
}

function routePathFromHtml(relativePath) {
  if (relativePath === 'index.html') return '/';
  if (relativePath.endsWith('/index.html')) {
    return `/${relativePath.slice(0, -'index.html'.length)}`;
  }
  return `/${relativePath.slice(0, -'.html'.length)}`;
}

function getCanonicalUrl(html, siteUrl, fallbackPath) {
  const canonicalTag = findTags(html, 'link').find((tag) => {
    const rel = getAttr(tag, 'rel');
    return rel?.split(/\s+/).some((value) => value.toLowerCase() === 'canonical');
  });
  const href = canonicalTag ? getAttr(canonicalTag, 'href') : null;
  return normalizeUrl(href ?? fallbackPath, siteUrl);
}

function getMarkdownUrl(html, siteUrl) {
  const markdownTag = findTags(html, 'link').find((tag) => {
    const rel = getAttr(tag, 'rel');
    const type = getAttr(tag, 'type');
    return rel?.split(/\s+/).some((value) => value.toLowerCase() === 'alternate')
      && type?.toLowerCase() === 'text/markdown';
  });
  const href = markdownTag ? getAttr(markdownTag, 'href') : null;
  return href ? normalizeUrl(href, siteUrl) : null;
}

function getAlternates(html, siteUrl) {
  return findTags(html, 'link')
    .map((tag) => {
      const rel = getAttr(tag, 'rel');
      const hreflang = getAttr(tag, 'hreflang');
      const href = getAttr(tag, 'href');
      if (!rel || !hreflang || !href) return null;
      if (!rel.split(/\s+/).some((value) => value.toLowerCase() === 'alternate')) return null;
      return {
        hreflang,
        href: normalizeUrl(href, siteUrl)
      };
    })
    .filter(Boolean);
}

function getTitle(html) {
  const match = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  return match ? cleanText(match[1]) : '';
}

function getMetaContent(html, attrName, attrValue) {
  const tag = findTags(html, 'meta').find((candidate) => {
    return getAttr(candidate, attrName)?.toLowerCase() === attrValue.toLowerCase();
  });
  const content = tag ? getAttr(tag, 'content') : null;
  return content ? cleanText(content) : null;
}

function findTags(html, tagName) {
  return [...html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, 'gi'))].map((match) => match[0]);
}

function getAttr(tag, attrName) {
  const match = tag.match(new RegExp(`\\s${escapeRegExp(attrName)}\\s*=\\s*(["'])(.*?)\\1`, 'i'));
  return match ? decodeHtmlEntities(match[2]) : null;
}

function normalizeUrl(value, siteUrl) {
  return new URL(value, `${siteUrl}/`).toString();
}

function compareByUrlPath(left, right) {
  const leftKey = getRouteSortKey(left.url);
  const rightKey = getRouteSortKey(right.url);
  return leftKey.localeCompare(rightKey, 'en');
}

function getRouteSortKey(url) {
  const pathname = new URL(url).pathname;
  const parts = pathname.split('/').filter(Boolean);
  const lang = getPathLanguage(parts);
  const routeParts = lang ? parts.slice(1) : parts;
  const routePath = routeParts.join('/');
  return [
    String(getRouteRank(routeParts)).padStart(2, '0'),
    routePath || '~',
    String(getLanguageRank(lang)).padStart(2, '0'),
    pathname
  ].join('|');
}

function getPathLanguage(parts) {
  const first = parts[0];
  return ['zh-CN', 'zh-TW', 'en'].includes(first) ? first : '';
}

function getLanguageRank(lang) {
  return {
    '': 0,
    'zh-CN': 0,
    'zh-TW': 1,
    en: 2
  }[lang] ?? 9;
}

function getRouteRank(parts) {
  if (parts.length === 0) return 0;

  const [section] = parts;
  const primaryRanks = {
    about: 10,
    contact: 11,
    friends: 12,
    privacy: 13,
    projects: 14,
    writing: 15
  };

  if (section in primaryRanks) return primaryRanks[section];
  if (section === 'archive') return 30;
  if (section === 'categories') return parts.length === 1 ? 31 : 40;
  if (section === 'tags') return parts.length === 1 ? 32 : 41;
  if (section === 'posts') return 50;
  if (section === 'search') return 90;
  return 60;
}

function buildRobotsTxt(siteUrl) {
  return `User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap.xml', `${siteUrl}/`).toString()}\n`;
}

function buildLlmsTxt(siteUrl, pages) {
  const rootPage = pages.find((page) => page.path === '/') ?? pages[0];
  const lines = [
    `# ${rootPage.title}`,
    '',
    rootPage.description,
    '',
    `Site: ${siteUrl}`,
    '',
    '## Pages',
    '',
    ...pages.map(formatPageLine)
  ];

  return `${trimTrailingBlankLines(lines.join('\n'))}\n`;
}

function buildLlmsFullTxt(siteUrl, pages, markdownFiles) {
  const rootPage = pages.find((page) => page.path === '/') ?? pages[0];
  const markdownByUrl = new Map(markdownFiles.map((item) => [item.url, item]));
  const linkedMarkdownUrls = new Set(pages.map((page) => page.markdownUrl).filter(Boolean));
  const unlinkedMarkdown = markdownFiles.filter((item) => !linkedMarkdownUrls.has(item.url));
  const sections = [];

  for (const page of pages) {
    if (!page.markdownUrl) continue;
    const markdown = markdownByUrl.get(page.markdownUrl);
    if (!markdown) continue;
    sections.push(formatMarkdownSection(page, markdown));
  }

  for (const markdown of unlinkedMarkdown) {
    sections.push([
      `### ${markdown.path}`,
      '',
      `Markdown: ${markdown.url}`,
      '',
      markdown.content
    ].join('\n'));
  }

  const lines = [
    `# ${rootPage.title}`,
    '',
    rootPage.description,
    '',
    `Site: ${siteUrl}`,
    '',
    '## Pages',
    '',
    ...pages.map(formatPageLine),
    '',
    '## Markdown Content',
    '',
    ...sections
  ];

  return `${trimTrailingBlankLines(lines.join('\n'))}\n`;
}

function formatPageLine(page) {
  const description = page.description ? `: ${page.description}` : '';
  const markdown = page.markdownUrl ? ` | Markdown: ${page.markdownUrl}` : '';
  return `- [${page.title}](${page.url})${description}${markdown}`;
}

function formatMarkdownSection(page, markdown) {
  return [
    `### ${page.title}`,
    '',
    `Page: ${page.url}`,
    `Markdown: ${markdown.url}`,
    '',
    markdown.content
  ].join('\n');
}

function cleanText(value) {
  return decodeHtmlEntities(value).replace(/\s+/g, ' ').trim();
}

function decodeHtmlEntities(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)));
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function stripTrailingSlash(value) {
  return value.replace(/\/+$/, '');
}

function toPosixPath(value) {
  return value.split(path.sep).join('/');
}

function trimTrailingBlankLines(value) {
  return value.replace(/\s+$/g, '');
}

const isCli = process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;

if (isCli) {
  generateSeoFiles()
    .then((result) => {
      console.log(`Generated SEO files from dist: ${result.pages} pages, ${result.markdownFiles} markdown files.`);
    })
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}
