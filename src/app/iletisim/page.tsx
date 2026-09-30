import type { Metadata } from "next";
import { BreadcrumbBlock } from "@/components/breadcrumb";
import { BreadcrumbListSchema } from "@/components/schemas/BreadcrumbListSchema";
import { ContactForm } from "@/components/contact-form";
import { siteConfig } from "@/lib/site";

const title = "İletişim | İşçinin Hakları";
const description =
  "Düzeltme, öneri veya sitemizle ilgili bir notunuz varsa yazabilirsiniz. Mesajlar editör ekibine düşer.";
const url = `${siteConfig.url.replace(/\/$/, "")}/iletisim`;
const baseUrl = siteConfig.url.replace(/\/$/, "");

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: url },
  openGraph: {
    title,
    description,
    url,
    type: "website",
    locale: "tr_TR",
  },
};

export default function ContactPage() {
  return (
    <div className="space-y-6 px-4 pt-4 pb-10 sm:px-6 sm:pt-6 lg:px-8 lg:pt-10">
      <BreadcrumbListSchema
        items={[
          { name: "Anasayfa", url: `${baseUrl}/` },
          { name: "İletişim", url },
        ]}
      />
      <BreadcrumbBlock
        items={[
          { label: "Anasayfa", href: "/" },
          { label: "İletişim" },
        ]}
      />

      <div className="min-w-0 max-w-[70ch] space-y-6">
        <div className="space-y-3">
          <h1 className="sr-only">İletişim</h1>
          <p className="text-[14px] leading-7 text-black">
            Düzeltme, öneri veya sitemizle ilgili bir notunuz varsa yazabilirsiniz. Mesajlar editör
            ekibine düşer.
          </p>
          <p className="text-[14px] leading-7 text-black">
            E-posta:{" "}
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="underline decoration-primary underline-offset-2"
            >
              {siteConfig.contactEmail}
            </a>
          </p>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
