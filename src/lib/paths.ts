import { siteConfig } from "@/lib/site";
import { slugify } from "@/lib/slugify";
import { KNOWN_CATEGORY_SLUGS } from "@/lib/categories";

export const ARTICLE_SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const ARTICLES_PATH = "/makaleler";

export const STATIC_PATH_SLUGS = [
  "rehber",
  "iletisim",
  "hakkimizda",
  "istifa-dilekcesi",
  "dilekce-yaz",
  "hesaplama-araclari",
  "hesaplama",
  "kidem-tazminati-hesaplama",
  "kvkk",
  "kvkk-basvuru-formu",
  "gizlilik-sozlesmesi",
  "sorumluluk-reddi",
  "aydinlatma-beyani-ve-acik-riza-onayi",
  "onizleme",
  "yazar",
  "admin",
  "blog",
  "makaleler",
  "category",
  "api",
] as const;

export function isTopLevelReservedSlug(slug: string): boolean {
  return (STATIC_PATH_SLUGS as readonly string[]).includes(slug) || KNOWN_CATEGORY_SLUGS.includes(slug);
}

export function isValidArticleSlug(slug: string): boolean {
  return ARTICLE_SLUG_RE.test(slug) && !isTopLevelReservedSlug(slug);
}

export function normalizeArticleSlug(input: string): string {
  return slugify(input);
}

export function articlePath(slug: string): string {
  return `/${slug}`;
}

export function articleUrl(slug: string, origin = siteConfig.url): string {
  return `${origin.replace(/\/$/, "")}${articlePath(slug)}`;
}
