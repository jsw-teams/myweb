import type { Lang, PageKey } from './config';

type PageCopy = {
  title: string;
  description: string;
  eyebrow?: string;
  heading: string;
};

type Messages = {
  localeName: string;
  availableLanguages: string;
  skip: string;
  navLabel: string;
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
    mascotAlt: string;
  };
  writing: {
    blogLink: string;
    recentHeading: string;
    emptyTitle: string;
    emptyText: string;
    readMore: string;
    published: string;
    mascotAlt: string;
  };
  privacy: {
    lead: string;
    sections: Array<{
      heading: string;
      points: string[];
    }>;
    contactCta: string;
  };
  friends: {
    emptyTitle: string;
    langLabel: string;
    mascotAlt: string;
  };
  contact: {
    emptyTitle: string;
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
      mascotAlt: '技诉正在电脑前整理项目的黑熊吉祥物'
    },
    writing: {
      blogLink: '打开全部写作',
      recentHeading: '最近文章',
      emptyTitle: '文章正在整理',
      emptyText: '暂时没有从订阅源读取到文章，稍后会在这里展示最新内容。',
      readMore: '阅读全文',
      published: '发布于',
      mascotAlt: '技诉正在电脑前写作的黑熊吉祥物'
    },
    privacy: {
      lead: '本政策说明 JS.Gripe 如何处理访问、必要项目、非必要分析插件和公开联系信息。网站面向不同国家和地区访客，因此非必要插件采用更保守的默认设置：先提供选择，再加载。',
      sections: [
        {
          heading: '我们处理的信息',
          points: [
            '默认不要求注册，也不主动通过表单收集个人信息。',
            '访问日志、安全日志、错误日志和基础设施日志可能由服务器、CDN、防护服务或托管环境自动产生。',
            '如果你通过邮件联系，来信地址、邮件内容和必要的邮件元数据会用于回复、排障和支持记录。'
          ]
        },
        {
          heading: '分析插件与同意',
          points: [
            'Cloudflare Web Analytics 等非必要分析插件只用于了解页面访问量、性能和基本使用趋势，不用于定向广告。',
            '非必要分析插件默认关闭；你可以选择仅最小必要项目、全部接受，或在隐私偏好中心按类别管理。',
            '如果浏览器发送 Global Privacy Control 或 Do Not Track 信号，非必要插件会默认保持关闭，但不会被错误标记为必要项目。'
          ]
        },
        {
          heading: '必要项目',
          points: [
            '必要项目只限提供你请求的页面或服务所需的功能，例如隐私选择存储、登录会话、安全防护、语言偏好、服务可用性和防滥用。',
            '访问统计、广告、再营销、跨站跟踪、热力图、A/B 测试或非必要个性化不会放入必要项目。',
            '必要项目会在隐私偏好中心单独披露；可选项目必须通过选择后才加载。'
          ]
        },
        {
          heading: '地区化权利与选择',
          points: [
            '在欧盟地区和英国，非必要插件仅在同意后加载，拒绝与接受同样容易，且可以通过“隐私设置”撤回。',
            '在加利福尼亚州，我们尊重适用的退出偏好信号；本站不销售个人信息，不使用定向广告，并提供关闭非必要分析的选择。',
            '对于澳大利亚、巴西、加拿大、香港、台湾、印度、印度尼西亚、日本、沙特阿拉伯王国、澳门、马来西亚、墨西哥、菲律宾、俄罗斯、塞尔维亚、新加坡、韩国、斯里兰卡、泰国、土耳其、阿拉伯联合酋长国、越南、中国大陆及其他地区，我们采用清晰告知、目的限定、最小化、可撤回选择和必要项目单独披露的保守做法。',
            '在日本等要求说明第三方外部传送的地区，我们会说明第三方接收方、目的和用途；在涉及跨境处理或服务提供商时，会按适用要求提供说明。'
          ]
        },
        {
          heading: '保留、请求与安全',
          points: [
            '日志和支持邮件只在提供服务、安全、防滥用、排障或履行合理请求所需期间保留。',
            '隐私相关请求、访问/更正/删除请求或撤回同意问题，可通过联系方式页面提出。',
            '请不要通过公开页面或普通邮件发送密码、密钥、令牌、证件号、支付资料等敏感信息。'
          ]
        }
      ],
      contactCta: '查看联系方式'
    },
    friends: {
      emptyTitle: '友情链接暂未列出',
      langLabel: '语言',
      mascotAlt: '技诉举着友情链接牌的黑熊吉祥物'
    },
    contact: {
      emptyTitle: '暂无公开联系方式',
      safetyNote: '请不要通过公开页面发送敏感信息。',
      mascotAlt: '技诉拿着手机的黑熊吉祥物'
    },
    pages: {
      home: {
        title: 'JS.Gripe / 技诉',
        description: '技诉收拢技术记录、项目展示、写作与公开联络。',
        eyebrow: 'JS.Gripe',
        heading: '技诉'
      },
      projects: {
        title: '项目 / JS.Gripe',
        description: 'JS.Gripe 的公开项目展示。',
        heading: '项目'
      },
      writing: {
        title: '写作 / JS.Gripe',
        description: 'JS.Gripe 的写作页面。',
        heading: '写作'
      },
      privacy: {
        title: '隐私政策 / JS.Gripe',
        description: 'JS.Gripe 关于访问日志、分析插件、地区化隐私选择和联系信息的说明。',
        heading: '隐私政策'
      },
      friends: {
        title: '友情链接 / JS.Gripe',
        description: 'JS.Gripe 的友情链接。',
        heading: '友情链接'
      },
      contact: {
        title: '联系方式 / JS.Gripe',
        description: 'JS.Gripe 的公开联系方式。',
        heading: '联系方式'
      }
    }
  },
  'zh-TW': {
    localeName: '繁體中文',
    availableLanguages: '本文可用語言：',
    skip: '跳到主要內容',
    navLabel: '主導覽',
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
      mascotAlt: '技訴正在電腦前整理專案的黑熊吉祥物'
    },
    writing: {
      blogLink: '打開全部寫作',
      recentHeading: '最近文章',
      emptyTitle: '文章正在整理',
      emptyText: '暫時沒有從訂閱源讀取到文章，稍後會在這裡展示最新內容。',
      readMore: '閱讀全文',
      published: '發布於',
      mascotAlt: '技訴正在電腦前寫作的黑熊吉祥物'
    },
    privacy: {
      lead: '本政策說明 JS.Gripe 如何處理訪問、必要項目、非必要分析外掛和公開聯絡資訊。網站面向不同國家和地區訪客，因此非必要外掛採用更保守的預設設定：先提供選擇，再載入。',
      sections: [
        {
          heading: '我們處理的資訊',
          points: [
            '預設不要求註冊，也不主動透過表單收集個人資訊。',
            '訪問日誌、安全日誌、錯誤日誌和基礎設施日誌可能由伺服器、CDN、防護服務或託管環境自動產生。',
            '如果你透過電子郵件聯絡，來信地址、郵件內容和必要的郵件中繼資料會用於回覆、排障和支援記錄。'
          ]
        },
        {
          heading: '分析外掛與同意',
          points: [
            'Cloudflare Web Analytics 等非必要分析外掛只用於了解頁面訪問量、效能和基本使用趨勢，不用於定向廣告。',
            '非必要分析外掛預設關閉；你可以選擇僅最小必要項目、全部接受，或在隱私偏好中心依類別管理。',
            '如果瀏覽器送出 Global Privacy Control 或 Do Not Track 訊號，非必要外掛會預設保持關閉，但不會被錯誤標記為必要項目。'
          ]
        },
        {
          heading: '必要項目',
          points: [
            '必要項目只限提供你要求的頁面或服務所需的功能，例如隱私選擇儲存、登入工作階段、安全防護、語言偏好、服務可用性和防濫用。',
            '訪問統計、廣告、再行銷、跨站追蹤、熱力圖、A/B 測試或非必要個人化不會放入必要項目。',
            '必要項目會在隱私偏好中心單獨揭露；可選項目必須透過選擇後才載入。'
          ]
        },
        {
          heading: '地區化權利與選擇',
          points: [
            '在歐盟地區和英國，非必要外掛僅在同意後載入，拒絕與接受同樣容易，且可以透過「隱私設定」撤回。',
            '在加利福尼亞州，我們尊重適用的退出偏好訊號；本站不銷售個人資訊，不使用定向廣告，並提供關閉非必要分析的選擇。',
            '對於澳大利亞、巴西、加拿大、香港、台灣、印度、印度尼西亞、日本、沙烏地阿拉伯王國、澳門、馬來西亞、墨西哥、菲律賓、俄羅斯、塞爾維亞、新加坡、韓國、斯里蘭卡、泰國、土耳其、阿拉伯聯合大公國、越南、中國大陸及其他地區，我們採用清晰告知、目的限定、最小化、可撤回選擇和必要項目單獨揭露的保守做法。',
            '在日本等要求說明第三方外部傳送的地區，我們會說明第三方接收方、目的和用途；在涉及跨境處理或服務提供者時，會按適用要求提供說明。'
          ]
        },
        {
          heading: '保留、請求與安全',
          points: [
            '日誌和支援郵件只在提供服務、安全、防濫用、排障或履行合理請求所需期間保留。',
            '隱私相關請求、存取/更正/刪除請求或撤回同意問題，可透過聯絡方式頁面提出。',
            '請不要透過公開頁面或普通郵件傳送密碼、金鑰、權杖、證件號、支付資料等敏感資訊。'
          ]
        }
      ],
      contactCta: '查看聯絡方式'
    },
    friends: {
      emptyTitle: '友情連結暫未列出',
      langLabel: '語言',
      mascotAlt: '技訴舉著友情連結牌的黑熊吉祥物'
    },
    contact: {
      emptyTitle: '暫無公開聯絡方式',
      safetyNote: '請不要透過公開頁面傳送敏感資訊。',
      mascotAlt: '技訴拿著手機的黑熊吉祥物'
    },
    pages: {
      home: {
        title: 'JS.Gripe / 技訴',
        description: '技訴收攏技術紀錄、專案展示、寫作與公開聯絡。',
        eyebrow: 'JS.Gripe',
        heading: '技訴'
      },
      projects: {
        title: '專案 / JS.Gripe',
        description: 'JS.Gripe 的公開專案展示。',
        heading: '專案'
      },
      writing: {
        title: '寫作 / JS.Gripe',
        description: 'JS.Gripe 的寫作頁面。',
        heading: '寫作'
      },
      privacy: {
        title: '隱私政策 / JS.Gripe',
        description: 'JS.Gripe 關於訪問日誌、分析外掛、地區化隱私選擇和聯絡資訊的說明。',
        heading: '隱私政策'
      },
      friends: {
        title: '友情連結 / JS.Gripe',
        description: 'JS.Gripe 的友情連結。',
        heading: '友情連結'
      },
      contact: {
        title: '聯絡方式 / JS.Gripe',
        description: 'JS.Gripe 的公開聯絡方式。',
        heading: '聯絡方式'
      }
    }
  },
  en: {
    localeName: 'English',
    availableLanguages: 'Available languages:',
    skip: 'Skip to main content',
    navLabel: 'Primary navigation',
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
      mascotAlt: 'JS.Gripe black bear mascot working at a computer'
    },
    writing: {
      blogLink: 'Open all writing',
      recentHeading: 'Recent posts',
      emptyTitle: 'Posts are being organized',
      emptyText: 'No posts were available from the feed yet. The latest writing will appear here once it is ready.',
      readMore: 'Read article',
      published: 'Published',
      mascotAlt: 'JS.Gripe black bear mascot writing at a computer'
    },
    privacy: {
      lead: 'This policy explains how JS.Gripe handles visits, required services, optional analytics plugins, and public contact information. Because the site can be visited from many countries and regions, optional plugins use a conservative default: choices first, loading later.',
      sections: [
        {
          heading: 'Information We Process',
          points: [
            'The site does not require registration by default and does not actively collect personal information through forms.',
            'Access logs, security logs, error logs, and infrastructure logs may be produced automatically by servers, CDN, protection services, or hosting providers.',
            'If you contact us by email, your address, message content, and necessary email metadata are used to reply, troubleshoot, and keep support records.'
          ]
        },
        {
          heading: 'Analytics Plugins And Consent',
          points: [
            'Optional analytics plugins such as Cloudflare Web Analytics are used only to understand page visits, performance, and basic usage trends. They are not used for targeted advertising.',
            'Optional analytics plugins are off by default. You can keep only required services, accept all, or manage categories in the privacy preference center.',
            'If the browser sends a Global Privacy Control or Do Not Track signal, optional plugins remain off by default, but they are not mislabeled as required.'
          ]
        },
        {
          heading: 'Required Services',
          points: [
            'Required services are limited to what is needed to provide the requested page or service, such as privacy-choice storage, login sessions, security protections, language preference, service availability, and abuse prevention.',
            'Visit analytics, advertising, remarketing, cross-site tracking, heatmaps, A/B testing, or non-essential personalization are not placed in required services.',
            'Required services are disclosed separately in the privacy preference center; optional services load only after a choice.'
          ]
        },
        {
          heading: 'Regional Rights And Choices',
          points: [
            'In the European Union and the United Kingdom, optional plugins load only after consent; refusing is as easy as accepting, and consent can be withdrawn through Privacy settings.',
            'In California, we honor applicable opt-out preference signals. This site does not sell personal information, does not use targeted advertising, and provides a choice to turn off optional analytics.',
            'For Australia, Brazil, Canada, Hong Kong, Taiwan, India, Indonesia, Japan, the Kingdom of Saudi Arabia, Macau, Malaysia, Mexico, the Philippines, Russia, Serbia, Singapore, South Korea, Sri Lanka, Thailand, Turkey, the United Arab Emirates, Vietnam, mainland China, and other regions, we use a conservative approach: clear notice, purpose limitation, minimization, withdrawable choices, and separate disclosure of required services.',
            'Where rules require external transmission or cross-border processing disclosures, including Japan and similar regimes, we describe the third-party recipient, purpose, and use where applicable.'
          ]
        },
        {
          heading: 'Retention, Requests, And Safety',
          points: [
            'Logs and support emails are retained only as needed to provide the site, keep it secure, prevent abuse, troubleshoot, or handle reasonable requests.',
            'Privacy requests, access/correction/deletion requests, or consent withdrawal questions can be sent through the contact page.',
            'Please do not send passwords, keys, tokens, identity documents, payment data, or other sensitive information through public pages or ordinary email.'
          ]
        }
      ],
      contactCta: 'View contact options'
    },
    friends: {
      emptyTitle: 'No friend links listed yet',
      langLabel: 'Language',
      mascotAlt: 'JS.Gripe black bear mascot holding a friend links sign'
    },
    contact: {
      emptyTitle: 'No public contact option yet',
      safetyNote: 'Please do not send sensitive information through public pages.',
      mascotAlt: 'JS.Gripe black bear mascot holding a phone'
    },
    pages: {
      home: {
        title: 'JS.Gripe / 技诉',
        description: 'JS.Gripe collects technical notes, public projects, writing, and contact.',
        eyebrow: 'JS.Gripe',
        heading: 'JS.Gripe'
      },
      projects: {
        title: 'Projects / JS.Gripe',
        description: 'Public projects from JS.Gripe.',
        heading: 'Projects'
      },
      writing: {
        title: 'Writing / JS.Gripe',
        description: 'Writing from JS.Gripe.',
        heading: 'Writing'
      },
      privacy: {
        title: 'Privacy / JS.Gripe',
        description: 'How JS.Gripe handles logs, analytics plugins, regional privacy choices, and contact information.',
        heading: 'Privacy'
      },
      friends: {
        title: 'Friends / JS.Gripe',
        description: 'Friend links for JS.Gripe.',
        heading: 'Friends'
      },
      contact: {
        title: 'Contact / JS.Gripe',
        description: 'Public contact options for JS.Gripe.',
        heading: 'Contact'
      }
    }
  }
};
