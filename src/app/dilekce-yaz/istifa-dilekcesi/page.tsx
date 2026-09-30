import type { Metadata } from "next";
import { IstifaDilekcesiGenerator } from "@/components/istifa-dilekcesi/IstifaDilekcesiGenerator";
import { BreadcrumbBlock } from "@/components/breadcrumb";
import { BreadcrumbListSchema } from "@/components/schemas/BreadcrumbListSchema";
import { siteConfig } from "@/lib/site";
import { petitionsHub } from "@/lib/silos";

const title = "İstifa Dilekçesi Oluşturucu";
const description =
  "Şirket, görev ve ayrılış bilgilerinizi girerek istifa dilekçesi oluşturun. Canlı önizleme ve PDF indirme.";
const path = `${petitionsHub.path}/istifa-dilekcesi`;
const url = `${siteConfig.url}${path}`;

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title: `${siteConfig.name} | ${title}`, description, url },
  twitter: { card: "summary_large_image", title, description },
  alternates: { canonical: url },
};

export default function IstifaDilekcesiPage() {
  return (
    <div className="space-y-10 pb-10">
      <BreadcrumbListSchema
        items={[
          { name: "Anasayfa", url: siteConfig.url },
          { name: petitionsHub.eyebrow, url: `${siteConfig.url}${petitionsHub.path}` },
          { name: title, url },
        ]}
      />
      <BreadcrumbBlock
        items={[
          { label: "Anasayfa", href: "/" },
          { label: petitionsHub.eyebrow, href: petitionsHub.path },
          { label: title },
        ]}
      />
      <header className="max-w-2xl space-y-4">
        <h1 className="font-serif text-3xl leading-tight text-ink sm:text-4xl">{title}</h1>
        <p className="text-[15px] leading-7 text-ink/70">
          Bilgilerinizi doldurun, dilekçeyi anlık görün ve PDF olarak indirin. Oluşturulan metin genel
          bilgilendirme amaçlıdır; kendi durumunuza göre kontrol etmeniz gerekir.
        </p>
      </header>
      <IstifaDilekcesiGenerator />
      <section className="max-w-2xl space-y-4">
        <h2 className="font-serif text-2xl leading-tight text-ink">İstifa dilekçesi nasıl yazılır?</h2>
        <p className="text-[15px] leading-7 text-ink/70">
          Bu metin alanı geçicidir; dilekçe notları ve açıklamalar burada yer alacak.
        </p>
      </section>
    </div>
  );
}
