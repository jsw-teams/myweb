# JS.Gripe / 技诉

JS.Gripe 是基于 `myblog` 文件结构与主题思路二次开发的公开站点。这个仓库负责主站入口、页面内容、项目展示、联系方式、友情链接、隐私说明，以及从 myblog 文章索引加载的写作入口。

当前主题为 `themes/jishu-pixel`。主题尽量沿用 myblog 的组织方式：主题配置、模板、样式和脚本放在主题目录内，站点页面只做必要装配。

## 站务配置

站务信息参考 myblog 的 `config.yml` 维护，根目录 [config.yml](config.yml) 是站点 URL、博客 URL、默认语言、站名、描述、图标、robots 和 llms 文案的入口。

Astro 的 `site`、SEO 绝对地址、博客 feed 同步和 Markdown 镜像都会读取这份配置，不要在源码里另写一份 base URL。

## 本地开发

```sh
npm install
npm run dev
```

常用检查：

```sh
npm run check
npm run build
```

构建产物输出到 `dist/`。

## 内容维护

- 可编辑页面：`content/pages/<page>/index.<lang>.md`
- Astro 页面壳：`src/pages/` 和 `src/pages/[lang]/`
- 主题配置：`themes/jishu-pixel/theme.yml`
- 站务配置：`config.yml`
- 主题样式：`themes/jishu-pixel/style.css`
- 页面样式：`themes/jishu-pixel/styles/`
- 主题脚本：`themes/jishu-pixel/scripts/`
- 吉祥物与站点图标：`public/assets/brand/`

页面内容以 `zh-TW` 为主，并同步维护 `zh-CN` 与 `en`。

## 项目展示

项目展示由人工维护，不在开发或构建时自动拉取 GitHub 仓库。

项目页内容位于：

```text
content/pages/projects/
```

目前项目卡片只保留平台、项目名称和查看源码入口。项目描述暂时留空，后续需要展示时直接改 Markdown 内容。

## 写作入口

写作页保留主站页面结构，文章列表由浏览器端 JS 动态加载：

- 数据入口：`src/pages/recent-posts.json.ts`
- 前端脚本：`public/assets/recent-posts.js`
- 本地数据：`src/data/blog-posts.json`

开发和构建前会运行 `scripts/sync-blog-feed.mjs` 同步 myblog 文章索引。

## 联系方式和页面配置

关于、隐私、联系方式、友情链接等页面都从 `content/pages/` 下的 Markdown 读取。联系方式建议保持三类常见入口：

- 社交媒体，例如 X
- 开发平台，例如 GitHub 或 GitLab
- 邮箱，可选择是否公开 PGP 信息

页脚版权由主题配置决定：

```yaml
footer:
  copyright:
    enabled: true
    text:
      zh-CN: "© {year} JS.Gripe"
      zh-TW: "© {year} JS.Gripe"
      en: "© {year} JS.Gripe"
```

## Sitemap 和 SEO 文件

Sitemap 由 `@astrojs/sitemap` 生成。插件会先生成内部文件，`postbuild` 阶段会发布最终入口：

```text
dist/sitemap.xml
```

`robots.txt`、`llms.txt`、`llms-full.txt` 和 Markdown 镜像由 `scripts/generate-seo-files.mjs` 在 `postbuild` 阶段生成。

## 部署到 Cloudflare Pages

Cloudflare Pages 可以直接连接 `jsw-teams/myweb` 仓库。

推荐设置：

```text
Production branch: main
Framework preset: Astro
Build command: npm run build
Build output directory: dist
Root directory: /
```

环境变量建议：

```text
NODE_VERSION=22
```

项目展示由人工维护，不需要 GitHub 项目同步变量。构建前只会运行 `scripts/sync-blog-feed.mjs` 同步 myblog 文章索引；如果远端 feed 或本地 myblog 不可用，会保留已有的 `src/data/blog-posts.json`。

自定义域名应与 [config.yml](config.yml) 的 `siteUrl` 保持一致。当前配置使用：

```yaml
siteUrl: https://www.js.gripe
```

Cloudflare Pages 会识别构建产物中的 `_headers` 和 `_redirects`。上线后确认这些入口可访问：

```text
/sitemap.xml
/robots.txt
/llms.txt
```

上线前建议确认：

```sh
npm run check
npm run build
```

关键产物：

```text
dist/index.html
dist/sitemap.xml
dist/robots.txt
dist/llms.txt
dist/md/zh-CN/index.md
dist/md/zh-TW/index.md
dist/md/en/index.md
```
