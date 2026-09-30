import type { Metadata } from "next";
import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { getKnownCategoryName } from "@/lib/content";
import { blogPosts, type BlogPost } from "@/lib/blog-data";
import { SearchBar } from "@/components/search-bar";
import { BreadcrumbBlock } from "@/components/breadcrumb";
import { BlogTeaserCard } from "@/components/blog-teaser-card";
import { CategoryHubSchemas } from "@/components/schemas/CategoryHubSchemas";
import { siteConfig } from "@/lib/site";
import { ARTICLES_PATH } from "@/lib/paths";

const _title = "Makaleler | İşçinin Hakları";
const _desc = "İşçi hakları, kıdem tazminatı, fazla mesai ve işten çıkarma konularında sade makaleler.";
const _url = `${siteConfig.url.replace(/\/$/, "")}${ARTICLES_PATH}`;

export const metadata: Metadata = {
  title: { absolute: _title },
  description: _desc,
  openGraph: { title: _title, description: _desc, url: _url },
  twitter: { card: "summary_large_image", title: _title, description: _desc },
  alternates: { canonical: _url },
};

export const revalidate = 3600;

type GuidePageProps = {
  searchParams?: Promise<{ page?: string; q?: string }>;
};

type GuideListItem = Pick<BlogPost, "slug" | "title" | "summary" | "categorySlug" | "image" | "cardImage"> & {
  category: string;
  sortDate: string;
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function listHref(opts: { page?: number; query?: string }): string {
  const params = new URLSearchParams();
  if (opts.query) params.set("q", opts.query);
  if (opts.page && opts.page > 1) params.set("page", String(opts.page));
  const qs = params.toString();
  return qs ? `${ARTICLES_PATH}?${qs}` : ARTICLES_PATH;
}

async function getPublishedArticles(): Promise<GuideListItem[]> {
  try {
    const supabase = createSupabaseAdminClient();
    const { data } = await supabase
      .from("articles")
      .select("title, slug, category, meta_description, content, featured_image_url, created_at")
      .eq("status", "published")
      .not("category", "is", null)
      .order("created_at", { ascending: false });
    if (!data?.length) return [];
    return data.map((a) => {
      const category = (a as { category: string }).category;
      const metaDesc = (a as { meta_description?: string | null }).meta_description?.trim() || "";
      const contentText = (a as { content?: string | null }).content ? stripHtml((a as { content: string }).content) : "";
      const raw = metaDesc || contentText;
      const summary = raw.length > 160 ? `${raw.slice(0, 157)}...` : raw;
      return {
        slug: (a as { slug: string }).slug,
        title: (a as { title: string }).title,
        summary,
        category: getKnownCategoryName(category) ?? category,
        categorySlug: category,
        image: (a as { featured_image_url?: string | null }).featured_image_url ?? undefined,
        cardImage: (a as { featured_image_url?: string | null }).featured_image_url ?? undefined,
        sortDate: (a as { created_at: string }).created_at ?? new Date().toISOString(),
      };
    });
  } catch {
    return [];
  }
}

function blogPostsToGuideList(posts: BlogPost[]): GuideListItem[] {
  return posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    summary: p.summary.length > 160 ? `${p.summary.slice(0, 157)}...` : p.summary,
    category: p.category,
    categorySlug: p.categorySlug,
    image: p.image,
    cardImage: p.cardImage ?? p.image,
    sortDate: p.date,
  }));
}

function normalizeForSearch(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/ı/g, "i")
    .replace(/İ/g, "i");
}

function filterByQuery(items: GuideListItem[], q: string): GuideListItem[] {
  const term = normalizeForSearch(q.trim());
  if (!term) return items;
  return items.filter((item) => {
    const title = normalizeForSearch(item.title);
    const summary = normalizeForSearch(item.summary);
    const category = normalizeForSearch(item.category);
    const slug = normalizeForSearch(item.slug);
    return title.includes(term) || summary.includes(term) || category.includes(term) || slug.includes(term);
  });
}

export default async function MakalelerPage({ searchParams }: GuidePageProps) {
  const params = await searchParams;
  const pageSize = 6;
  const query = (params?.q ?? "").trim();

  const [dbItems, staticItems] = await Promise.all([
    getPublishedArticles(),
    Promise.resolve(blogPostsToGuideList(blogPosts)),
  ]);
  const dbSlugs = new Set(dbItems.map((a) => a.slug));
  const staticOnly = staticItems.filter((p) => !dbSlugs.has(p.slug));
  const merged = [...dbItems, ...staticOnly].sort(
    (a, b) => new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime()
  );
  const filteredPosts = filterByQuery(merged, query);

  const currentPage = Math.max(1, Number(params?.page ?? "1") || 1);
  const totalItems = filteredPosts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const start = (currentPage - 1) * pageSize;
  const visiblePosts = filteredPosts.slice(start, start + pageSize);

  return (
    <div className="space-y-8 px-4 pt-4 pb-10 sm:px-6 sm:pt-6 lg:px-8 lg:pt-10">
      <CategoryHubSchemas
        categoryName="Makaleler"
        categoryUrl={_url}
        description={_desc}
        breadcrumbItems={[
          { name: "Anasayfa", url: siteConfig.url.replace(/\/$/, "") },
          { name: "Makaleler", url: _url },
        ]}
      />
      <section className="space-y-3">
        <BreadcrumbBlock
          items={[
            { label: "Anasayfa", href: "/" },
            { label: "Makaleler" },
          ]}
        />
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Makaleler</h1>
            <p className="text-sm text-muted-foreground">
              İşçi hakları konularında sade ve pratik anlatımlar.
            </p>
          </div>
          <div className="w-full md:w-[360px]">
            <SearchBar
              placeholder="Makaleler içinde ara"
              size="sm"
              searchPath={ARTICLES_PATH}
              initialQuery={query}
            />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        {query && totalItems === 0 ? (
          <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
            &quot;{query}&quot; aramasıyla eşleşen makale bulunamadı.
          </p>
        ) : totalItems === 0 ? (
          <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
            Henüz makale eklenmemiş.
          </p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {visiblePosts.map((post, i) => (
              <BlogTeaserCard key={`${post.categorySlug}-${post.slug}-${start + i}`} post={post} useDetailImage />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
            <span className="shrink-0">
              Sayfa {currentPage} / {totalPages}
            </span>
            <div className="flex shrink-0 items-center gap-2">
              {currentPage > 1 && (
                <Link
                  href={listHref({ page: currentPage - 1, query })}
                  className="rounded-md border px-3 py-1 hover:border-foreground"
                >
                  Önceki
                </Link>
              )}
              {currentPage < totalPages && (
                <Link
                  href={listHref({ page: currentPage + 1, query })}
                  className="rounded-md border px-3 py-1 hover:border-foreground"
                >
                  Sonraki
                </Link>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
