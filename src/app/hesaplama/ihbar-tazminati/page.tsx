import type { Metadata } from "next";
import { IhbarCalculator } from "@/components/calculators/IhbarCalculator";
import { CalculatorPageLayout } from "@/components/calculators/CalculatorPageLayout";
import { CALCULATOR_PATHS } from "@/lib/calculators/config";
import { siteConfig } from "@/lib/site";

const title = "İhbar Tazminatı Hesaplama 2026";
const description =
  "Hizmet sürenize göre ihbar süresini ve giydirilmiş brüt ücret üzerinden ihbar tazminatını hesaplayın.";
const path = CALCULATOR_PATHS.ihbar;
const url = `${siteConfig.url.replace(/\/$/, "")}${path}`;

export const metadata: Metadata = {
  title: { absolute: `${title} | ${siteConfig.name}` },
  description,
  openGraph: { title, description, url, type: "website", locale: "tr_TR" },
  twitter: { card: "summary_large_image", title, description },
  alternates: { canonical: url },
};

export default function IhbarTazminatiPage() {
  return (
    <CalculatorPageLayout
      title={title}
      description={description}
      path={path}
      current="ihbar"
      intro="İş sözleşmesinin bildirimli feshinde 4857 sayılı İş Kanunu m.17’deki ihbar süreleri esas alınır. Tavan uygulanmaz; SGK kesilmez."
      howTo={
        <>
          <h2 className="font-serif text-2xl leading-tight text-ink">Nasıl hesaplanır?</h2>
          <p className="text-[15px] leading-7 text-ink">
            Hizmet süresi işe giriş ile çıkış arasındaki zamandır. Bu süreye göre ihbar günü belirlenir.
            Giydirilmiş aylık brüt, çıplak ücret ile düzenli yan ödemelerin toplamıdır.
          </p>
          <p className="text-[15px] leading-7 text-ink">
            Günlük giydirilmiş brüt, aylık tutarın 30’a bölünmesiyle bulunur. Brüt ihbar tazminatı günlük
            tutar ile ihbar gününün çarpımıdır. Kesintide yalnızca gelir vergisi ve damga vergisi yer alır.
          </p>
          <table className="w-full border-t border-ink/20 text-[14px] text-ink">
            <caption className="sr-only">İhbar süreleri</caption>
            <thead>
              <tr className="border-b border-ink/20 text-left">
                <th className="py-3 pr-3 font-semibold">Hizmet süresi</th>
                <th className="py-3 text-right font-semibold">İhbar süresi</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-ink/15">
                <td className="py-3 pr-3">6 aydan az</td>
                <td className="py-3 text-right">2 hafta (14 gün)</td>
              </tr>
              <tr className="border-b border-ink/15">
                <td className="py-3 pr-3">6 ay – 1,5 yıldan az</td>
                <td className="py-3 text-right">4 hafta (28 gün)</td>
              </tr>
              <tr className="border-b border-ink/15">
                <td className="py-3 pr-3">1,5 yıl – 3 yıldan az</td>
                <td className="py-3 text-right">6 hafta (42 gün)</td>
              </tr>
              <tr className="border-b border-ink/15">
                <td className="py-3 pr-3">3 yıl ve üzeri</td>
                <td className="py-3 text-right">8 hafta (56 gün)</td>
              </tr>
            </tbody>
          </table>
        </>
      }
    >
      <IhbarCalculator />
    </CalculatorPageLayout>
  );
}
