# Progress

## Phase 0 - Workspace Check

### Changes
- Inspected the current workspace before making project changes.
- Confirmed the directory is not an existing frontend project: `package.json`, `src/`, and `astro.config.mjs` are absent.
- Confirmed `public/assets/brand/mascot-sheet.png` and `public/assets/brand/site-icon.png` already exist.

### Verification
- Listed the root directory and `public/assets/brand`.
- No build was run in this phase because the Astro project has not been initialized yet.

### Next Step
- Initialize Astro + TypeScript directly in the current directory and add the base project configuration.

## Phase 1 - Astro Skeleton

### Changes
- Added Astro, TypeScript, and npm script configuration directly in the workspace root.
- Added a minimal root language entry page with browser-language redirect and noscript language links.
- Added a developer-only README with local and Cloudflare Pages commands.

### Verification
- `npm install` could not run because `npm` is not available in the current shell.
- Checked for `node`, `npm.cmd`, and `pnpm`; none are currently available on PATH.

### Next Step
- Install npm dependencies, verify the skeleton build, then add shared site data, i18n, and layout files.

## Phase 2 - Site Data And I18n Core

### Changes
- Added language configuration for `zh-CN`, `zh-TW`, and `en`.
- Added restrained multilingual copy for all required public pages.
- Added shared site metadata, navigation data, SEO helpers, and a clean public-project data layer.

### Verification
- `npm run build` attempted, but `npm` is not available in the current shell.

### Next Step
- Add shared layout, SEO head rendering, navigation, language links, mascot card, and global styles.

## Phase 3 - Layout And Visual System

### Changes
- Added the shared Astro layout with semantic structure, skip link, and dynamic `html lang`.
- Added SEO, header, footer, language links, and mascot components.
- Added global responsive styling with visible focus states and reduced-motion support.

### Verification
- `npm run check` attempted, but `npm` is not available in the current shell.

### Next Step
- Add friends/contact data and implement all localized HTML pages.

## Phase 4 - Localized Pages

### Changes
- Added data files for friend links and public contact options.
- Added all localized routes for home, projects, writing, privacy, friends, and contact.
- Added empty states for projects, friends, and contact without exposing private or implementation details.

### Verification
- Pending because Node/npm are not available in the current shell.

### Next Step
- Add Cloudflare headers, robots, sitemap, llms files, and Markdown mirrors for Agent access.

## Phase 5 - Static Discovery Files

### Changes
- Added `robots.txt` and a static sitemap for the root and all localized HTML pages.
- Added `llms.txt` and `llms-full.txt` for Agent-friendly site discovery.
- Added Cloudflare Pages `_headers` with baseline security headers, `Vary: Accept`, and long asset caching.

### Verification
- Pending because Node/npm are not available in the current shell.

### Next Step
- Add Markdown mirrors for each localized page, starting with `zh-CN`.

## Phase 6 - zh-CN Markdown Mirrors

### Changes
- Added Markdown mirrors for all simplified Chinese pages under `public/md/zh-CN`.
- Kept the Markdown content direct and free of navigation or deployment details.

### Verification
- Pending because Node/npm are not available in the current shell.

### Next Step
- Add `zh-TW` Markdown mirrors.

## Phase 7 - zh-TW Markdown Mirrors

### Changes
- Added Markdown mirrors for all traditional Chinese pages under `public/md/zh-TW`.
- Matched the same concise public-facing content model as the HTML pages.

### Verification
- Pending because Node/npm are not available in the current shell.

### Next Step
- Add English Markdown mirrors.

## Phase 8 - English Markdown Mirrors

### Changes
- Added Markdown mirrors for all English pages under `public/md/en`.
- Completed the required static Markdown mirror set for all three languages.

### Verification
- Pending because Node/npm are not available in the current shell.

### Next Step
- Run static inspections, fix any syntax or content issues, and retry npm checks if the command becomes available.

## Phase 9 - Static Polish

### Changes
- Added full root-page alternate, OpenGraph, Twitter, favicon, and apple touch metadata.
- Adjusted JSON-LD rendering to use an explicit script close tag.
- Added small list and notice styles used by privacy and contact pages.

### Verification
- Ran static file listing and content searches.
- npm-based verification remains blocked because Node/npm are not available in the current shell.

### Next Step
- Re-run static checks for required routes, metadata markers, and asset references.

## Phase 10 - Final Static Verification

### Changes
- No project files changed beyond verification notes.

### Verification
- Confirmed 18 Markdown mirrors exist under `public/md`.
- Confirmed `_headers` contains `Vary: Accept`, baseline security headers, and long-cache asset headers.
- Confirmed `robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt`, and the required brand asset references are present.
- Retried `npm install`, `npm run build`, and `npm run check`; all are blocked because `npm` is not available on PATH in this shell.

### Next Step
- Install or expose Node.js/npm in the environment, then run `npm install`, `npm run build`, and `npm run check`.

## Phase 11 - Local Toolchain Follow-Up

### Changes
- Located Node/npm at `C:\Program Files\nodejs` and used a temporary PATH update for local commands.
- Added `is:inline` to the JSON-LD script to silence the Astro check hint.

### Verification
- `npm run check` reached Astro diagnostics and reported only the JSON-LD hint before the fix.
- A parallel build/check attempt caused a Windows `spawn EPERM`, so follow-up verification will run commands sequentially.

### Next Step
- Run audit with registry access, update dependencies if needed, then run build/check sequentially.

