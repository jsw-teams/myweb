import { site } from '../data/site';
import blogPosts from '../data/blog-posts.json';
import type { Lang } from '../i18n/config';

export type BlogPost = {
  title: string;
  url: string;
  date?: string;
  excerpt?: string;
};

const MAX_POSTS = 5;
const postsByLang = blogPosts as Record<Lang, BlogPost[]>;

export function getBlogUrl(lang: Lang): string {
  return new URL(`${lang}/`, site.blogUrl).toString();
}

export function getBlogFeedUrl(lang: Lang): string {
  return new URL(`${lang}/feed.xml`, site.blogUrl).toString();
}

export async function getRecentPosts(lang: Lang): Promise<BlogPost[]> {
  return [...(postsByLang[lang] ?? [])].slice(0, MAX_POSTS);
}
