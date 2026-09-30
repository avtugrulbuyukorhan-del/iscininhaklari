import type { FaqItem } from "@/types/article";

export const ARTICLE_PREVIEW_STORAGE_KEY = "iscininhaklari_article_preview";

export type ArticlePreviewAuthor = {
  name: string;
  slug: string;
  photoUrl?: string | null;
  title?: string | null;
};

export type ArticlePreviewData = {
  title: string;
  content: string;
  slug: string;
  category: string | null;
  categoryLabel: string | null;
  author: ArticlePreviewAuthor | null;
  faq: FaqItem[];
  created_at: string;
  updated_at?: string;
};
