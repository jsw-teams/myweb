import { site } from '../data/site';
import { languages, type Lang, type PageKey } from '../i18n/config';
import { messages } from '../i18n/messages';
import { getPagePath } from './i18n';

export function absoluteUrl(path: string): string {
  return new URL(path, site.url).toString();
}

export function getSeo(lang: Lang, page: PageKey) {
  const copy = messages[lang].pages[page];
  const path = getPagePath(lang, page);

  return {
    title: copy.title,
    description: copy.description,
    canonical: absoluteUrl(path),
    image: absoluteUrl(site.icon),
    alternates: languages.map((alternateLang) => ({
      lang: alternateLang,
      href: absoluteUrl(getPagePath(alternateLang, page))
    }))
  };
}

export function getBreadcrumbs(lang: Lang, page: PageKey) {
  const items = [{ name: messages[lang].pages.home.heading, url: absoluteUrl(getPagePath(lang, 'home')) }];
  if (page !== 'home') {
    items.push({ name: messages[lang].pages[page].heading, url: absoluteUrl(getPagePath(lang, page)) });
  }
  return items;
}
