import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const config = await fs.readFile(path.join(root, 'config.yml'), 'utf8');
const themeName = config.match(/^theme:\s*[\r\n]+(?:  .+[\r\n]+)*?  name:\s*(.+?)\s*$/m)?.[1]?.replace(/^["']|["']$/g, '') || 'intro';
const sourceDir = path.join(root, 'themes', themeName, 'scripts');
const targetDir = path.join(root, 'public', 'assets', 'theme', themeName, 'scripts');

await fs.mkdir(targetDir, { recursive: true });

for (const entry of await fs.readdir(sourceDir, { withFileTypes: true })) {
  if (!entry.isFile() || !entry.name.endsWith('.js')) continue;
  if (entry.name === 'consent.js') continue;
  await fs.copyFile(path.join(sourceDir, entry.name), path.join(targetDir, entry.name));
}
