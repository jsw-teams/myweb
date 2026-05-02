#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const projectRoot = fileURLToPath(new URL('..', import.meta.url));
const defaultDistDir = path.join(projectRoot, 'dist');

export async function generateSeoFiles(options = {}) {
  const distDir = path.resolve(options.distDir ?? defaultDistDir);
  const siteUrl = stripTrailingSlash(options.siteUrl ?? await getAstroSiteUrl(projectRoot));
  const pages = await collectPages(distDir, siteUrl);
  const markdownFiles = await collectMarkdownFiles(distDir, siteUrl);

  if (pages.length === 0) {
    throw new Error(`No HTML pages were found in ${distDir}`);
  }

  await fs.rm(path.join(distDir, 'sitemap.xsl'), { force: true });
  await fs.writeFile(path.join(distDir, 'sitemap.xml'), buildSitemap(pages), 'utf8');
  await fs.writeFile(path.join(distDir, 'sitemap.css'), buildSitemapCss(), 'utf8');
  await fs.writeFile(path.join(distDir, 'robots.txt'), buildRobotsTxt(siteUrl), 'utf8');
  await fs.writeFile(path.join(distDir, 'llms.txt'), buildLlmsTxt(siteUrl, pages), 'utf8');
  await fs.writeFile(path.join(distDir, 'llms-full.txt'), buildLlmsFullTxt(siteUrl, pages, markdownFiles), 'utf8');

  return {
    pages: pages.length,
    markdownFiles: markdownFiles.length
  };
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
  const leftPath = new URL(left.url).pathname;
  const rightPath = new URL(right.url).pathname;
  if (leftPath === '/') return rightPath === '/' ? 0 : -1;
  if (rightPath === '/') return 1;
  return leftPath.localeCompare(rightPath, 'en');
}

function buildSitemap(pages) {
  const includeAlternates = pages.some((page) => page.alternates.length > 0);
  const namespace = includeAlternates
    ? ' xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml"'
    : ' xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';
  const urls = pages.map((page) => {
    const alternateLinks = page.alternates.map((alternate) => (
      `    <xhtml:link rel="alternate" hreflang="${xmlEscape(alternate.hreflang)}" href="${xmlEscape(alternate.href)}" />`
    ));
    const children = [`    <loc>${xmlEscape(page.url)}</loc>`, ...alternateLinks].join('\n');
    return `  <url>\n${children}\n  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/css" href="/sitemap.css"?>\n<urlset${namespace}>\n${urls}\n</urlset>\n`;
}

function buildSitemapCss() {
  return `@namespace sm url("http://www.sitemaps.org/schemas/sitemap/0.9");
@namespace xhtml url("http://www.w3.org/1999/xhtml");

sm|urlset {
  color: #111827;
  display: block;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  line-height: 1.5;
  margin: 0;
  max-width: 1120px;
  padding: 32px;
}

sm|urlset::before {
  content: "Sitemap";
  display: block;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 8px;
}

sm|urlset::after {
  color: #4b5563;
  content: "Generated from the built static routes. Crawlers should read the XML source.";
  display: block;
  font-size: 14px;
  margin-top: 24px;
}

sm|url {
  border-bottom: 1px solid #e5e7eb;
  display: block;
  padding: 12px 0;
}

sm|loc {
  color: #0f766e;
  display: block;
  font-weight: 600;
  overflow-wrap: anywhere;
}

sm|loc::before {
  color: #6b7280;
  content: "URL";
  display: block;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: .04em;
  margin-bottom: 2px;
  text-transform: uppercase;
}

xhtml|link {
  color: #4b5563;
  display: block;
  font-size: 13px;
  margin-top: 4px;
  overflow-wrap: anywhere;
}

xhtml|link::before {
  content: "Alternate " attr(hreflang) ": " attr(href);
}
`;
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

function xmlEscape(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
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
