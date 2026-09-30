import type { Metadata } from "next";
import { ArticlePreview } from "@/components/article/ArticlePreview";

export const metadata: Metadata = {
  title: { absolute: "Yazı Önizleme | İşçinin Hakları" },
  robots: { index: false, follow: false },
};

export default function ArticlePreviewPage() {
  return <ArticlePreview />;
}
