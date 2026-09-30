import type { ReactNode } from "react";
import { BreadcrumbBlock } from "@/components/breadcrumb";
import { BreadcrumbListSchema } from "@/components/schemas/BreadcrumbListSchema";
import { WebApplicationSchema } from "@/components/schemas/WebApplicationSchema";
import { RelatedCalculators } from "@/components/calculators/calc-ui";
import { CALCULATOR_PATHS, DISCLAIMER } from "@/lib/calculators/config";
import { siteConfig } from "@/lib/site";
import { toolsHub } from "@/lib/silos";

export function CalculatorPageLayout({
  title,
  description,
  path,
  current,
  intro,
  children,
  howTo,
}: {
  title: string;
  description: string;
  path: string;
  current: keyof typeof CALCULATOR_PATHS;
  intro: string;
  children: ReactNode;
  howTo: ReactNode;
}) {
  const origin = siteConfig.url.replace(/\/$/, "");
  const url = `${origin}${path}`;
  const hubUrl = `${origin}${toolsHub.path}`;

  return (
    <div className="space-y-10 pb-10">
      <WebApplicationSchema name={title} url={url} description={description} />
      <BreadcrumbListSchema
        items={[
          { name: "Anasayfa", url: siteConfig.url },
          { name: toolsHub.eyebrow, url: hubUrl },
          { name: title, url },
        ]}
      />
      <BreadcrumbBlock
        items={[
          { label: "Anasayfa", href: "/" },
          { label: toolsHub.eyebrow, href: toolsHub.path },
          { label: title },
        ]}
      />
      <header className="max-w-2xl space-y-4">
        <h1 className="font-serif text-3xl leading-tight text-ink sm:text-4xl">{title}</h1>
        <p className="text-[15px] leading-7 text-ink">{intro}</p>
      </header>
      {children}
      <section className="max-w-2xl space-y-4">{howTo}</section>
      <RelatedCalculators current={current} />
      <p className="max-w-2xl text-[13px] leading-6 text-ink/80">{DISCLAIMER}</p>
    </div>
  );
}
