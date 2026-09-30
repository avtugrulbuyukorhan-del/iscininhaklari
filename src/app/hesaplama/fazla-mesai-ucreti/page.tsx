import type { Metadata } from "next";
import { FazlaMesaiCalculator } from "@/components/calculators/FazlaMesaiCalculator";
import { CalculatorPageLayout } from "@/components/calculators/CalculatorPageLayout";
import { CALCULATOR_PATHS } from "@/lib/calculators/config";
import { siteConfig } from "@/lib/site";

const title = "Fazla Mesai Ücreti Hesaplama 2026";
const description =
  "Haftalık çalışma saatlerinize göre fazla mesai süresini ve %50 zamlı ücretini hesaplayın.";
const path = CALCULATOR_PATHS.fazlaMesai;
const url = `${siteConfig.url.replace(/\/$/, "")}${path}`;

export const metadata: Metadata = {
  title: { absolute: `${title} | ${siteConfig.name}` },
  description,
  openGraph: { title, description, url, type: "website", locale: "tr_TR" },
  twitter: { card: "summary_large_image", title, description },
  alternates: { canonical: url },
};

export default function FazlaMesaiUcretiPage() {
  return (
    <CalculatorPageLayout
      title={title}
      description={description}
      path={path}
      current="fazlaMesai"
      intro="İş Kanunu m.41, m.63 ve m.68 çerçevesinde günlük net süre, haftalık 45 saati aşan kısım ve saatlik brüt üzerinden fazla mesai ücreti hesaplanır."
      howTo={
        <>
          <h2 className="font-serif text-2xl leading-tight text-ink">Nasıl hesaplanır?</h2>
          <p className="text-[15px] leading-7 text-ink">
            Her gün için bitiş ile başlangıç arasındaki brüt süreden ara dinlenme düşülür. Haftalık net
            toplam 45 saati aşıyorsa fark fazla mesai sayılır.
          </p>
          <p className="text-[15px] leading-7 text-ink">
            Saatlik brüt, aylık brütün 225’e bölünmesidir. Fazla mesai ücreti bu tutarın 1,5 katıdır.
            İsteğe bağlı hakkaniyet indirimi brüt üzerinden uygulanır. SGK, gelir vergisi ve damga kesilir.
          </p>
          <table className="w-full border-t border-ink/20 text-[14px] text-ink">
            <caption className="sr-only">Ara dinlenme süreleri</caption>
            <thead>
              <tr className="border-b border-ink/20 text-left">
                <th className="py-3 pr-3 font-semibold">Günlük brüt süre</th>
                <th className="py-3 text-right font-semibold">Ara dinlenme</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-ink/15">
                <td className="py-3 pr-3">4 saat ve daha az</td>
                <td className="py-3 text-right">15 dakika</td>
              </tr>
              <tr className="border-b border-ink/15">
                <td className="py-3 pr-3">4 saatten çok, 7,5 saate kadar</td>
                <td className="py-3 text-right">30 dakika</td>
              </tr>
              <tr className="border-b border-ink/15">
                <td className="py-3 pr-3">7,5 saatten çok</td>
                <td className="py-3 text-right">1 saat</td>
              </tr>
            </tbody>
          </table>
        </>
      }
    >
      <FazlaMesaiCalculator />
    </CalculatorPageLayout>
  );
}
