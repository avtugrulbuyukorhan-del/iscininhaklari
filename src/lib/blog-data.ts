export type ContentBlock =
  | { t: "p"; v: string }
  | { t: "h2"; v: string }
  | { t: "h3"; v: string }
  | { t: "ul"; v: string[] };

export type BlogPost = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  categorySlug: string;
  authorSlug?: string;
  date: string;
  readTime: string;
  image?: string;
  cardImage?: string;
  imageAlt?: string;
  content: string[];
  contentBlocks?: ContentBlock[];
  faq?: { question: string; answer: string }[];
  seoTitle?: string;
  seoDescription?: string;
};

export const FOOTER_POPULAR_GUIDES: { slug: string; title: string; categorySlug: string }[] = [];

export const HOMEPAGE_REHBER_SLUGS: string[] = [];

export const HOMEPAGE_DYNAMIC_REHBER_TITLES: string[] = [];

export const blogPosts: BlogPost[] = [];
