import type { Metadata } from "next";
import { SiloHub } from "@/components/silo-hub";
import { toolsHub } from "@/lib/silos";
import { siteConfig } from "@/lib/site";

const title = "Hesaplama Araçları";
const description = toolsHub.intro;
const url = `${siteConfig.url}${toolsHub.path}`;

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title: `${siteConfig.name} | ${title}`, description, url },
  twitter: { card: "summary_large_image", title, description },
  alternates: { canonical: url },
};

export default function HesaplamaAraclariPage() {
  return (
    <SiloHub
      eyebrow={toolsHub.eyebrow}
      title={toolsHub.title}
      intro={toolsHub.intro}
      path={toolsHub.path}
      items={toolsHub.items}
      icon="calculator"
    />
  );
}
