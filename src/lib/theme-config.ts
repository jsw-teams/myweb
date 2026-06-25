import type { Lang } from '../i18n/config';

type ThemeBrowserConfigOptions = {
  basePath: string;
  consentStyleUrl: string;
  assetUrls?: Record<string, string>;
};

type FooterCopyright = {
  enabled: boolean;
  text: Partial<Record<Lang, string>>;
};

export type ThemeScript = {
  src: string;
  consent?: string;
  defer?: boolean;
  async?: boolean;
  attrs?: Record<string, string>;
};

export function getThemeBrowserConfig(themeConfig: string, options: ThemeBrowserConfigOptions) {
  const resolveThemeAsset = createThemeAssetResolver(options.assetUrls);
  const featureStyles = Object.fromEntries(
    Object.entries(readStylesMap(themeConfig, 'featureStyles')).map(([key, values]) => [
      key,
      values.map(resolveThemeAsset)
    ])
  );
  if (!featureStyles.consent?.length) featureStyles.consent = [options.consentStyleUrl];

  return {
    locales: ['zh-CN', 'zh-TW', 'en'],
    defaultLocale: 'zh-CN',
    storageKey: 'js-gripe.locale',
    basePath: options.basePath,
    themeFeatures: readBoolMap(themeConfig, 'features'),
    themeFeatureScripts: Object.fromEntries(
      Object.entries(readMap(themeConfig, 'featureScripts')).map(([key, value]) => [key, resolveThemeAsset(value)])
    ),
    themeFeatureStyles: featureStyles,
    themeFeatureCategories: readMap(themeConfig, 'featureCategories'),
    themeConsent: readConsent(themeConfig)
  };
}

export function getThemeBodyEndScripts(
  themeConfig: string,
  withBase: (path: string) => string,
  assetUrls: Record<string, string> = {}
): ThemeScript[] {
  const resolveThemeAsset = createThemeAssetResolver(assetUrls);
  const scripts = readScripts(themeConfig, 'bodyEnd');
  const cloudflare = readCloudflareAnalytics(themeConfig);

  if (cloudflare?.enabled && cloudflare.token) {
    scripts.push({
      src: cloudflare.src,
      consent: cloudflare.consent,
      defer: cloudflare.defer,
      attrs: {
        'data-cf-beacon': JSON.stringify({
          token: cloudflare.token,
          ...cloudflare.beacon
        })
      }
    });
  }

  return scripts
    .filter((script) => script.src)
    .map((script) => ({
      ...script,
      src: withBase(resolveThemeAsset(script.src))
    }));
}

export function getFooterCopyright(themeConfig: string, lang: Lang, year: number): string {
  const copyright = readFooterCopyright(themeConfig);

  if (!copyright.enabled) return '';

  return (copyright.text[lang] ?? copyright.text['zh-TW'] ?? copyright.text['zh-CN'] ?? copyright.text.en ?? '')
    .replaceAll('{year}', String(year));
}

