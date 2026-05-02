import { defaultLang, languageNames, languages, pageSlugs, type Lang, type PageKey } from '../i18n/config';

export function isLang(value: string | undefined): value is Lang {
  return !!value && languages.includes(value as Lang);
}

export function getLang(value: string | undefined): Lang {
  return isLang(value) ? value : defaultLang;
}

export function getPagePath(lang: Lang, page: PageKey): string {
  const slug = pageSlugs[page];
  const pagePath = slug ? `/${slug}/` : '/';
  return lang === defaultLang ? pagePath : `/${lang}${pagePath}`;
}

export function getMarkdownPath(lang: Lang, page: PageKey): string {
  const name = page === 'home' ? 'index' : page;
  return `/md/${lang}/${name}.md`;
}

export function getLanguageAlternates(page: PageKey) {
  return languages.map((lang) => ({
    lang,
    label: languageNames[lang],
    href: getPagePath(lang, page)
  }));
}
