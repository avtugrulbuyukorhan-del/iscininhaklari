"use client";

import Link from "next/link";
import { homeContent } from "@/data/home";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/home/FadeIn";
import { Button } from "@/components/ui/button";

export function CtaBand() {
  const { ctaBand } = homeContent;

  return (
    <section className="bg-white py-16 sm:py-20">
      <Container>
        <FadeIn className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-xl">
            <h2 className="font-serif text-3xl leading-tight text-ink sm:text-4xl">{ctaBand.title}</h2>
            <p className="mt-4 text-[15px] leading-7 text-ink/70">{ctaBand.text}</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Button asChild variant="copper" size="lg" className="h-12 px-6 font-semibold">
              <Link href={ctaBand.primary.href}>{ctaBand.primary.label}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 border-ink/25 px-6 font-medium text-ink hover:border-ink/50">
              <Link href={ctaBand.secondary.href}>{ctaBand.secondary.label}</Link>
            </Button>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
