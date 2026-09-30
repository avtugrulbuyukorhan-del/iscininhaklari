"use client";

import Image from "next/image";
import Link from "next/link";
import { homeContent } from "@/data/home";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/home/FadeIn";
import { Button } from "@/components/ui/button";

export function Hero() {
  const { hero } = homeContent;

  return (
    <section className="relative overflow-hidden bg-white text-ink">
      <Container className="relative grid items-center gap-12 py-24 sm:py-28 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16 lg:py-32">
        <FadeIn>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-copper">{hero.eyebrow}</p>
          <h1 className="mt-5 max-w-xl font-serif text-[2.05rem] leading-[1.15] tracking-tight sm:text-5xl lg:text-[52px]">
            {hero.headline}
          </h1>
          <p className="mt-6 max-w-lg text-[15px] leading-7 text-ink/70 sm:text-base">{hero.support}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild variant="copper" size="lg" className="h-12 px-6 font-semibold">
              <Link href={hero.primary.href}>{hero.primary.label}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 border-ink/25 px-6 font-medium text-ink hover:border-ink/50">
              <Link href={hero.secondary.href}>{hero.secondary.label}</Link>
            </Button>
          </div>
        </FadeIn>
        <FadeIn delay={0.12} className="w-full max-w-sm lg:justify-self-end">
          <div className="relative p-3">
            <span className="absolute top-0 left-0 h-20 w-20 border-t border-l border-navy" aria-hidden />
            <span className="absolute right-0 bottom-0 h-20 w-20 border-r border-b border-copper" aria-hidden />
            <div className="relative aspect-square overflow-hidden rounded-[4px] bg-navy shadow-[0_18px_40px_rgba(30,58,95,0.16)]">
              <Image
                src={hero.image.src}
                alt={hero.image.alt}
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 384px, 90vw"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-navy via-navy/55 to-transparent" />
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
