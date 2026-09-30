"use client";

import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";
import { homeContent } from "@/data/home";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/home/FadeIn";
import { SectionHeading } from "@/components/home/SectionHeading";

export function HomeTools() {
  const { tools } = homeContent;

  return (
    <section id={tools.id} className="scroll-mt-24 bg-white py-20 sm:py-24">
      <Container>
        <FadeIn>
          <SectionHeading eyebrow={tools.eyebrow} title={tools.title} intro={tools.intro} />
        </FadeIn>
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {tools.items.map((item, i) => {
            const className =
              "group flex h-full items-start gap-4 rounded-[4px] border border-ink/20 bg-white p-6 transition-colors duration-200 hover:border-copper/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper";
            const body = (
              <>
                <Calculator className="mt-0.5 size-5 shrink-0 text-copper" aria-hidden />
                <div>
                  <h3 className="font-serif text-xl text-ink">{item.title}</h3>
                  {!item.href ? (
                    <p className="mt-2 text-sm text-ink/45">Yakında</p>
                  ) : (
                    <p className="mt-2 text-sm text-ink/55">Hesaplama aracına git</p>
                  )}
                </div>
              </>
            );
            return (
              <FadeIn key={item.title} delay={i * 0.05}>
                {item.href ? (
                  <Link href={item.href} className={className}>
                    {body}
                  </Link>
                ) : (
                  <div className={className}>{body}</div>
                )}
              </FadeIn>
            );
          })}
        </div>
        <FadeIn>
          <div className="mt-10 border-t border-ink/10 pt-8">
            <Link
              href={tools.allHref}
              className="inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-copper"
            >
              {tools.allLabel}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
