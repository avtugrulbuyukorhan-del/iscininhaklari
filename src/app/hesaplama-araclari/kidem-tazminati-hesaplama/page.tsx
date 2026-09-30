import type { Metadata } from "next";
import { KidemCalculator } from "@/components/kidem-tazminati/KidemCalculator";
import { BreadcrumbBlock } from "@/components/breadcrumb";
import { BreadcrumbListSchema } from "@/components/schemas/BreadcrumbListSchema";
import { siteConfig } from "@/lib/site";
import { toolsHub } from "@/lib/silos";

const title = "Kıdem Tazminatı Hesaplama";
const description =
  "İşe giriş, ayrılış ve giydirilmiş brüt ücretinizle kıdem tazminatını hesaplayın. 2026 tavanı ve damga vergisi dahildir.";
const path = `${toolsHub.path}/kidem-tazminati-hesaplama`;
const url = `${siteConfig.url}${path}`;

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title: `${siteConfig.name} | ${title}`, description, url },
  twitter: { card: "summary_large_image", title, description },
  alternates: { canonical: url },
};

export default function KidemTazminatiHesaplamaPage() {
  return (
    <div className="space-y-10 pb-10">
      <BreadcrumbListSchema
        items={[
          { name: "Anasayfa", url: siteConfig.url },
          { name: toolsHub.eyebrow, url: `${siteConfig.url}${toolsHub.path}` },
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
        <p className="text-[15px] leading-7 text-ink">
          Her tam hizmet yılı için bir aylık giydirilmiş brüt ücret, yıl kesri gün/365 üzerinden
          eklenir. Ücret yasal tavanı aşarsa tavan esas alınır; net tutardan yalnızca damga vergisi
          düşülür.
        </p>
      </header>
      <KidemCalculator />
      <section className="max-w-2xl space-y-4">
        <h2 className="font-serif text-2xl leading-tight text-ink">Kıdem tazminatı nasıl hesaplanır?</h2>
        <p className="text-[15px] leading-7 text-ink">
          Bu metin alanı geçicidir; hesaplama notları ve açıklamalar burada yer alacak.
        </p>
      </section>
    </div>
  );
}
