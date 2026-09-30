"use client";

import { homeContent } from "@/data/home";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/home/FadeIn";
import { SectionHeading } from "@/components/home/SectionHeading";

export function Process() {
  const { dismissal } = homeContent;

  return (
    <section id={dismissal.id} className="scroll-mt-24 bg-cream">
      <Container className="py-20 sm:py-24">
        <FadeIn>
          <SectionHeading eyebrow={dismissal.eyebrow} title={dismissal.title} />
        </FadeIn>
        <FadeIn delay={0.06}>
          <ol className="mt-12 overflow-hidden rounded-[4px] border border-ink/20 bg-white">
            {dismissal.steps.map((step) => (
              <li
                key={step.n}
                className="grid items-start gap-3 border-b border-ink/15 px-5 py-6 last:border-b-0 sm:grid-cols-[5.5rem_minmax(0,1fr)] sm:gap-8 sm:px-8 sm:py-8"
              >
                <span className="font-serif text-[28px] leading-none text-copper tabular-nums">{step.n}</span>
                <div>
                  <h3 className="font-serif text-xl text-ink sm:text-[22px]">{step.title}</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/65">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </FadeIn>
      </Container>
    </section>
  );
}
