import { createSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { blogPosts } from "@/lib/blog-data";
import { KNOWN_CATEGORIES } from "@/lib/categories";
import { STATIC_PATH_SLUGS } from "@/lib/paths";

export { KNOWN_CATEGORIES, KNOWN_CATEGORY_SLUGS } from "@/lib/categories";

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  intro?: string | null;
  pillar_md?: string | null;
  updated_at?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
};

export function getKnownCategoryName(slug: string): string | null {
  return KNOWN_CATEGORIES[slug] ?? null;
}

export async function isCategoryRouteSlug(slug: string): Promise<boolean> {
  if ((STATIC_PATH_SLUGS as readonly string[]).includes(slug)) return false;
  if (getKnownCategoryName(slug)) return true;
  const row = await getCategoryBySlug(slug);
  return Boolean(row);
}

export async function ensureCategoryExists(slug: string): Promise<void> {
  const name = KNOWN_CATEGORIES[slug];
  if (!name) return;
  try {
    const supabase = createSupabaseAdminClient();
    await supabase.from("categories").upsert({ slug, name }, { onConflict: "slug" });
  } catch {
    return;
  }
}

export async function getCategoryBySlug(slug: string): Promise<CategoryRow | null> {
  try {
    const supabase = createSupabaseAdminClient();
    const { data } = await supabase
      .from("categories")
      .select("id,name,slug,intro,pillar_md,updated_at,meta_title,meta_description")
      .eq("slug", slug)
      .maybeSingle();
    return data as CategoryRow | null;
  } catch {
    return null;
  }
}

export type GuideListItem = {
  slug: string;
  title: string;
  summary: string;
  categorySlug: string;
  image?: string;
  cardImage?: string;
};

async function getArticlesByCategory(
  categorySlug: string
): Promise<(GuideListItem & { _sortDate: string })[]> {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("articles")
    .select("title, slug, meta_description, content, featured_image_url, created_at")
    .eq("category", categorySlug)
    .eq("status", "published")
    .order("created_at", { ascending: false });
  if (!data?.length) return [];
  return data.map((a) => {
    const row = a as {
      title: string;
      slug: string;
      meta_description?: string | null;
      content?: string | null;
      featured_image_url?: string | null;
      created_at: string;
    };
    const metaDesc = row.meta_description?.trim() || "";
    const contentText = row.content
      ? row.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
      : "";
    const raw = metaDesc || contentText;
    const summary = raw.length > 160 ? `${raw.slice(0, 157)}...` : raw;
    return {
      slug: row.slug,
      title: row.title,
      summary,
      categorySlug,
      image: row.featured_image_url ?? undefined,
      cardImage: row.featured_image_url ?? undefined,
      _sortDate: row.created_at,
    };
  });
}

async function getMergedGuidesForCategory(
  categorySlug: string
): Promise<(GuideListItem & { _sortDate: string })[]> {
  const staticPosts = blogPosts
    .filter((p) => p.categorySlug === categorySlug)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      summary: p.summary.length > 160 ? `${p.summary.slice(0, 157)}...` : p.summary,
      categorySlug: p.categorySlug,
      image: p.image,
      cardImage: p.cardImage ?? p.image,
      _sortDate: p.date,
    }));
  const dbArticles = await getArticlesByCategory(categorySlug);
  const dbSlugs = new Set(dbArticles.map((a) => a.slug));
  const staticOnly = staticPosts.filter((p) => !dbSlugs.has(p.slug));
  const merged = [...staticOnly, ...dbArticles];
  merged.sort((a, b) => (b._sortDate < a._sortDate ? -1 : b._sortDate > a._sortDate ? 1 : 0));
  return merged;
}

export async function getRelatedGuides(
  categorySlug: string,
  limit: number,
  excludeSlug?: string
): Promise<GuideListItem[]> {
  const merged = await getMergedGuidesForCategory(categorySlug);
  const filtered = excludeSlug ? merged.filter((p) => p.slug !== excludeSlug) : merged;
  return filtered.slice(0, limit).map(({ _sortDate: _, ...rest }) => rest);
}

export async function getRelatedGuidesPaginated(
  categorySlug: string,
  page: number,
  pageSize: number
): Promise<{ guides: GuideListItem[]; total: number }> {
  const merged = await getMergedGuidesForCategory(categorySlug);
  const total = merged.length;
  const from = (page - 1) * pageSize;
  const guides = merged.slice(from, from + pageSize).map(({ _sortDate: _, ...rest }) => rest);
  return { guides, total };
}

export function getGuidesByAuthor(authorSlug: string) {
  return blogPosts.filter((p) => p.authorSlug === authorSlug);
}
