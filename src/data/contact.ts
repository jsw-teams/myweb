import type { Lang } from '../i18n/config';

export type ContactLink = {
  type: 'email' | 'github' | 'telegram' | 'other';
  label: Record<Lang, string>;
  href: string;
  note?: Record<Lang, string>;
};

export const contactLinks: ContactLink[] = [
  {
    type: 'email',
    label: {
      'zh-CN': '技诉支持团队',
      'zh-TW': '技訴支援團隊',
      en: 'JS.Gripe Support Team'
    },
    href: 'mailto:helper@js.gripe',
    note: {
      'zh-CN': '用于公开支持、隐私请求和一般站点问题：helper@js.gripe',
      'zh-TW': '用於公開支援、隱私請求和一般網站問題：helper@js.gripe',
      en: 'For public support, privacy requests, and general site questions: helper@js.gripe'
    }
  }
];
