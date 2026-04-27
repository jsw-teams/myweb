export const languages = ['zh-CN', 'zh-TW', 'en'] as const;

export type Lang = (typeof languages)[number];

export const defaultLang: Lang = 'zh-CN';

export const languageNames: Record<Lang, string> = {
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  en: 'English'
};

export const pageKeys = ['home', 'projects', 'writing', 'privacy', 'friends', 'contact'] as const;

export type PageKey = (typeof pageKeys)[number];

export const pageSlugs: Record<PageKey, string> = {
  home: '',
  projects: 'projects',
  writing: 'writing',
  privacy: 'privacy',
  friends: 'friends',
  contact: 'contact'
};
