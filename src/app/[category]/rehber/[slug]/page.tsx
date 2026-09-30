import { permanentRedirect } from "next/navigation";
import { articlePath, isValidArticleSlug, ARTICLES_PATH } from "@/lib/paths";

type PageProps = {
  params: Promise<{ category: string; slug: string }>;
};

export default async function LegacyArticleRedirect({ params }: PageProps) {
  const { slug } = await params;
  if (!isValidArticleSlug(slug)) {
    permanentRedirect(ARTICLES_PATH);
  }
  permanentRedirect(articlePath(slug));
}
