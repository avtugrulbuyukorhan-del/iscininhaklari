import { OrganizationSchema } from "@/components/schemas/OrganizationSchema";
import { WebSiteSchema } from "@/components/schemas/WebSiteSchema";
import { FAQSchema } from "@/components/schemas/FAQSchema";
import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { PracticeAreas } from "@/components/home/PracticeAreas";
import { AboutPreview } from "@/components/home/AboutPreview";
import { BlogHighlights, type HomeArticleCard } from "@/components/home/BlogHighlights";
import { Process } from "@/components/home/Process";
import { HomeTools } from "@/components/home/HomeTools";
import { HomeFaq } from "@/components/home/HomeFaq";
import { CtaBand } from "@/components/home/CtaBand";
import { homeContent } from "@/data/home";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import { createSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { getKnownCategoryName } from "@/lib/content";
import { articlePath } from "@/lib/paths";
import { formatTurkishLongDate } from "@/lib/format-date";

const title = `${siteConfig.name} | İşçi Hakları Rehberi`;
const description = homeContent.hero.support;

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  openGraph: {
    title,
    description,
    url: siteConfig.url,
    type: "website",
    locale: "tr_TR",
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  alternates: { canonical: siteConfig.url },
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

async function getHomeArticles(): Promise<HomeArticleCard[]> {
  try {
    const supabase = createSupabaseAdminClient();
    const { data } = await supabase
      .from("articles")
      .select("title, slug, category, meta_description, content, featured_image_url, created_at")
      .eq("status", "published")
      .not("category", "is", null)
      .order("created_at", { ascending: false })
      .limit(5);
    if (!data?.length) return [];
    return data.map((row) => {
      const category = (row as { category: string }).category;
      const metaDesc = (row as { meta_description?: string | null }).meta_description?.trim() || "";
      const contentText = (row as { content?: string | null }).content
        ? stripHtml((row as { content: string }).content)
        : "";
      const raw = metaDesc || contentText;
      const excerpt = raw.length > 160 ? `${raw.slice(0, 157)}...` : raw;
      return {
        href: articlePath((row as { slug: string }).slug),
        title: (row as { title: string }).title,
        category: getKnownCategoryName(category) ?? category,
        excerpt,
        date: formatTurkishLongDate((row as { created_at?: string }).created_at) ?? "",
        imageSrc: (row as { featured_image_url?: string | null }).featured_image_url ?? undefined,
      };
    });
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const articles = await getHomeArticles();

  return (
    <>
      <OrganizationSchema />
      <WebSiteSchema />
      <FAQSchema
        items={homeContent.faq.items.map((item) => ({
          question: item.q,
          answer: item.a,
        }))}
      />
      <Hero />
      <TrustBar />
      <PracticeAreas />
      <AboutPreview />
      <BlogHighlights articles={articles} />
      <Process />
      <HomeTools />
      <HomeFaq />
      <CtaBand />
    </>
  );
}
