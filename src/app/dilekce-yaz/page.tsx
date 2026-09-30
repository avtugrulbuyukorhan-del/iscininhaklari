import type { Metadata } from "next";
import { SiloHub } from "@/components/silo-hub";
import { petitionsHub } from "@/lib/silos";
import { siteConfig } from "@/lib/site";

const title = "Dilekçe Yaz";
const description = petitionsHub.intro;
const url = `${siteConfig.url}${petitionsHub.path}`;

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title: `${siteConfig.name} | ${title}`, description, url },
  twitter: { card: "summary_large_image", title, description },
  alternates: { canonical: url },
};

export default function DilekceYazPage() {
  return (
    <SiloHub
      eyebrow={petitionsHub.eyebrow}
      title={petitionsHub.title}
      intro={petitionsHub.intro}
      path={petitionsHub.path}
      items={petitionsHub.items}
      icon="petition"
    />
  );
}
