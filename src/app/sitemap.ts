import type { MetadataRoute } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { siteConfig } from "@/lib/site";
import { blogPosts } from "@/lib/blog-data";
import { KNOWN_CATEGORY_SLUGS } from "@/lib/content";
import { articleUrl, ARTICLES_PATH } from "@/lib/paths";
import { CALCULATOR_PATHS } from "@/lib/calculators/config";

type SitemapEntry = MetadataRoute.Sitemap[number];

function latestDate(...values: (string | null | undefined)[]): Date {
  const times = values
    .filter((v): v is string => typeof v === "string" && v.length > 0)
    .map((v) => new Date(v).getTime())
    .filter((t) => Number.isFinite(t));
  return times.length ? new Date(Math.max(...times)) : new Date();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;

  const staticPages: SitemapEntry[] = [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}${ARTICLES_PATH}`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/hesaplama-araclari`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/hesaplama-araclari/kidem-tazminati-hesaplama`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}${CALCULATOR_PATHS.ihbar}`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}${CALCULATOR_PATHS.fazlaMesai}`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}${CALCULATOR_PATHS.yillikIzin}`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/dilekce-yaz`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/dilekce-yaz/istifa-dilekcesi`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/hakkimizda`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/iletisim`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/kvkk-basvuru-formu`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/sorumluluk-reddi`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/aydinlatma-beyani-ve-acik-riza-onayi`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  let categorySlugs: { slug: string; updated_at: string | null }[] = KNOWN_CATEGORY_SLUGS.map((slug) => ({
    slug,
    updated_at: null,
  }));
  let articles: { slug: string; category: string; updated_at?: string }[] = [];

  try {
    const supabase = createSupabaseServerClient();
    const { data: categoriesFromDb } = await supabase.from("categories").select("slug, updated_at");
    if (categoriesFromDb?.length) {
      categorySlugs = categoriesFromDb as { slug: string; updated_at: string | null }[];
    }
    const { data: articleRows } = await supabase
      .from("articles")
      .select("slug, category, updated_at")
      .eq("status", "published")
      .not("category", "is", null);
    articles = (articleRows ?? []) as { slug: string; category: string; updated_at?: string }[];
  } catch {
    articles = [];
  }

  const categoryEntries: SitemapEntry[] = categorySlugs.flatMap((cat) => {
    const lastMod = cat.updated_at ? new Date(cat.updated_at) : new Date();
    const slug = cat.slug;
    return [
      { url: `${base}/${slug}`, lastModified: lastMod, changeFrequency: "weekly" as const, priority: 0.9 },
      { url: `${base}/${slug}/blog`, lastModified: lastMod, changeFrequency: "weekly" as const, priority: 0.8 },
    ];
  });

  const rehberStatic: SitemapEntry[] = blogPosts.map((post) => ({
    url: articleUrl(post.slug, base),
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  const rehberDb: SitemapEntry[] = articles.map((a) => ({
    url: articleUrl(a.slug, base),
    lastModified: latestDate(a.updated_at),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryEntries, ...rehberStatic, ...rehberDb];
}
