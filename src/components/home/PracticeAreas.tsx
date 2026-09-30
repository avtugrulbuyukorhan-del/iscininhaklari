"use client";

import Link from "next/link";
import {
  Bell,
  CalendarDays,
  Clock,
  ShieldAlert,
  Undo2,
  Wallet,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { homeContent, type WorkerRightIconName } from "@/data/home";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/home/FadeIn";
import { SectionHeading } from "@/components/home/SectionHeading";

const ICONS: Record<WorkerRightIconName, LucideIcon> = {
  Wallet,
  Bell,
  Clock,
  Undo2,
  ShieldAlert,
  CalendarDays,
};

export function PracticeAreas() {
  const { workerRights } = homeContent;

  return (
    <section id={workerRights.id} className="scroll-mt-24 bg-white">
      <Container className="py-20 sm:py-24">
        <FadeIn>
          <SectionHeading
            eyebrow={workerRights.eyebrow}
            title={workerRights.title}
            intro={workerRights.intro}
          />
        </FadeIn>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workerRights.items.map((item, i) => {
            const Icon = ICONS[item.icon];
            return (
              <FadeIn key={item.slug} delay={i * 0.05}>
                <Link
                  href={item.href}
                  className="group flex h-full flex-col rounded-[4px] border border-ink/20 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-copper/40 hover:shadow-[0_16px_40px_rgba(18,24,38,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper"
                >
                  <Icon className="size-5 text-copper" aria-hidden />
                  <h3 className="mt-5 font-serif text-xl text-ink">{item.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-ink/65">{item.description}</p>
                  <span className="mt-5 inline-flex items-center gap-1 text-[13px] font-medium text-ink">
                    İncele
                    <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
