import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { addHeadingIdsAndGetToc, enhanceFootnoteHtml } from "@/lib/articleHtml";
import { extractCitations } from "@/lib/footnotes";
import { blogPosts, type ContentBlock } from "@/lib/blog-data";
import { getAuthorBySlug } from "@/lib/authors";
import { getCategoryBySlug, getKnownCategoryName, getRelatedGuides } from "@/lib/content";
import { BreadcrumbBlock } from "@/components/breadcrumb";
import { siteConfig } from "@/lib/site";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArticleSchema } from "@/components/schemas/ArticleSchema";
import { sanitizeHtml } from "@/lib/sanitize";
import { BreadcrumbListSchema } from "@/components/schemas/BreadcrumbListSchema";
import { FAQSchema } from "@/components/schemas/FAQSchema";
import { GuideToc } from "@/components/guide-toc";
import { BackToTop } from "@/components/back-to-top";
import { GuideArticleHeader } from "@/components/article/GuideArticleHeader";
import { AiSummarizeMenu } from "@/components/article/AiSummarizeMenu";
import { CategoryGuidesSidebar } from "@/components/guide-category-sidebar";
import { ContactCta } from "@/components/contact-cta";
import { buildArticleAuthorSchema } from "@/lib/author-profile";
import { articlePath, articleUrl as toArticleUrl, isValidArticleSlug, ARTICLES_PATH } from "@/lib/paths";

const DEFAULT_OG_IMAGE = {
  url: "/images/default-og.jpg",
  width: 1200,
  height: 630,
  alt: siteConfig.name,
};

function articleOgImages(url?: string | null, alt?: string | null) {
  const src = url?.trim();
  if (src) {
    return [{ url: src, width: 1200, height: 630, alt: alt?.trim() || siteConfig.name }];
  }
  return [DEFAULT_OG_IMAGE];
}

function slugifyForId(text: string): string {
  const t = text
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/ı/g, "i")
    .replace(/İ/g, "i")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return t || "baslik";
}

type TocItem = { id: string; label: string; level: "h2" | "h3" };

function getTocFromContentBlocks(blocks: ContentBlock[]): TocItem[] {
  const items: TocItem[] = [];
  const used = new Set<string>();
  for (const b of blocks) {
    if (b.t !== "h2" && b.t !== "h3") continue;
    let id = slugifyForId(b.v);
    if (used.has(id)) {
      let n = 2;
      while (used.has(`${id}-${n}`)) n++;
      id = `${id}-${n}`;
    }
    used.add(id);
    items.push({ id, label: b.v, level: b.t });
  }
  return items;
}

function renderWithBold(text: string, keyPrefix: string) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("*") && part.endsWith("*")) {
      return <strong key={`${keyPrefix}-${i}`}>{part.slice(1, -1)}</strong>;
    }
    return part;
  });
}

