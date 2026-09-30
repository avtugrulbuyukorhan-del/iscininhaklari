"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { homeContent } from "@/data/home";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/home/FadeIn";
import { SectionHeading } from "@/components/home/SectionHeading";

export type HomeArticleCard = {
  href: string;
  title: string;
  category: string;
  excerpt?: string;
  date: string;
  imageSrc?: string;
};

export function BlogHighlights({ articles = [] }: { articles?: HomeArticleCard[] }) {
  const { blog } = homeContent;
  const fallbackImage = blog.fallbackImage;
  const featured = articles[0] ?? null;
  const items = articles.slice(1, 5);

  return (
    <section className="bg-white py-20 sm:py-24">
      <Container>
        <FadeIn>
          <SectionHeading eyebrow={blog.eyebrow} title={blog.title} intro={blog.intro} />
        </FadeIn>
        {featured ? (
          <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)] lg:gap-10">
            <FadeIn>
              <article>
                <Link
                  href={featured.href}
                  className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper"
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[4px] bg-white">
                    <Image
                      src={featured.imageSrc || fallbackImage}
                      alt={featured.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(min-width: 1024px) 55vw, 100vw"
                    />
                  </div>
                  <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-copper">
                    {featured.category}
                  </p>
                  <h3 className="mt-2 font-serif text-2xl leading-snug text-ink transition-colors group-hover:text-copper sm:text-3xl">
                    {featured.title}
                  </h3>
                  {featured.excerpt ? (
                    <p className="mt-3 text-[15px] leading-7 text-ink/70">{featured.excerpt}</p>
                  ) : null}
                  <p className="mt-4 text-xs tracking-wide text-ink/45">{featured.date}</p>
                </Link>
              </article>
            </FadeIn>
            <div className="flex flex-col divide-y divide-ink/10">
              {items.map((item, i) => (
                <FadeIn key={item.href} delay={0.06 * (i + 1)}>
                  <article>
                    <Link
                      href={item.href}
                      className="group flex gap-4 py-5 first:pt-0 last:pb-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper sm:gap-5"
                    >
                      <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-[4px] bg-white sm:h-24 sm:w-32">
                        <Image
                          src={item.imageSrc || fallbackImage}
                          alt=""
                          fill
                          unoptimized
                          className="object-cover"
                          sizes="128px"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-copper">
                          {item.category}
                        </p>
                        <h3 className="mt-1 font-serif text-lg leading-snug text-ink transition-colors group-hover:text-copper">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-xs text-ink/45">{item.date}</p>
                      </div>
                    </Link>
                  </article>
                </FadeIn>
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-12 rounded-[4px] border border-dashed border-ink/20 px-5 py-8 text-center text-sm text-ink/55">
            Henüz makale eklenmemiş.
          </p>
        )}
        <FadeIn>
          <div className="mt-10 border-t border-ink/10 pt-8">
            <Link
              href={blog.allHref}
              className="inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-copper"
            >
              {blog.allLabel}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
