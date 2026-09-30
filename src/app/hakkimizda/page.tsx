import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Scale, Users } from "lucide-react";
import { BreadcrumbBlock } from "@/components/breadcrumb";
import { BreadcrumbListSchema } from "@/components/schemas/BreadcrumbListSchema";
import { CtaBand } from "@/components/home/CtaBand";
import { SectionHeading } from "@/components/home/SectionHeading";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { homeLinks } from "@/data/home";
import { escapeJsonLd } from "@/lib/jsonLd";
import { siteConfig } from "@/lib/site";

const title = "Hakkımızda | İşçinin Hakları";
const description =
  "iscininhaklari.com, işçi ile işveren arasındaki uyuşmazlıklara yönelik Avukat Tuğrul Büyükorhan tarafından kurulan hukuki bilgi paylaşım platformudur.";
const url = `${siteConfig.url.replace(/\/$/, "")}/hakkimizda`;
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

const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  url,
  name: "Hakkımızda",
  inLanguage: "tr-TR",
  about: {
    "@type": "Organization",
    name: "İşçinin Hakları",
    url: baseUrl,
    founder: {
      "@type": "Person",
      name: "Tuğrul Büyükorhan",
      jobTitle: "Avukat",
    },
  },
  publisher: {
    "@type": "Organization",
    name: "İşçinin Hakları",
    url: baseUrl,
  },
};

const principles = [
  {
    n: "01",
    title: "İşçi ve işveren için",
    text: "Hem çalışan hem işveren açısından iş hukuku bağlamında sade ve kullanılabilir bilgi sunuyoruz.",
  },
  {
    n: "02",
    title: "Güncel çerçeve",
    text: "İş Kanunu, basın iş kanunu ve deniz iş kanununa ilişkin açıklamaları güncel bilgi ve makalelerle derliyoruz.",
  },
  {
    n: "03",
    title: "Pratik çözüm odaklı",
    text: "Günlük çalışma hayatında karşılaşılan sorunlara anlaşılır yanıtlar vermeyi hedefliyoruz.",
  },
];

const topics = [
  { label: "İşe iade", href: "/ise-iade-ve-is-guvencesi" },
  { label: "İş kazası", href: "/is-kazasi-ve-meslek-hastaligi" },
  { label: "Kıdem tazminatı", href: "/kidem-tazminati" },
  { label: "İhbar tazminatı", href: "/ihbar-tazminati" },
  { label: "Fazla mesai ve ücret alacağı", href: "/ucret-ve-iscilik-alacaklari" },
  { label: "Yıllık izin", href: "/calisma-sureleri-ve-izinler" },
  { label: "Hizmet tespit", href: "/sgk-ve-sigortalilik" },
  { label: "Haklı sebeple fesih", href: "/isten-cikarilma-ve-fesih" },
];