function renderContentBlocks(blocks: ContentBlock[], slug: string, tocItems: TocItem[]) {
  let tocIndex = 0;
  return blocks.map((block, idx) => {
    const key = `${slug}-${idx}`;
    switch (block.t) {
      case "h2": {
        const item = tocItems[tocIndex++];
        return (
          <h2 key={key} id={item?.id} className="mt-8 text-[24px] font-semibold text-slate-900 scroll-mt-6">
            {block.v}
          </h2>
        );
      }
      case "h3": {
        const item = tocItems[tocIndex++];
        return (
          <h3 key={key} id={item?.id} className="mt-6 text-[20px] font-semibold text-slate-900 scroll-mt-6">
            {block.v}
          </h3>
        );
      }
      case "p":
        return (
          <p key={key} className="text-[14px] leading-7 text-black">
            {renderWithBold(block.v, key)}
          </p>
        );
      case "ul":
        return (
          <ul key={key} className="list-inside list-disc space-y-2 pl-1 text-[14px]">
            {block.v.map((item, i) => (
              <li key={`${key}-${i}`}>{renderWithBold(item, `${key}-${i}`)}</li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  });
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

type AuthorRow = {
  id: string;
  name: string;
  slug: string;
  photo_url: string | null;
  title?: string | null;
  bar_name?: string | null;
  bar_registration?: string | null;
  sameas_links?: unknown;
  linkedin_url?: string | null;
  instagram_url?: string | null;
  whatsapp_url?: string | null;
};
type FaqItem = { question: string; answer: string };

type ArticleWithAuthor = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  content: string;
  meta_title: string | null;
  meta_description: string | null;
  featured_image_url: string | null;
  featured_image_alt: string | null;
  faq: FaqItem[] | null;
  created_at: string;
  updated_at?: string | null;
  author_id: string | null;
  authors: AuthorRow | null;
};

function schemaDate(iso: string | null | undefined): string {
  if (!iso?.trim()) return "";
  return iso.slice(0, 10);
}

async function getArticleBySlug(slug: string): Promise<ArticleWithAuthor | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("articles")
    .select(
      "id,title,slug,category,content,meta_title,meta_description,featured_image_url,featured_image_alt,faq,created_at,updated_at,author_id,authors(id,name,slug,photo_url,title,bar_name,bar_registration,sameas_links,linkedin_url,instagram_url,whatsapp_url)"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  const row = data as Record<string, unknown>;
  const authors = row.authors as AuthorRow | null;
  return {
    ...row,
    authors: authors ?? null,
  } as ArticleWithAuthor;
}

export async function generateArticleMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isValidArticleSlug(slug)) return { title: "Yazı bulunamadı" };
  const dbArticle = await getArticleBySlug(slug);
  if (dbArticle) {
    const baseTitle = dbArticle.meta_title?.trim() || dbArticle.title;
    const title = baseTitle.endsWith(`| ${siteConfig.name}`) ? baseTitle : `${baseTitle} | ${siteConfig.name}`;
    const rawDesc = dbArticle.meta_description?.trim();
    const description = rawDesc ? `${rawDesc} | ${siteConfig.name}` : undefined;
    const url = toArticleUrl(slug);
    const images = articleOgImages(dbArticle.featured_image_url, dbArticle.featured_image_alt ?? title);
    return {
      title: { absolute: title },
      description,
      openGraph: { title, description, url, images },
      twitter: { card: "summary_large_image" as const, title, description, images: [images[0].url] },
      alternates: { canonical: url },
    };
  }
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: "Yazı bulunamadı" };
  const title = post.seoTitle ?? `${post.title} | ${siteConfig.name}`;
  const description = post.seoDescription ?? (post.summary.length > 160 ? `${post.summary.slice(0, 157)}...` : post.summary);
  const url = toArticleUrl(slug);
  const images = articleOgImages(post.image, post.imageAlt ?? title);
  return {
    title: { absolute: title },
    description,
    openGraph: { title, description, url, images },
    twitter: { card: "summary_large_image", title, description, images: [images[0].url] },
    alternates: { canonical: url },
  };
}

export async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  if (!isValidArticleSlug(slug)) notFound();
  const dbArticle = await getArticleBySlug(slug);
  const categorySlug = dbArticle?.category ?? "";
  const categoryRow = categorySlug ? await getCategoryBySlug(categorySlug) : null;
  const categoryName = categoryRow?.name ?? (categorySlug ? getKnownCategoryName(categorySlug) : null) ?? categorySlug;

  if (dbArticle) {
    const baseUrl = siteConfig.url.replace(/\/$/, "");
    const articleUrl = toArticleUrl(slug);
    const { html: rawHtml, tocItems: contentToc } = addHeadingIdsAndGetToc(dbArticle.content);
    const contentWithIds = enhanceFootnoteHtml(sanitizeHtml(rawHtml));
    const categoryGuides = categorySlug ? await getRelatedGuides(categorySlug, 5, slug) : [];

    const usedIds = new Set(contentToc.map((t) => t.id));
    const tocItems: TocItem[] = [...contentToc];
    const faqIds: string[] = [];
    if (dbArticle.faq && dbArticle.faq.length > 0) {
      tocItems.push({ id: "sik-sorulan-sorular", label: "Sık Sorulan Sorular", level: "h2" });
      for (const item of dbArticle.faq as FaqItem[]) {
        let id = slugifyForId(item.question);
        if (usedIds.has(id)) {
          let n = 2;
          while (usedIds.has(`${id}-${n}`)) n++;
          id = `${id}-${n}`;
        }
        usedIds.add(id);
        faqIds.push(id);
        tocItems.push({ id, label: item.question, level: "h3" });
      }
    }

    return (
      <>
        <BackToTop />
        <BreadcrumbListSchema
          items={[
            { name: "Anasayfa", url: baseUrl },
            { name: categoryName, url: `${baseUrl}/${categorySlug}` },
            { name: "Makaleler", url: `${baseUrl}${ARTICLES_PATH}` },
            { name: dbArticle.title, url: articleUrl },
          ]}
        />
        <div className="mx-auto max-w-6xl space-y-6 px-4 pt-4 pb-10 sm:px-6 sm:pt-6 lg:px-8 lg:pt-10">
          <BreadcrumbBlock
            items={[
              { label: "Anasayfa", href: "/" },
              { label: categoryName, href: `/${categorySlug}` },
              { label: "Makaleler", href: ARTICLES_PATH },
              { label: dbArticle.title },
            ]}
          />
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,2fr)_300px]">
            <article className="min-w-0 max-w-[70ch] space-y-8">
              <div className="space-y-4">
              <GuideArticleHeader
                title={dbArticle.title}
                date={dbArticle.updated_at ?? dbArticle.created_at}
                categoryName={categoryName}
                categoryHref={`/${categorySlug}`}
                author={
                  dbArticle.authors
                    ? {
                        name: dbArticle.authors.name,
                        slug: dbArticle.authors.slug,
                        photoUrl: dbArticle.authors.photo_url,
                        title: dbArticle.authors.title,
                      }
                    : null
                }
              />
              <AiSummarizeMenu title={dbArticle.title} url={articleUrl} />
              </div>
              {tocItems.length > 0 && <GuideToc items={tocItems} />}
              <aside className="md:hidden rounded-[8px] border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">Sorunuz mu var?</p>
                <p className="mt-0.5 text-xs text-slate-600 leading-snug">
                  Editör ekibimize yazın; en kısa sürede dönüş yapalım.
                </p>
                <Link
                  href="/iletisim"
                  className="mt-3 flex w-full items-center justify-center rounded-[8px] bg-slate-800 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-900"
                >
                  İletişime geç
                </Link>
              </aside>
              <div
                id="rehber-icerik"
                className="rehber-icerik space-y-4 text-[14px] text-black text-justify"
                dangerouslySetInnerHTML={{ __html: contentWithIds }}
              />
              {dbArticle.faq && dbArticle.faq.length > 0 && (
                <section className="space-y-4">
                  <h2
                    id="sik-sorulan-sorular"
                    className="flex scroll-mt-6 items-center gap-2 text-xl font-semibold text-slate-900"
                  >
                    <span className="h-5 w-1 rounded-full bg-slate-800" aria-hidden />
                    Sık Sorulan Sorular
                  </h2>
                  <div className="divide-y divide-slate-200 rounded-xl border border-slate-200">
                    {(dbArticle.faq as FaqItem[]).map((item, idx) => (
                      <details key={idx} className="group">
                        <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-4 text-left [&::-webkit-details-marker]:hidden">
                          <h3 id={faqIds[idx]} className="text-[16px] font-semibold text-slate-900 scroll-mt-6">
                            {item.question}
                          </h3>
                          <span className="shrink-0 text-slate-400 transition-transform group-open:rotate-180">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </span>
                        </summary>
                        <div className="px-5 pb-4">
                          <p className="text-[14px] leading-7 text-black">{item.answer}</p>
                        </div>
                      </details>
                    ))}
                  </div>
                </section>
              )}
            </article>
            <div className="hidden md:flex flex-col gap-6 overflow-visible">
              <ContactCta />
              {categoryGuides.length > 0 && (
                <CategoryGuidesSidebar
                  guides={categoryGuides.map((g) => ({ title: g.title, href: articlePath(g.slug), slug: g.slug }))}
                  currentSlug={slug}
                  allGuidesUrl={ARTICLES_PATH}
                />
              )}
            </div>
          </div>
        </div>
        <ArticleSchema
          headline={dbArticle.title}
          description={
            dbArticle.meta_description?.trim()
              ? `${dbArticle.meta_description.trim()} | ${siteConfig.name}`
              : dbArticle.title
          }
          datePublished={schemaDate(dbArticle.created_at)}
          dateModified={schemaDate(dbArticle.updated_at ?? dbArticle.created_at)}
          url={articleUrl}
          image={dbArticle.featured_image_url?.startsWith("http") ? dbArticle.featured_image_url : undefined}
          author={
            dbArticle.authors
              ? buildArticleAuthorSchema(
                  dbArticle.authors.slug,
                  dbArticle.authors.name,
                  baseUrl,
                  dbArticle.authors
                )
              : undefined
          }
          citations={extractCitations(dbArticle.content)}
        />
        {dbArticle.faq && dbArticle.faq.length > 0 && (
          <FAQSchema items={(dbArticle.faq as FaqItem[]).map((f) => ({ question: f.question, answer: f.answer }))} />
        )}
      </>
    );
  }

  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) {
    notFound();
  }

  const staticCategorySlug = post.categorySlug;
  const staticCategoryName =
    (await getCategoryBySlug(staticCategorySlug))?.name ??
    getKnownCategoryName(staticCategorySlug) ??
    staticCategorySlug;

  const categoryGuides = await getRelatedGuides(staticCategorySlug, 5, slug);
  const author = post.authorSlug ? getAuthorBySlug(post.authorSlug) : undefined;

  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const articleUrl = toArticleUrl(slug);
  const tocItems = post.contentBlocks ? getTocFromContentBlocks(post.contentBlocks) : [];

  return (
    <>
      <BackToTop />
      <BreadcrumbListSchema
        items={[
          { name: "Anasayfa", url: baseUrl },
          { name: staticCategoryName, url: `${baseUrl}/${staticCategorySlug}` },
          { name: "Makaleler", url: `${baseUrl}${ARTICLES_PATH}` },
          { name: post.title, url: articleUrl },
        ]}
      />
      <div className="mx-auto max-w-6xl space-y-6 px-4 pt-4 pb-10 sm:px-6 sm:pt-6 lg:px-8 lg:pt-10">
        <BreadcrumbBlock
          items={[
            { label: "Anasayfa", href: "/" },
            { label: staticCategoryName, href: `/${staticCategorySlug}` },
            { label: "Makaleler", href: ARTICLES_PATH },
            { label: post.title },
          ]}
        />

        <div className="grid gap-10 grid-cols-1 md:grid-cols-[minmax(0,2fr)_300px]">
          <article className="min-w-0 max-w-[70ch] space-y-8">
            <div className="space-y-4">
            <GuideArticleHeader
              title={post.title}
              date={post.date}
              categoryName={staticCategoryName}
              categoryHref={`/${staticCategorySlug}`}
              author={
                author
                  ? {
                      name: author.name,
                      slug: author.slug,
                      photoUrl: author.image,
                      title: author.title,
                    }
                  : null
              }
            />
            <AiSummarizeMenu title={post.title} url={articleUrl} />
            </div>

            {tocItems.length > 0 && <GuideToc items={tocItems} />}

            <aside className="md:hidden rounded-[8px] border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Sorunuz mu var?</p>
              <p className="mt-0.5 text-xs text-slate-600 leading-snug">
                Editör ekibimize yazın; en kısa sürede dönüş yapalım.
              </p>
              <Link
                href="/iletisim"
                className="mt-3 flex w-full items-center justify-center rounded-[8px] bg-slate-800 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-900"
              >
                İletişime geç
              </Link>
            </aside>

            <div id="rehber-icerik" className="rehber-icerik space-y-4 text-[14px] text-black text-justify">
              {post.contentBlocks
                ? renderContentBlocks(post.contentBlocks, post.slug, tocItems)
                : post.content.map((paragraph, index) => (
                    <p key={`${post.slug}-${index}`} className="text-[14px] text-black text-justify">{paragraph}</p>
                  ))}
            </div>

            {post.faq && post.faq.length > 0 && (
              <section className="space-y-3">
                <h2
                  id="sik-sorulan-sorular"
                  className="flex scroll-mt-6 items-center gap-2 text-xl font-semibold text-slate-900"
                >
                  <span className="h-5 w-1 rounded-full bg-slate-800" aria-hidden />
                  Sık Sorulan Sorular
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {post.faq.map((item, i) => (
                    <AccordionItem key={i} value={`faq-${i}`}>
                      <AccordionTrigger className="text-left text-[16px] font-bold text-slate-900">{item.question}</AccordionTrigger>
                      <AccordionContent className="text-[14px] leading-7 text-black">{item.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            )}
          </article>

          <div className="hidden md:flex flex-col gap-6 overflow-visible">
            <ContactCta />
            {categoryGuides.length > 0 && (
              <CategoryGuidesSidebar
                guides={categoryGuides.map((g) => ({ title: g.title, href: articlePath(g.slug), slug: g.slug }))}
                currentSlug={slug}
                allGuidesUrl={ARTICLES_PATH}
              />
            )}
          </div>
        </div>
      </div>
      <ArticleSchema
        headline={post.title}
        description={post.summary.length > 160 ? `${post.summary.slice(0, 157)}...` : post.summary}
        datePublished={schemaDate(post.date)}
        dateModified={schemaDate(post.date)}
        url={articleUrl}
        image={post.image ? `${baseUrl}${post.image}` : undefined}
        author={
          author
            ? buildArticleAuthorSchema(author.slug, author.name, baseUrl, {
                linkedin_url: author.socials?.linkedin,
                instagram_url: author.socials?.instagram,
                whatsapp_url: author.socials?.whatsapp,
              })
            : undefined
        }
      />
      {post.faq && post.faq.length > 0 && <FAQSchema items={post.faq} />}
    </>
  );
}
