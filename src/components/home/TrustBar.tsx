"use client";

import Link from "next/link";
import { Bell, Calculator, FileText, Timer, type LucideIcon } from "lucide-react";
import { homeContent, type QuickAccessIconName } from "@/data/home";
import { Container } from "@/components/layout/Container";

const ICONS: Record<QuickAccessIconName, LucideIcon> = {
  Calculator,
  Bell,
  FileText,
  Timer,
};

export function TrustBar() {
  return (
    <section className="bg-cream">
      <Container className="py-10 sm:py-12">
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {homeContent.quickAccess.map((item) => {
            const Icon = ICONS[item.icon];
            const className =
              "flex h-full flex-col rounded-[4px] border border-ink/20 bg-white px-5 py-6 transition-colors duration-200 hover:border-copper/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper";
            const body = (
              <>
                <Icon className="size-5 text-copper" aria-hidden />
                <h3 className="mt-4 font-serif text-lg text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink/60">{item.text}</p>
              </>
            );
            return (
              <li key={item.title}>
                {item.href ? (
                  <Link href={item.href} className={className}>
                    {body}
                  </Link>
                ) : (
                  <div className={className}>{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