## Phase 12 - Dependency Security Pass

### Changes
- Upgraded `astro` to the current 6.x release to clear the direct Astro advisory.
- Installed the npm-audit recommended `@astrojs/check@0.9.2` exact version.
- Added an npm override for `yaml@2.8.3` to replace the vulnerable nested YAML parser used by the check toolchain.

### Verification
- `npm audit` confirmed the original direct Astro issue was removed after upgrading.
- Follow-up audit and build/check are pending after refreshing the lockfile with the override.

### Next Step
- Refresh npm dependencies, confirm audit is clean, then continue content and layout polish.

## Phase 13 - Visitor-Facing Copy And Mascot Crops

### Changes
- Generated local mascot crops from the uploaded sheet with `sharp`: home, laptop, friends, and contact variants.
- Updated pages to use page-appropriate local mascot crops instead of scaling the entire sheet everywhere.
- Reworked placeholder copy so it reads like public-facing display content, not administrator notes.

### Verification
- Viewed generated mascot crops and refined edge crops for friends/contact.
- `npm install` after dependency overrides reported 0 vulnerabilities.

### Next Step
- Sync Markdown mirrors and llms summaries with the polished public copy.

## Phase 14 - zh-CN Markdown Copy Sync

### Changes
- Updated simplified Chinese Markdown mirrors to match the cleaner visitor-facing page copy.
- Removed README-like and administrator-style phrasing from these mirrors.

### Verification
- Pending final static text scan after all Markdown mirrors are updated.

### Next Step
- Sync `zh-TW` and English Markdown mirrors.

## Phase 15 - zh-TW And English Markdown Copy Sync

### Changes
- Updated traditional Chinese and English Markdown mirrors with the polished display copy.
- Removed repeated "entry/later" phrasing from Agent-facing page mirrors.

### Verification
- Pending final static text scan after llms summaries are updated.

### Next Step
- Update `llms-full.txt` summary content and run duplicate/README-style copy scans.

## Phase 16 - llms Summary Copy Sync

### Changes
- Updated `llms-full.txt` to match the visitor-facing copy used by HTML and Markdown mirrors.
- Removed stale "later/entry" style phrasing from the full Agent summary.

### Verification
- Pending static text scans and npm verification.

### Next Step
- Run text scans, build, check, audit, and local layout inspection.

## Phase 17 - Copy Scan Cleanup

### Changes
- Replaced remaining public-facing "entry/入口" phrasing in root metadata and footer copy.
- Confirmed static copy scans no longer show README/deployment/admin-facing terms in public content.

### Verification
- `npm audit` reports 0 vulnerabilities.
- Additional build/check and layout inspection still pending.

### Next Step
- Run build/check, serve the site locally, and inspect rendered layout.

## Phase 18 - Mobile Layout Fix

### Changes
- Fixed mobile page-shell width to use `calc()` inside `min()`, preventing right-edge clipping in Edge.
- Changed the home entry cards from four narrow desktop columns to two wider columns for cleaner Chinese headings.

### Verification
- Headless Edge screenshots identified the clipping and narrow-card issue.
- Rebuild and screenshot verification are pending after this CSS fix.

### Next Step
- Rebuild, rerun checks, and retake desktop/mobile screenshots.

## Phase 19 - TypeScript Deprecation Warning

### Changes
- Added `compilerOptions.ignoreDeprecations: "6.0"` to silence the TypeScript 6 warning for `baseUrl` before TypeScript 7.0.

### Verification
- Pending `npm run check` and `npm run build`.

### Next Step
- Stop temporary preview processes, clean verification artifacts, and rerun checks.

## Phase 20 - README And Language Switch Stability

### Changes
- Updated README with Cloudflare Pages deployment steps and content maintenance notes.
- Adjusted mobile navigation and language links to stay on one horizontal row, reducing layout shift when switching languages.
- Stopped the old Astro preview processes on port 4321.

### Verification
- Pending final build, check, and audit after these changes.

### Next Step
- Run final validation commands.

## Phase 21 - Chrome Preview And Mobile Stability

### Changes
- Replaced the mobile shell width calculation with `max-width` plus padding for more robust viewport sizing.
- Changed the mobile primary nav to a stable two-row grid so language switching does not shift layout height or hide the current page.

### Verification
- Pending Chrome-based screenshot verification.

### Next Step
- Rebuild, run checks, and preview with Google Chrome.

## Phase 22 - Git Publish Cleanup

### Changes
- Expanded `.gitignore` to exclude dependencies, build output, Astro cache, local screenshots, browser profiles, and preview logs.

### Verification
- Found the previous Git history was tracking generated folders such as `node_modules`, `.astro`, `.edge-shot-profile`, `dist`, and screenshots.

### Next Step
- Rebuild a clean local `main` history before pushing to GitHub, because a normal cleanup commit would still push the old large generated-file commit.

## Phase 23 - GitHub Push Through Proxy

### Changes
- Configured repository-local Git proxy settings for `http://127.0.0.1:10808`.
- Set Git HTTP transport to `HTTP/1.1` with a larger post buffer for proxy compatibility.
- Rebuilt `main` as a clean one-commit history so generated folders are not part of the branch history.

### Verification
- Confirmed `127.0.0.1:10808` was reachable.
- Confirmed `main` had one clean commit and did not track `node_modules`, `dist`, `.astro`, browser profiles, screenshots, or preview logs.
- Pushed `main` to `https://github.com/jsw-teams/myweb.git` successfully.
