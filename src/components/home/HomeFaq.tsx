"use client";

import { homeContent } from "@/data/home";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/home/FadeIn";
import { SectionHeading } from "@/components/home/SectionHeading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function HomeFaq() {
  const { faq } = homeContent;

  return (
    <section className="bg-cream">
      <Container className="py-20 sm:py-24">
        <FadeIn>
          <SectionHeading eyebrow={faq.eyebrow} title={faq.title} />
        </FadeIn>
        <FadeIn delay={0.06}>
          <Accordion type="single" collapsible className="mt-12 border-t border-ink/20">
            {faq.items.map((item) => (
              <AccordionItem key={item.q} value={item.q} className="border-ink/20">
                <AccordionTrigger className="py-5 text-left font-serif text-lg text-ink hover:no-underline hover:text-copper">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-[15px] leading-7 text-ink/70">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeIn>
      </Container>
    </section>
  );
}