export default function AboutPage() {
  return (
    <div className="bg-white text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeJsonLd(aboutPageSchema) }}
      />
      <BreadcrumbListSchema
        items={[
          { name: "Anasayfa", url: `${baseUrl}/` },
          { name: "Hakkımızda", url },
        ]}
      />

      <section className="bg-cream">
        <Container className="pt-24 sm:pt-28">
          <BreadcrumbBlock
            items={[
              { label: "Anasayfa", href: "/" },
              { label: "Hakkımızda" },
            ]}
          />
        </Container>
        <Container className="pb-16 lg:pb-24">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-copper">
            Hukuki bilgi platformu
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-[2.05rem] leading-[1.15] tracking-tight sm:text-5xl lg:max-w-4xl lg:text-[52px]">
            İş hukukunu herkesin anlayabileceği dilde anlatıyoruz.
          </h1>
          <p className="mt-6 max-w-2xl text-[15px] leading-7 text-ink/70 sm:text-base lg:max-w-3xl">
            iscininhaklari.com, işçi ile işveren arasındaki uyuşmazlıklara yönelik Avukat Tuğrul
            Büyükorhan tarafından kurulan hukuki bilgi paylaşım platformudur.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Button asChild variant="copper" size="lg" className="h-12 px-6 font-semibold">
              <Link href={homeLinks.articles}>Makaleleri İncele</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 border-ink/25 px-6 font-medium text-ink hover:border-ink/50"
            >
              <Link href={homeLinks.contact}>İletişime Geç</Link>
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Platform"
            title="Neden bu site var?"
          />
          <div className="mt-8 max-w-3xl space-y-5 text-[15px] leading-7 text-ink/70">
            <p>
              <Link
                href="/"
                className="font-medium text-ink underline underline-offset-2 hover:no-underline"
              >
                iscininhaklari.com
              </Link>
              {", işçi ile işveren arasında oluşan uyuşmazlıklara yönelik olarak "}
              <strong className="font-semibold text-ink">Avukat Tuğrul Büyükorhan</strong> tarafından
              kurulan hukuki bilgi paylaşım platformudur. Bu platformda hem işçi (çalışan) hem de
              işveren açısından iş hukuku bağlamında önemli bilgiler mevcuttur. Güncel bilgi ve
              makaleler ile iş kanunu, basın iş kanunu ve deniz iş kanununa yönelik detaylı bilgiler
              içermektedir.
            </p>
            <p>
              Çalışma hayatı çerçevesinde işçilerin günlük yaşantılarında ya da iş hayatlarında
              karşılaştıkları problemlere güncel çözümler bulma hedefiyle hareket etmektedir.
              Yalnızca çalışan ya da işçi yönünden değil aynı zamanda işveren yönünden de faydalı
              bilgiler içermektedir.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-cream py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Kimler için"
            title="Çalışan ve işveren aynı çerçevede."
            intro="İçerikler tek taraflı bir savunma metni değil; iş ilişkisinin her iki tarafının da ihtiyaç duyduğu hukuki bilgiyi anlaşılır kılmayı amaçlar."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <article className="h-full rounded-[4px] border border-ink/15 bg-white px-6 py-7">
              <Users className="size-5 text-copper" aria-hidden />
              <h3 className="mt-5 font-serif text-xl text-ink">Çalışanlar</h3>
              <p className="mt-2 text-sm leading-6 text-ink/65">
                Günlük çalışma hayatında ya da işten ayrılma, ücret, izin ve fesih gibi başlıklarda
                karşılaşılan sorulara güncel ve anlaşılır yanıtlar.
              </p>
            </article>
            <article className="h-full rounded-[4px] border border-ink/15 bg-white px-6 py-7">
              <Scale className="size-5 text-copper" aria-hidden />
              <h3 className="mt-5 font-serif text-xl text-ink">İşverenler</h3>
              <p className="mt-2 text-sm leading-6 text-ink/65">
                İş hukuku yükümlülüklerini ve uyuşmazlık başlıklarını sade bir dille takip etmek
                isteyen işverenler için de faydalı bilgiler.
              </p>
            </article>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Yaklaşımımız"
            title="Bilgiyi sade, güncel ve kullanılabilir kılmak."
          />
          <ol className="mt-12 overflow-hidden rounded-[4px] border border-ink/20 bg-white">
            {principles.map((item) => (
              <li
                key={item.n}
                className="grid items-start gap-3 border-b border-ink/15 px-5 py-6 last:border-b-0 sm:grid-cols-[5.5rem_minmax(0,1fr)] sm:gap-8 sm:px-8 sm:py-8"
              >
                <span className="font-serif text-[28px] leading-none text-copper tabular-nums">
                  {item.n}
                </span>
                <div>
                  <h3 className="font-serif text-xl text-ink sm:text-[22px]">{item.title}</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/65">{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-cream py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Odak konular"
            title="Çalışma hayatında en sık karşılaşılan başlıklar"
            intro="Platformdaki içerikler işe iade, iş kazası, kıdem ve ihbar tazminatı, fazla mesai, yıllık izin, hizmet tespit, haklı fesih ve ücret alacağı gibi uyuşmazlıkları kapsar."
          />
          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {topics.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex items-center justify-between gap-4 rounded-[4px] border border-ink/15 bg-white px-5 py-4 transition-colors duration-200 hover:border-copper/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper"
                >
                  <span className="text-[15px] leading-6 text-ink">{item.label}</span>
                  <ArrowUpRight
                    className="size-4 shrink-0 text-ink/35 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-copper"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand />
    </div>
  );
}
