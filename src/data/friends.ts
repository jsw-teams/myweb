export type FriendLink = {
  name: string;
  url: string;
  description: {
    'zh-CN': string;
    'zh-TW': string;
    en: string;
  };
  lang?: string;
};

export const friends: FriendLink[] = [
  {
    name: 'Files.js.gripe',
    url: 'https://files.js.gripe/',
    description: {
      'zh-CN': '文件服务：用于整理、分发和取回公开文件，适合放置需要被快速访问的资源。',
      'zh-TW': '文件服務：用於整理、分發和取回公開文件，適合放置需要被快速存取的資源。',
      en: 'File service for organizing, sharing, and retrieving public resources that need quick access.'
    }
  },
  {
    name: 'LessKey Signer',
    url: 'http://ssl-signer.js.gripe/',
    description: {
      'zh-CN': 'LessKey 签发服务：提供轻量的签发与验证入口，服务于 JS.Gripe 相关工具链。',
      'zh-TW': 'LessKey 簽發服務：提供輕量的簽發與驗證入口，服務於 JS.Gripe 相關工具鏈。',
      en: 'LessKey signing service for lightweight issuing and verification workflows used by JS.Gripe tools.'
    }
  },
  {
    name: 'Account.js.gripe',
    url: 'https://acount.js.gripe/',
    description: {
      'zh-CN': '账号服务：为 JS.Gripe 相关应用提供登录、身份识别和账户管理入口。',
      'zh-TW': '帳號服務：為 JS.Gripe 相關應用提供登入、身份識別和帳號管理入口。',
      en: 'Account service for login, identity, and profile management across JS.Gripe applications.'
    }
  },
  {
    name: 'Search.js.gripe',
    url: 'https://search.js.gripe/',
    description: {
      'zh-CN': '搜索服务：面向文章、项目和公开内容的检索入口，适合快速找到线索。',
      'zh-TW': '搜尋服務：面向文章、專案和公開內容的檢索入口，適合快速找到線索。',
      en: 'Search service for quickly finding articles, projects, and other public JS.Gripe content.'
    }
  }
];
