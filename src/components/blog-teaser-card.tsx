import Link from "next/link";
import Image from "next/image";
import { articlePath } from "@/lib/paths";
import type { BlogPost } from "@/lib/blog-data";

/** Kartın gerçekten kullandığı alanlar; BlogPost veya GuideListItem uyumlu. */
type TeaserPost = Pick<BlogPost, "slug" | "title" | "summary" | "categorySlug" | "image" | "cardImage" | "imageAlt">;

type BlogTeaserCardProps = {
  post: TeaserPost;
  /** Topic silo base path, örn. /kidem-tazminati/blog. Verilmezse yazı kök yolda açılır. */
  basePath?: string;
  /** true = rehber listesinde, asıl (detay) görsel kullanılır. false = anasayfa, kart görseli (cardImage) kullanılır. */
  useDetailImage?: boolean;
};

export function BlogTeaserCard({ post, basePath, useDetailImage }: BlogTeaserCardProps) {
  const href = articlePath(post.slug);
  const imageSrc = useDetailImage ? post.image : (post.cardImage ?? post.image);
  const teaser =
    post.summary.length > 150
      ? `${post.summary.slice(0, 147)}...`
      : post.summary;

  return (
    <Link
      href={href}
      className="group relative cursor-pointer rounded-xl bg-card p-4"
    >
      {/* Hover overlay – karttan biraz daha büyük, %25 civarı taşma efekti */}
      <span className="pointer-events-none absolute inset-0 -m-3 rounded-2xl bg-copper/10 opacity-0 transition group-hover:opacity-100" />

      <div
        className={`relative w-full overflow-hidden rounded-[6px] bg-muted ${
          useDetailImage ? "h-[180px]" : "h-[106px]"
        }`}
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={post.imageAlt ?? post.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            Görsel
          </div>
        )}
      </div>
      <div className="relative mt-4 space-y-2">
        <h3 className="break-words text-lg font-semibold leading-snug transition-colors group-hover:text-copper sm:text-[22px]">
          {post.title}
        </h3>
        <div className="space-y-2 text-[15px] text-muted-foreground">
          <p>{teaser}</p>
          <span className="block h-1 w-10 rounded-full bg-copper" />
        </div>
      </div>
    </Link>
  );
}
