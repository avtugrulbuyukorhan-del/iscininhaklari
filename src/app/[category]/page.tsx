import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/adminClient";
import {
  getCategoryBySlug,
  getKnownCategoryName,
  ensureCategoryExists,
  getRelatedGuidesPaginated,
  isCategoryRouteSlug,
  KNOWN_CATEGORY_SLUGS,
} from "@/lib/content";
import type { CategoryRow } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { CategoryHubSchemas } from "@/components/schemas/CategoryHubSchemas";
import { BreadcrumbBlock } from "@/components/breadcrumb";
import { BlogTeaserCard } from "@/components/blog-teaser-card";
import { BlogArticlePage, generateArticleMetadata } from "@/components/article/BlogArticlePage";
import { blogPosts } from "@/lib/blog-data";
import { isValidArticleSlug } from "@/lib/paths";

const PAGE_SIZE = 9;

type PageProps = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
};

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: slug } = await params;
  if (!(await isCategoryRouteSlug(slug))) {
    return generateArticleMetadata({ params: Promise.resolve({ slug }) });
  }
  await ensureCategoryExists(slug);
  let category = await getCategoryBySlug(slug);
  const fallbackName = getKnownCategoryName(slug);
  if (!category && fallbackName) {
    category = { id: "", name: fallbackName, slug, intro: null, pillar_md: null, updated_at: null };
  }
  if (!category) {
    return { title: "Kategori bulunamadı" };
  }
  const title = category.meta_title?.trim() || category.name;
  const description =
    category.meta_description?.trim() ||
    (category.intro && category.intro.slice(0, 150).trim()) ||
    `${category.name} kategorisinde işçi hakları rehber yazıları.`;
  const url = `${siteConfig.url}/${slug}`;
  return {
    title,
    description: description.slice(0, 160),
    openGraph: { title: `${siteConfig.name} | ${title}`, description, url },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: url },
  };
}

export async function generateStaticParams() {
  const articleParams = blogPosts
    .filter((p) => isValidArticleSlug(p.slug))
    .map((p) => ({ category: p.slug }));
  try {
    const supabase = createSupabaseAdminClient();
    const { data } = await supabase.from("categories").select("slug");
    const categoryParams = data?.length
      ? data.map((c) => ({ category: c.slug }))
      : KNOWN_CATEGORY_SLUGS.map((slug) => ({ category: slug }));
    return [...categoryParams, ...articleParams];
  } catch {
    return [...KNOWN_CATEGORY_SLUGS.map((slug) => ({ category: slug })), ...articleParams];
  }
}

export default async function RootSlugPage({ params, searchParams }: PageProps) {
  const { category: slug } = await params;
  if (!(await isCategoryRouteSlug(slug))) {
    return <BlogArticlePage params={Promise.resolve({ slug })} />;
  }
  return <CategoryHubPage params={params} searchParams={searchParams} />;
}

async function CategoryHubPage({ params, searchParams }: PageProps) {
  const { category: categorySlug } = await params;
  const { page: pageParam } = await searchParams;
  await ensureCategoryExists(categorySlug);
  let category: CategoryRow | null = await getCategoryBySlug(categorySlug);
  const fallbackName = getKnownCategoryName(categorySlug);
  if (!category && fallbackName) {
    category = { id: "", name: fallbackName, slug: categorySlug, intro: null, pillar_md: null, updated_at: null };
  }
  if (!category) {
    notFound();
  }

  const page = Math.max(1, parseInt(String(pageParam), 10) || 1);
  const { guides, total } = await getRelatedGuidesPaginated(categorySlug, page, PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const toShow =
    currentPage !== page
      ? (await getRelatedGuidesPaginated(categorySlug, currentPage, PAGE_SIZE)).guides
      : guides;

  const categoryUrl = `${siteConfig.url.replace(/\/$/, "")}/${categorySlug}`;
  const description =
    category.meta_description?.trim() ||
    category.intro?.trim() ||
    `${category.name} kategorisinde işçi hakları rehber yazıları.`;

  return (
    <>
      <CategoryHubSchemas
        categoryName={category.name}
        categoryUrl={categoryUrl}
        description={description}
      />
      <div className="mx-auto max-w-6xl space-y-8 px-4 pt-4 pb-10 sm:px-6 sm:pt-6 lg:px-8 lg:pt-10">
        <header className="space-y-3">
          <BreadcrumbBlock
            items={[
              { label: "Anasayfa", href: "/" },
              { label: category.name },
            ]}
          />
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{category.name}</h1>
          {category.intro ? (
            <p className="max-w-3xl text-sm leading-7 text-slate-600">{category.intro}</p>
          ) : (
            <p className="max-w-3xl text-sm leading-7 text-slate-600">{description}</p>
          )}
        </header>

        {toShow.length > 0 ? (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {toShow.map((post) => (
                <BlogTeaserCard
                  key={post.slug}
                  post={post}
                  basePath={`/${categorySlug}/blog`}
                />
              ))}
            </div>
            {totalPages > 1 && (
              <nav className="flex flex-wrap items-center justify-center gap-2 pt-4" aria-label="Sayfa navigasyonu">
                {currentPage > 1 ? (
                  <Link
                    href={currentPage === 2 ? `/${categorySlug}` : `/${categorySlug}?page=${currentPage - 1}`}
                    className="rounded-lg border border-primary bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    Önceki
                  </Link>
                ) : (
                  <span className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-400">
                    Önceki
                  </span>
                )}
                <span className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) =>
                    p === currentPage ? (
                      <span
                        key={p}
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary font-medium text-white"
                        aria-current="page"
                      >
                        {p}
                      </span>
                    ) : (
                      <Link
                        key={p}
                        href={p === 1 ? `/${categorySlug}` : `/${categorySlug}?page=${p}`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        {p}
                      </Link>
                    )
                  )}
                </span>
                {currentPage < totalPages ? (
                  <Link
                    href={`/${categorySlug}?page=${currentPage + 1}`}
                    className="rounded-lg border border-primary bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    Sonraki
                  </Link>
                ) : (
                  <span className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-400">
                    Sonraki
                  </span>
                )}
              </nav>
            )}
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
            Bu kategoride henüz rehber yok.
          </div>
        )}
      </div>
    </>
  );
}
