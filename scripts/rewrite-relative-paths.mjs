import fs from 'node:fs/promises';
import path from 'node:path';

const projectRoot = process.cwd();
const distDir = path.join(projectRoot, 'dist');

function routeDir(filePath) {
  const relative = path.relative(distDir, filePath).replaceAll(path.sep, '/');
  const dirname = path.posix.dirname(relative);
  return dirname === '.' ? '/' : `/${dirname}/`;
}

function relativeUrl(fromDir, target) {
  const cleanTarget = target.replace(/^\/+/, '');
  let prefix = path.posix.relative(fromDir.replace(/^\/|\/$/g, ''), path.posix.dirname(cleanTarget));
  if (!prefix) prefix = '.';
  return `${prefix}/${path.posix.basename(cleanTarget)}`;
}

function rewriteHtml(html, fromDir) {
  return html.replace(/\b(href|src)=["']\/(?!\/)([^"']+)["']/g, (match, attr, target) => {
    if (/^(?:https?:|mailto:|tel:|#)/i.test(target)) return match;
    return `${attr}="${relativeUrl(fromDir, target)}"`;
  });
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      const fromDir = routeDir(fullPath);
      const html = await fs.readFile(fullPath, 'utf8');
      await fs.writeFile(fullPath, rewriteHtml(html, fromDir), 'utf8');
    }
  }
}

await walk(distDir);
