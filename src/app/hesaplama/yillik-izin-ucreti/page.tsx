import type { Metadata } from "next";
import { YillikIzinCalculator } from "@/components/calculators/YillikIzinCalculator";
import { CalculatorPageLayout } from "@/components/calculators/CalculatorPageLayout";
import { CALCULATOR_PATHS } from "@/lib/calculators/config";
import { siteConfig } from "@/lib/site";

const title = "Yıllık İzin Ücreti Hesaplama 2026";
const description =
  "Tamamlanan hizmet yıllarına göre yıllık izin hakkını ve kullanılmayan günlerin ücretini hesaplayın.";
const path = CALCULATOR_PATHS.yillikIzin;
const url = `${siteConfig.url.replace(/\/$/, "")}${path}`;

export const metadata: Metadata = {
  title: { absolute: `${title} | ${siteConfig.name}` },
  description,
  openGraph: { title, description, url, type: "website", locale: "tr_TR" },
  twitter: { card: "summary_large_image", title, description },
  alternates: { canonical: url },
};

export default function YillikIzinUcretiPage() {
  return (
    <CalculatorPageLayout
      title={title}
      description={description}
      path={path}
      current="yillikIzin"
      intro="İş Kanunu m.53 ve m.59’a göre izin hakkı yalnızca tamamlanan her hizmet yılı için doğar. Fesihte çıplak son brüt ücret esas alınır."
      howTo={
        <>
          <h2 className="font-serif text-2xl leading-tight text-ink">Nasıl hesaplanır?</h2>
          <p className="text-[15px] leading-7 text-ink">
            Her dolan hizmet yılı için o yıldaki yaşa bakılarak izin günü belirlenir. On sekiz yaşını
            doldurmamış veya elli yaşını doldurmuş işçide hak en az 20 gündür. Yer altı işinde 4 gün eklenir.
          </p>
          <p className="text-[15px] leading-7 text-ink">
            Kullanılmayan gün, toplam haktan kullanılan gün çıkarılarak bulunur. Günlük brüt, aylık
            çıplak ücretin 30’a bölünmesidir. Brüt izin ücreti bu günlük tutar ile kullanılmayan günün
            çarpımıdır; SGK, gelir vergisi ve damga kesilir.
          </p>
          <table className="w-full border-t border-ink/20 text-[14px] text-ink">
            <caption className="sr-only">Yıllık izin süreleri</caption>
            <thead>
              <tr className="border-b border-ink/20 text-left">
                <th className="py-3 pr-3 font-semibold">Hizmet yılı (n)</th>
                <th className="py-3 text-right font-semibold">İzin hakkı</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-ink/15">
                <td className="py-3 pr-3">1–5 yıl</td>
                <td className="py-3 text-right">14 gün</td>
              </tr>
              <tr className="border-b border-ink/15">
                <td className="py-3 pr-3">5 yıldan çok, 15 yıldan az</td>
                <td className="py-3 text-right">20 gün</td>
              </tr>
              <tr className="border-b border-ink/15">
                <td className="py-3 pr-3">15 yıl ve üzeri</td>
                <td className="py-3 text-right">26 gün</td>
              </tr>
            </tbody>
          </table>
        </>
      }
    >
      <YillikIzinCalculator />
    </CalculatorPageLayout>
  );
}
