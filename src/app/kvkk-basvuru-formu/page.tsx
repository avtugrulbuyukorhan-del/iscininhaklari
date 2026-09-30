import type { Metadata } from "next";
import Link from "next/link";
import { Download, Mail } from "lucide-react";
import { LegalLayout } from "@/components/legal-layout";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

const path = "/kvkk-basvuru-formu";
const formHref = "/docs/kvkk-basvuru-formu.pdf";
const kvkkEmail = siteConfig.contactEmail;
const title = `KVKK Başvuru Formu | ${siteConfig.name}`;
const description =
  "6698 sayılı KVKK kapsamında veri sorumlusuna başvuru formunu indirin ve doldurduğunuz formu e-posta ile iletin.";
const url = `${siteConfig.url.replace(/\/$/, "")}${path}`;
const mailto = `mailto:${kvkkEmail}?subject=${encodeURIComponent("KVKK Başvuru Formu")}`;

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  openGraph: { title, description, url },
  twitter: { card: "summary_large_image", title, description },
  alternates: { canonical: url },
};

export default function KvkkBasvuruFormuPage() {
  return (
    <LegalLayout title="KVKK Başvuru Formu" lastUpdated="28 Eylül 2026">
      <p>
        6698 sayılı Kişisel Verilerin Korunması Kanunu’nun 11. maddesi uyarınca veri sorumlusuna
        yapacağınız başvurular için aşağıdaki formu kullanabilirsiniz.
      </p>
      <p>
        Formu indirip doldurduktan sonra imzalayarak{" "}
        <a href={mailto}>{kvkkEmail}</a> adresine gönderiniz.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="copper" size="lg" className="h-11 px-5">
          <a href={formHref} download="kvkk-basvuru-formu.pdf">
            <Download className="size-4" aria-hidden />
            Formu indir
          </a>
        </Button>
        <Button asChild variant="outline" size="lg" className="h-11 border-ink/25 px-5 text-ink">
          <a href={mailto}>
            <Mail className="size-4" aria-hidden />
            E-posta ile gönder
          </a>
        </Button>
      </div>

      <h2>Başvuru nasıl yapılır?</h2>
      <p>1. Formu PDF olarak indirin.</p>
      <p>2. Formdaki alanları eksiksiz doldurun ve imzalayın.</p>
      <p>
        3. Doldurduğunuz formu <a href={mailto}>{kvkkEmail}</a> adresine e-posta eki olarak
        iletin. Talebiniz, iletilmesinden itibaren en geç 30 gün içinde sonuçlandırılır.
      </p>
      <p>
        Aydınlatma metni için{" "}
        <Link href="/aydinlatma-beyani-ve-acik-riza-onayi">
          Aydınlatma Beyanı ve Açık Rıza Onayı
        </Link>{" "}
        sayfasına bakabilirsiniz.
      </p>
    </LegalLayout>
  );
}
