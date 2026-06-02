import type { Lang } from '../i18n/config';

export type LocalizedProjectDescription = Record<Lang, string>;

export const projectDescriptions: Record<string, LocalizedProjectDescription> = {
  'jsw-teams/myweb': {
    'zh-CN': 'JS.Gripe 主站：汇总站点入口、项目展示、写作索引、友情链接和联系信息。',
    'zh-TW': 'JS.Gripe 主站：彙整站點入口、專案展示、寫作索引、友情連結和聯絡資訊。',
    en: 'JS.Gripe main site for navigation, project listings, writing indexes, friends, and contact.'
  },
  'jsw-teams/myblog': {
    'zh-CN': 'JS.Gripe 博客：用于发布技术笔记、运维记录和多语言文章的静态博客。',
    'zh-TW': 'JS.Gripe 部落格：用於發布技術筆記、維運記錄和多語文章的靜態部落格。',
    en: 'JS.Gripe blog for technical notes, operations records, and multilingual articles.'
  },
  'jsw-teams/myfiles': {
    'zh-CN': '文件服务：结合账号登录与后端存储，用于管理和分发公开文件。',
    'zh-TW': '文件服務：結合帳號登入與後端儲存，用於管理和分發公開文件。',
    en: 'File service with account login and backend storage for managing and sharing public files.'
  },
  'jsw-teams/account-system': {
    'zh-CN': '账号服务：为 JS.Gripe 相关应用提供登录、身份识别和账户能力。',
    'zh-TW': '帳號服務：為 JS.Gripe 相關應用提供登入、身份識別和帳號能力。',
    en: 'Account service providing login, identity, and account features for JS.Gripe applications.'
  },
  'jsw-teams/mydquery': {
    'zh-CN': 'DNS-over-HTTPS 查询网关与 Astro 前端，用于公开 DNS 查询体验。',
    'zh-TW': 'DNS-over-HTTPS 查詢閘道與 Astro 前端，用於公開 DNS 查詢體驗。',
    en: 'DNS-over-HTTPS query gateway with an Astro frontend for public DNS lookup flows.'
  },
  'jsw-teams/mycookies': {
    'zh-CN': 'privacy-js-gripe 隐私横幅控制器，用于静态站点的 Cookie 同意提示与偏好管理。',
    'zh-TW': 'privacy-js-gripe 隱私橫幅控制器，用於靜態站點的 Cookie 同意提示與偏好管理。',
    en: 'privacy-js-gripe privacy banner controller for cookie consent notices and preferences on static sites.'
  },
  'jsw-teams/myzerossl': {
    'zh-CN': '证书签发辅助服务，用于整理 ZeroSSL 与站点证书相关流程。',
    'zh-TW': '憑證簽發輔助服務，用於整理 ZeroSSL 與站點憑證相關流程。',
    en: 'Certificate issuing helper for ZeroSSL and site certificate workflows.'
  },
  'jsw-teams/searchme': {
    'zh-CN': '搜索服务实验：面向公开内容检索和搜索体验调试的项目。',
    'zh-TW': '搜尋服務實驗：面向公開內容檢索和搜尋體驗調試的專案。',
    en: 'Search service experiment for public content retrieval and search experience tuning.'
  },
  'jsw-teams/js-gripe-workerai-api': {
    'zh-CN': 'Worker AI API 服务：用于封装 JS.Gripe 相关的边缘 AI 调用能力。',
    'zh-TW': 'Worker AI API 服務：用於封裝 JS.Gripe 相關的邊緣 AI 呼叫能力。',
    en: 'Worker AI API service for wrapping edge AI calls used by JS.Gripe tools.'
  }
};

export function getProjectDescription(fullName: string, lang: Lang, fallback = ''): string {
  return projectDescriptions[fullName]?.[lang] || fallback;
}
