import type { Lang, PageKey } from './config';

type PageCopy = {
  title: string;
  description: string;
  eyebrow?: string;
  heading: string;
  intro: string;
};

type Messages = {
  localeName: string;
  availableLanguages: string;
  skip: string;
  navLabel: string;
  footerNote: string;
  current: string;
  external: string;
  cards: {
    projects: string;
    writing: string;
    friends: string;
    contact: string;
  };
  home: {
    heroAlt: string;
    iconAlt: string;
    lead: string;
    entries: Record<'projects' | 'writing' | 'friends' | 'contact', string>;
  };
  projects: {
    emptyTitle: string;
    emptyText: string;
    mascotAlt: string;
  };
  writing: {
    blogLink: string;
    note: string;
    mascotAlt: string;
  };
  privacy: {
    points: string[];
    contactCta: string;
  };
  friends: {
    emptyTitle: string;
    emptyText: string;
    langLabel: string;
    mascotAlt: string;
  };
  contact: {
    emptyTitle: string;
    emptyText: string;
    safetyNote: string;
    mascotAlt: string;
  };
  pages: Record<PageKey, PageCopy>;
};

export const messages: Record<Lang, Messages> = {
  'zh-CN': {
    localeName: '简体中文',
    availableLanguages: '本文可用语言：',
    skip: '跳到主要内容',
    navLabel: '主导航',
    footerNote: '一个安静的公开页面。',
    current: '当前页面',
    external: '打开外部链接',
    cards: {
      projects: '项目',
      writing: '写作',
      friends: '友情链接',
      contact: '联系方式'
    },
    home: {
      heroAlt: '技诉像素风黑熊吉祥物',
      iconAlt: '技诉黑熊头像标识',
      lead: '这里收拢技术记录、项目展示、写作与公开联络。',
      entries: {
        projects: '浏览适合公开展示的作品。',
        writing: '阅读整理后的记录与短文。',
        friends: '查看少量清晰的公开链接。',
        contact: '了解适合公开使用的联络方式。'
      }
    },
    projects: {
      emptyTitle: '公开项目正在整理',
      emptyText: '这里只呈现适合公开阅读和长期访问的项目。',
      mascotAlt: '技诉正在电脑前整理项目的黑熊吉祥物'
    },
    writing: {
      blogLink: '打开写作页面',
      note: '记录与短文会保持轻量、清楚，并放在独立页面。',
      mascotAlt: '技诉正在电脑前写作的黑熊吉祥物'
    },
    privacy: {
      points: [
        '默认不主动收集个人信息。',
        '不使用第三方追踪脚本。',
        '访问日志与安全日志可能由基础设施产生。',
        '隐私相关请求可通过联系方式页面提出。'
      ],
      contactCta: '查看联系方式'
    },
    friends: {
      emptyTitle: '友情链接暂未列出',
      emptyText: '这里只放置少量清晰、稳定、适合公开访问的站点。',
      langLabel: '语言',
      mascotAlt: '技诉举着友情链接牌的黑熊吉祥物'
    },
    contact: {
      emptyTitle: '暂无公开联系方式',
      emptyText: '适合公开展示的联系方式会保持简洁，并集中放在这里。',
      safetyNote: '请不要通过公开页面发送敏感信息。',
      mascotAlt: '技诉拿着手机的黑熊吉祥物'
    },
    pages: {
      home: {
        title: 'JS.Gripe / 技诉',
        description: '技诉收拢技术记录、项目展示、写作与公开联络。',
        eyebrow: 'JS.Gripe',
        heading: '技诉',
        intro: '一个克制、清楚的公开页面。'
      },
      projects: {
        title: '项目 / JS.Gripe',
        description: 'JS.Gripe 的公开项目展示。',
        heading: '项目',
        intro: '这里保留适合公开展示的项目。'
      },
      writing: {
        title: '写作 / JS.Gripe',
        description: 'JS.Gripe 的写作页面。',
        heading: '写作',
        intro: '技术记录与短文放在更适合阅读的位置。'
      },
      privacy: {
        title: '隐私政策 / JS.Gripe',
        description: 'JS.Gripe 的简洁隐私说明。',
        heading: '隐私政策',
        intro: '这里说明本站如何对待访问与联系信息。'
      },
      friends: {
        title: '友情链接 / JS.Gripe',
        description: 'JS.Gripe 的友情链接。',
        heading: '友情链接',
        intro: '保留一些值得公开访问的链接。'
      },
      contact: {
        title: '联系方式 / JS.Gripe',
        description: 'JS.Gripe 的公开联系方式。',
        heading: '联系方式',
        intro: '这里仅放置适合公开展示的联系方式。'
      }
    }
  },
  'zh-TW': {
    localeName: '繁體中文',
    availableLanguages: '本文可用語言：',
    skip: '跳到主要內容',
    navLabel: '主導覽',
    footerNote: '一個安靜的公開頁面。',
    current: '目前頁面',
    external: '開啟外部連結',
    cards: {
      projects: '專案',
      writing: '寫作',
      friends: '友情連結',
      contact: '聯絡方式'
    },
    home: {
      heroAlt: '技訴像素風黑熊吉祥物',
      iconAlt: '技訴黑熊頭像標識',
      lead: '這裡收攏技術紀錄、專案展示、寫作與公開聯絡。',
      entries: {
        projects: '瀏覽適合公開展示的作品。',
        writing: '閱讀整理後的紀錄與短文。',
        friends: '查看少量清晰的公開連結。',
        contact: '了解適合公開使用的聯絡方式。'
      }
    },
    projects: {
      emptyTitle: '公開專案正在整理',
      emptyText: '這裡只呈現適合公開閱讀和長期訪問的專案。',
      mascotAlt: '技訴正在電腦前整理專案的黑熊吉祥物'
    },
    writing: {
      blogLink: '打開寫作頁面',
      note: '紀錄與短文會保持輕量、清楚，並放在獨立頁面。',
      mascotAlt: '技訴正在電腦前寫作的黑熊吉祥物'
    },
    privacy: {
      points: [
        '預設不主動收集個人資訊。',
        '不使用第三方追蹤腳本。',
        '訪問日誌與安全日誌可能由基礎設施產生。',
        '隱私相關請求可透過聯絡方式頁面提出。'
      ],
      contactCta: '查看聯絡方式'
    },
    friends: {
      emptyTitle: '友情連結暫未列出',
      emptyText: '這裡只放置少量清晰、穩定、適合公開訪問的站點。',
      langLabel: '語言',
      mascotAlt: '技訴舉著友情連結牌的黑熊吉祥物'
    },
    contact: {
      emptyTitle: '暫無公開聯絡方式',
      emptyText: '適合公開展示的聯絡方式會保持簡潔，並集中放在這裡。',
      safetyNote: '請不要透過公開頁面傳送敏感資訊。',
      mascotAlt: '技訴拿著手機的黑熊吉祥物'
    },
    pages: {
      home: {
        title: 'JS.Gripe / 技訴',
        description: '技訴收攏技術紀錄、專案展示、寫作與公開聯絡。',
        eyebrow: 'JS.Gripe',
        heading: '技訴',
        intro: '一個克制、清楚的公開頁面。'
      },
      projects: {
        title: '專案 / JS.Gripe',
        description: 'JS.Gripe 的公開專案展示。',
        heading: '專案',
        intro: '這裡保留適合公開展示的專案。'
      },
      writing: {
        title: '寫作 / JS.Gripe',
        description: 'JS.Gripe 的寫作頁面。',
        heading: '寫作',
        intro: '技術紀錄與短文放在更適合閱讀的位置。'
      },
      privacy: {
        title: '隱私政策 / JS.Gripe',
        description: 'JS.Gripe 的簡潔隱私說明。',
        heading: '隱私政策',
        intro: '這裡說明本站如何對待訪問與聯絡資訊。'
      },
      friends: {
        title: '友情連結 / JS.Gripe',
        description: 'JS.Gripe 的友情連結。',
        heading: '友情連結',
        intro: '保留一些值得公開訪問的連結。'
      },
      contact: {
        title: '聯絡方式 / JS.Gripe',
        description: 'JS.Gripe 的公開聯絡方式。',
        heading: '聯絡方式',
        intro: '這裡僅放置適合公開展示的聯絡方式。'
      }
    }
  },
  en: {
    localeName: 'English',
    availableLanguages: 'Available languages:',
    skip: 'Skip to main content',
    navLabel: 'Primary navigation',
    footerNote: 'A quiet public entrance.',
    current: 'Current page',
    external: 'Open external link',
    cards: {
      projects: 'Projects',
      writing: 'Writing',
      friends: 'Friends',
      contact: 'Contact'
    },
    home: {
      heroAlt: 'Pixel-style black bear mascot for JS.Gripe',
      iconAlt: 'Black bear avatar mark for JS.Gripe',
      lead: 'A quiet page for technical notes, public projects, writing, and contact.',
      entries: {
        projects: 'Browse work suited for public display.',
        writing: 'Read curated notes and essays.',
        friends: 'View a small set of clear public links.',
        contact: 'Find contact options fit for public use.'
      }
    },
    projects: {
      emptyTitle: 'Public projects are being curated',
      emptyText: 'This page only lists work suited for public reading and long-term access.',
      mascotAlt: 'JS.Gripe black bear mascot working at a computer'
    },
    writing: {
      blogLink: 'Open writing',
      note: 'Notes and essays stay light, clear, and collected on a dedicated page.',
      mascotAlt: 'JS.Gripe black bear mascot writing at a computer'
    },
    privacy: {
      points: [
        'This site does not actively collect personal information by default.',
        'No third-party tracking scripts are used.',
        'Access logs and security logs may be produced by infrastructure.',
        'Privacy requests can be sent through the contact page.'
      ],
      contactCta: 'View contact options'
    },
    friends: {
      emptyTitle: 'No friend links listed yet',
      emptyText: 'This page keeps only a small set of clear, stable public sites.',
      langLabel: 'Language',
      mascotAlt: 'JS.Gripe black bear mascot holding a friend links sign'
    },
    contact: {
      emptyTitle: 'No public contact option yet',
      emptyText: 'Contact options suited for public display will stay concise and collected here.',
      safetyNote: 'Please do not send sensitive information through public pages.',
      mascotAlt: 'JS.Gripe black bear mascot holding a phone'
    },
    pages: {
      home: {
        title: 'JS.Gripe / 技诉',
        description: 'JS.Gripe collects technical notes, public projects, writing, and contact.',
        eyebrow: 'JS.Gripe',
        heading: 'JS.Gripe',
        intro: 'A quiet and clear public page.'
      },
      projects: {
        title: 'Projects / JS.Gripe',
        description: 'Public projects from JS.Gripe.',
        heading: 'Projects',
        intro: 'Work suited for public display is kept here.'
      },
      writing: {
        title: 'Writing / JS.Gripe',
        description: 'Writing from JS.Gripe.',
        heading: 'Writing',
        intro: 'Notes and essays live where they are easier to read.'
      },
      privacy: {
        title: 'Privacy / JS.Gripe',
        description: 'A short privacy note for JS.Gripe.',
        heading: 'Privacy',
        intro: 'How this site treats visits and contact information.'
      },
      friends: {
        title: 'Friends / JS.Gripe',
        description: 'Friend links for JS.Gripe.',
        heading: 'Friends',
        intro: 'A small set of public links.'
      },
      contact: {
        title: 'Contact / JS.Gripe',
        description: 'Public contact options for JS.Gripe.',
        heading: 'Contact',
        intro: 'Only contact options suitable for public display are listed here.'
      }
    }
  }
};
