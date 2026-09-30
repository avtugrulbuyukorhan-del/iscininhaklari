"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { homeContent } from "@/data/home";
import { Container } from "@/components/layout/Container";

export function AboutPreview() {
  const { about } = homeContent;
  const slides = about.slides;
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80px", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.min(slides.length - 1, Math.floor(value * slides.length + 0.001));
    setActive((current) => (current === next ? current : next));
  });

  const slide = slides[active];

  if (reduceMotion) {
    return (
      <section className="bg-cream text-ink">
        <Container className="grid items-center gap-10 py-20 sm:py-24 lg:grid-cols-2 lg:gap-16">
          <Image
            src={slides[0].image.src}
            alt={slides[0].image.alt}
            width={slides[0].image.width}
            height={slides[0].image.height}
            className="mx-auto h-auto w-full max-w-md"
            sizes="(min-width: 1024px) 420px, 90vw"
          />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-copper">{about.eyebrow}</p>
            <h2 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl">{slides[0].title}</h2>
            <p className="mt-6 text-[15px] leading-7 text-ink/70">{slides[0].body}</p>
            <Link
              href={about.cta.href}
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-copper transition-colors hover:text-ink"
            >
              {about.cta.label}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-cream text-ink">
      <div
        ref={ref}
        className="relative"
        style={{ height: `${100 + (slides.length - 1) * 70}vh` }}
      >
        <div className="sticky top-[72px] flex h-[calc(100svh-72px)] items-center overflow-hidden sm:top-20 sm:h-[calc(100svh-5rem)]">
          <Container className="grid w-full items-center gap-6 py-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 lg:py-0">
            <div className="relative mx-auto h-[32vh] w-full max-w-sm lg:h-[min(72vh,640px)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.image.src + String(active)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Image
                    src={slide.image.src}
                    alt={slide.image.alt}
                    width={slide.image.width}
                    height={slide.image.height}
                    className="max-h-full w-auto object-contain"
                    sizes="(min-width: 1024px) 420px, 90vw"
                    priority={active === 0}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-copper">{about.eyebrow}</p>
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h2 className="mt-4 font-serif text-2xl leading-tight sm:text-4xl">{slide.title}</h2>
                  <p className="mt-5 text-[15px] leading-7 text-ink/70">{slide.body}</p>
                </motion.div>
              </AnimatePresence>
              <div className="mt-7 flex items-center gap-6">
                <Link
                  href={about.cta.href}
                  className="inline-flex items-center gap-2 text-sm font-medium text-copper transition-colors hover:text-ink"
                >
                  {about.cta.label}
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
                <div className="flex gap-2" aria-hidden>
                  {slides.map((_, index) => (
                    <span
                      key={index}
                      className={
                        index === active
                          ? "h-1.5 w-6 rounded-full bg-copper"
                          : "h-1.5 w-1.5 rounded-full bg-ink/20"
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}
