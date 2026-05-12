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

## 部署到 VPS / OpenResty

推荐将构建产物通过 release 目录原子切换到：

```text
/var/www/js.gripe/current
```

OpenResty 的 `root` 指向该软链接，部署脚本构建成功后再切换软链接。这样构建失败不会影响线上旧版本。

## GitHub 公开项目展示

项目页会在构建前执行：

```sh
npm run sync:projects
```

脚本会读取 `src/data/projects.config.json`，从 `https://api.github.com/users/jsw-teams/repos` 拉取公开仓库信息，并生成：

```text
src/data/generated/github-projects.ts
```

线上访问阶段只读取静态 HTML，不会再请求 GitHub API。

如果 VPS 配置了 `GITHUB_TOKEN` 或 `GH_TOKEN`，构建脚本会使用 token 避免 GitHub API 频率限制。没有 token 时也可以读取公开仓库，但频率限制更低。

## 修改站点内容

主要内容都在 `src/` 和 `public/` 中维护：

- 页面文案和多语言内容：`src/i18n/messages.ts`
- 导航项目：`src/data/nav.ts`
- GitHub 项目展示配置：`src/data/projects.config.json`
- 手工项目数据：`src/data/projects.ts`
- 友情链接：`src/data/friends.ts`
- 联系方式：`src/data/contact.ts`
- 站点名称、域名、图片路径：`src/data/site.ts`
- 页面结构：`src/pages/` 和 `src/pages/[lang]/`
- 全局样式：`src/styles/global.css`

修改 `messages.ts` 时，三种语言都要一起更新：`zh-CN`、`zh-TW`、`en`。

## Markdown 和 Agent 文件

这些文件给搜索引擎、Agent 或纯文本读取使用：

- `dist/robots.txt`
- `dist/llms.txt`
- `dist/llms-full.txt`
- `dist/md/zh-CN/`
- `dist/md/zh-TW/`
- `dist/md/en/`

`llms.txt` 和 `llms-full.txt` 由 `scripts/generate-seo-files.mjs` 在 `postbuild` 阶段生成。

## 上线前检查

```sh
npm run check
npm run build
```

确认 `dist/` 中存在主要页面，例如：

- `dist/index.html`
- `dist/contact/index.html`
- `dist/projects/index.html`
- `dist/zh-TW/index.html`
- `dist/en/index.html`
- `dist/llms.txt`
- `dist/md/zh-CN/index.md`
