# JS.Gripe / 技诉

这是 JS.Gripe / 技诉 的公开展示站。前端页面面向访客，README 只写给维护者看。

## 本地开发

```sh
npm install
npm run dev
```

常用检查：

```sh
npm run check
npm run build
npm audit
```

构建产物会生成在 `dist/`。

## 部署到 Cloudflare Pages

1. 将这个项目推送到 GitHub 仓库。
2. 打开 Cloudflare Dashboard，进入 **Workers & Pages**。
3. 选择 **Create application**，再选择 **Pages**。
4. 连接 GitHub，并选择这个仓库。
5. 构建设置填写：
   - Framework preset: `Astro`
   - Build command: `npm run build`
   - Build output directory: `dist`
6. 保存并部署。

部署完成后，可以在 Cloudflare Pages 的自定义域名设置里绑定 `js.gripe`。

## 修改站点内容

主要内容都在 `src/` 和 `public/` 中维护：

- 页面文案和多语言内容：`src/i18n/messages.ts`
- 导航项目：`src/data/nav.ts`
- 项目数据：`src/data/projects.ts`
- 友情链接：`src/data/friends.ts`
- 联系方式：`src/data/contact.ts`
- 站点名称、域名、图片路径：`src/data/site.ts`
- 页面结构：`src/pages/[lang]/`
- 全局样式：`src/styles/global.css`

修改 `messages.ts` 时，三种语言都要一起更新：`zh-CN`、`zh-TW`、`en`。

## 修改图片

品牌图片放在：

- `public/assets/brand/mascot-sheet.png`
- `public/assets/brand/site-icon.png`

当前页面还使用了从吉祥物图中裁剪出的展示图：

- `public/assets/brand/mascot-home.png`
- `public/assets/brand/mascot-laptop.png`
- `public/assets/brand/mascot-friends.png`
- `public/assets/brand/mascot-contact.png`

替换图片后建议重新运行：

```sh
npm run build
```

## Markdown 和 Agent 文件

这些文件给搜索引擎、Agent 或纯文本读取使用：

- `public/llms.txt`
- `public/llms-full.txt`
- `public/md/zh-CN/`
- `public/md/zh-TW/`
- `public/md/en/`

如果修改了页面核心文案，也要同步更新对应 Markdown 文件。

## 上线前检查

```sh
npm run check
npm run build
npm audit
```

确认 `dist/` 中存在主要页面，例如：

- `dist/zh-CN/index.html`
- `dist/zh-CN/contact/index.html`
- `dist/llms.txt`
- `dist/md/zh-CN/index.md`
