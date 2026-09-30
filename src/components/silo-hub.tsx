import Link from "next/link";
import { ArrowRight, Calculator, FileText, type LucideIcon } from "lucide-react";
import { BreadcrumbBlock } from "@/components/breadcrumb";
import { BreadcrumbListSchema } from "@/components/schemas/BreadcrumbListSchema";
import { siteConfig } from "@/lib/site";
import type { SiloItem } from "@/lib/silos";

const ICONS = {
  calculator: Calculator,
  petition: FileText,
} as const;

export function SiloHub({
  eyebrow,
  title,
  intro,
  path,
  items,
  icon,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  path: string;
  items: readonly SiloItem[];
  icon: keyof typeof ICONS;
}) {
  const Icon: LucideIcon = ICONS[icon];
  const url = `${siteConfig.url}${path}`;

  return (
    <div className="pb-6">
      <BreadcrumbListSchema
        items={[
          { name: "Anasayfa", url: siteConfig.url },
          { name: eyebrow, url },
        ]}
      />
      <BreadcrumbBlock items={[{ label: "Anasayfa", href: "/" }, { label: eyebrow }]} />
      <header className="max-w-2xl space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-copper">{eyebrow}</p>
        <h1 className="font-serif text-3xl leading-tight text-ink sm:text-4xl">{title}</h1>
        <p className="text-[15px] leading-7 text-ink/70">{intro}</p>
      </header>
      <ul className="mt-12 grid gap-4 sm:grid-cols-2">
        {items.map((item) => {
          const className =
            "group flex h-full flex-col rounded-[4px] border border-ink/20 bg-white p-6 transition-colors duration-200 hover:border-copper/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper";
          const body = (
            <>
              <Icon className="size-5 text-copper" aria-hidden />
              <h2 className="mt-5 font-serif text-xl text-ink">{item.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-6 text-ink/65">{item.text}</p>
              {item.available ? (
                <span className="mt-5 inline-flex items-center gap-1 text-[13px] font-medium text-ink">
                  Başla
                  <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
              ) : (
                <span className="mt-5 text-[13px] text-ink/45">Yakında</span>
              )}
            </>
          );
          return (
            <li key={item.slug}>
              {item.available && item.href ? (
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
    </div>
  );
}