function readFooterCopyright(themeConfig: string): FooterCopyright {
  const result: FooterCopyright = {
    enabled: true,
    text: {}
  };
  const lines = themeConfig.split(/\r?\n/);
  let scope = '';

  for (const line of lines) {
    if (/^\S/.test(line)) {
      scope = line.startsWith('footer:') ? 'footer' : '';
      continue;
    }

    if (scope === 'footer' && /^  copyright:\s*$/.test(line)) {
      scope = 'copyright';
      continue;
    }

    if (scope === 'copyright') {
      const enabled = line.match(/^    enabled:\s*(true|false)\s*$/);
      if (enabled) {
        result.enabled = enabled[1] === 'true';
        continue;
      }

      const text = line.match(/^      (zh-CN|zh-TW|en):\s*["']?(.+?)["']?\s*$/);
      if (text) result.text[text[1] as Lang] = text[2];

      if (/^  [a-zA-Z]/.test(line)) break;
    }
  }

  return result;
}

function readConsent(themeConfig: string) {
  const block = readBlock(themeConfig, 'consent');
  const categoriesBlock = readNestedBlock(block, 'categories', 2);
  const categories: Record<string, { required: boolean }> = {};
  let current = '';

  for (const line of categoriesBlock.split(/\r?\n/)) {
    const category = line.match(/^    ([\w-]+):\s*$/);
    if (category) {
      current = category[1];
      categories[current] = { required: current === 'necessary' };
      continue;
    }

    const required = line.match(/^      required:\s*(true|false)\s*$/);
    if (required && current) categories[current].required = required[1] === 'true';
  }

  return {
    enabled: readBlockBoolean(block, 'enabled', true),
    storageKey: readBlockScalar(block, 'storageKey', 'js-gripe-consent'),
    revision: Number(readBlockScalar(block, 'revision', '1')),
    categories: Object.keys(categories).length
      ? categories
      : {
          necessary: { required: true },
          preferences: { required: false },
          analytics: { required: false },
          marketing: { required: false }
        }
  };
}

function readCloudflareAnalytics(themeConfig: string) {
  const pluginsBlock = readBlock(themeConfig, 'plugins');
  const analyticsBlock = readNestedBlock(pluginsBlock, 'analytics', 2);
  const block = analyticsBlock || readBlock(themeConfig, 'analytics');
  const cloudflare = readNestedBlock(block, 'cloudflareWebAnalytics', analyticsBlock ? 4 : 2);
  if (!cloudflare) return null;

  return {
    enabled: readBlockBoolean(cloudflare, 'enabled', false),
    src: readBlockScalar(cloudflare, 'src', ''),
    token: readBlockScalar(cloudflare, 'token', ''),
    defer: readBlockBoolean(cloudflare, 'defer', true),
    consent: readBlockScalar(cloudflare, 'consent', 'analytics'),
    beacon: readNestedValueMap(cloudflare, 'beacon', analyticsBlock ? 6 : 4)
  };
}

function readScripts(themeConfig: string, key: string): ThemeScript[] {
  const scriptsBlock = readBlock(themeConfig, 'scripts');
  const block = readNestedBlock(scriptsBlock, key, 2);
  const scripts: Array<Record<string, string>> = [];
  let current: Record<string, string> | null = null;

  for (const line of block.split(/\r?\n/)) {
    const start = line.match(/^    -\s*([\w-]+):\s*(.+?)\s*$/);
    if (start) {
      current = { [start[1]]: unquote(start[2]) };
      scripts.push(current);
      continue;
    }

    const item = line.match(/^      ([\w-]+):\s*(.+?)\s*$/);
    if (item && current) current[item[1]] = unquote(item[2]);
  }

  return scripts.map((script) => ({
    src: script.src,
    consent: script.consent,
    defer: asBoolean(script.defer, false),
    async: asBoolean(script.async, false)
  }));
}

function readBoolMap(themeConfig: string, key: string) {
  const values: Record<string, boolean> = {};
  for (const [name, value] of Object.entries(readMap(themeConfig, key))) {
    values[name] = value !== 'false';
  }
  return values;
}

function readStylesMap(themeConfig: string, key: string) {
  const block = readBlock(themeConfig, key);
  const values: Record<string, string[]> = {};
  let current = '';

  for (const line of block.split(/\r?\n/)) {
    const group = line.match(/^  ([\w-]+):\s*$/);
    if (group) {
      current = group[1];
      values[current] = [];
      continue;
    }

    const item = line.match(/^    -\s*(.+?)\s*$/);
    if (item && current) values[current].push(unquote(item[1]));
  }

  return values;
}

function readMap(raw: string, key: string) {
  const block = readBlock(raw, key);
  const values: Record<string, string> = {};
  for (const line of block.split(/\r?\n/)) {
    const match = line.match(/^  ([\w-]+):\s*(.+?)\s*$/);
    if (match) values[match[1]] = unquote(match[2]);
  }
  return values;
}

function readBlock(raw: string, key: string) {
  const start = raw.search(new RegExp(`^${escapeRegExp(key)}:\\s*$`, 'm'));
  if (start < 0) return '';
  const rest = raw.slice(start).split(/\r?\n/).slice(1);
  const lines: string[] = [];
  for (const line of rest) {
    if (line.trim() && !line.startsWith('  ')) break;
    lines.push(line);
  }
  return lines.join('\n');
}

function readNestedBlock(raw: string, key: string, indent: number) {
  const spaces = ' '.repeat(indent);
  const start = raw.search(new RegExp(`^${spaces}${escapeRegExp(key)}:\\s*$`, 'm'));
  if (start < 0) return '';
  const rest = raw.slice(start).split(/\r?\n/).slice(1);
  const lines: string[] = [];
  for (const line of rest) {
    if (line.trim() && !line.startsWith(`${spaces}  `)) break;
    lines.push(line);
  }
  return lines.join('\n');
}

function readBlockScalar(block: string, key: string, fallback = '') {
  const match = block.match(new RegExp(`^\\s+${escapeRegExp(key)}:\\s*(.+?)\\s*$`, 'm'));
  return match ? unquote(match[1]) : fallback;
}

function readBlockBoolean(block: string, key: string, fallback: boolean) {
  return asBoolean(readBlockScalar(block, key, String(fallback)), fallback);
}

function readNestedValueMap(block: string, key: string, indent: number) {
  const nested = readNestedBlock(block, key, indent);
  const values: Record<string, boolean | string> = {};
  for (const line of nested.split(/\r?\n/)) {
    const match = line.match(/^\s+([\w-]+):\s*(.+?)\s*$/);
    if (!match) continue;
    const value = unquote(match[2]);
    values[match[1]] = value === 'true' ? true : value === 'false' ? false : value;
  }
  return values;
}

function asBoolean(value: unknown, fallback: boolean) {
  if (value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;
  return fallback;
}

function createThemeAssetResolver(assetUrls: Record<string, string> = {}) {
  return (value: string) => {
    const path = String(value || '');
    if (!path || /^(?:[a-z][a-z0-9+.-]*:|\/\/|\/)/i.test(path)) return path;
    return assetUrls[path] || path;
  };
}

function unquote(value: string) {
  return String(value).trim().replace(/^["']|["']$/g, '');
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
