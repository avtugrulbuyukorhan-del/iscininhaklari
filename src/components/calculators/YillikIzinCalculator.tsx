"use client";

import { useMemo, useState } from "react";
import { calculateYillikIzin } from "@/lib/calculators/yillikIzin";
import { parseIsoDate, toIsoDate } from "@/lib/calculators/dates";
import { formatTry, parseMoney } from "@/lib/calculators/money";
import {
  CalcField,
  CalcInput,
  CalculatorShell,
  DeductionsTable,
  ResultRow,
  StepsAccordion,
} from "@/components/calculators/calc-ui";

export function YillikIzinCalculator() {
  const [iseGiris, setIseGiris] = useState("");
  const [istenCikis, setIstenCikis] = useState(() => toIsoDate(new Date()));
  const [dogum, setDogum] = useState("");
  const [aylikBrut, setAylikBrut] = useState("");
  const [kullanilan, setKullanilan] = useState("0");
  const [yerAlti, setYerAlti] = useState(false);
  const [kumulatif, setKumulatif] = useState("");

  const result = useMemo(() => {
    const start = parseIsoDate(iseGiris);
    const end = parseIsoDate(istenCikis);
    const birth = parseIsoDate(dogum);
    const brut = parseMoney(aylikBrut);
    const used = parseMoney(kullanilan);
    const matrah = parseMoney(kumulatif);
    if (!start || !end) return { ok: false as const, error: "İşe giriş ve çıkış tarihlerini girin." };
    if (!birth) return { ok: false as const, error: "Doğum tarihini girin." };
    if (brut === null || used === null || matrah === null) {
      return { ok: false as const, error: "Sayısal alanlara geçerli bir değer yazın." };
    }
    return calculateYillikIzin({
      iseGiris: start,
      istenCikis: end,
      dogumTarihi: birth,
      aylikBrut: brut,
      kullanilanGun: used,
      yerAlti,
      kumulatifMatrah: matrah,
    });
  }, [iseGiris, istenCikis, dogum, aylikBrut, kullanilan, yerAlti, kumulatif]);

  return (
    <CalculatorShell>
      <section className="bg-cream px-5 py-7 sm:px-8 sm:py-8">
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-copper">Girdi</p>
        <form className="mt-6 grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
          <CalcField id="izin-giris" label="İşe giriş">
            <CalcInput id="izin-giris" type="date" value={iseGiris} onChange={(e) => setIseGiris(e.target.value)} />
          </CalcField>
          <CalcField id="izin-cikis" label="İşten çıkış">
            <CalcInput id="izin-cikis" type="date" value={istenCikis} onChange={(e) => setIstenCikis(e.target.value)} />
          </CalcField>
          <CalcField id="izin-dogum" label="Doğum tarihi">
            <CalcInput id="izin-dogum" type="date" value={dogum} onChange={(e) => setDogum(e.target.value)} />
          </CalcField>
          <CalcField id="izin-brut" label="Aylık brüt ücret" hint="Çıplak ücret — yan ödeme dahil değil">
            <CalcInput
              id="izin-brut"
              inputMode="decimal"
              value={aylikBrut}
              onChange={(e) => setAylikBrut(e.target.value)}
              placeholder="30.000"
            />
          </CalcField>
          <CalcField id="izin-kullanilan" label="Kullanılan toplam izin günü">
            <CalcInput
              id="izin-kullanilan"
              inputMode="decimal"
              value={kullanilan}
              onChange={(e) => setKullanilan(e.target.value)}
            />
          </CalcField>
          <CalcField id="izin-gv" label="Kümülatif GV matrahı" hint="Opsiyonel">
            <CalcInput
              id="izin-gv"
              inputMode="decimal"
              value={kumulatif}
              onChange={(e) => setKumulatif(e.target.value)}
              placeholder="0"
            />
          </CalcField>
          <label className="flex cursor-pointer items-start gap-2.5 text-[14px] text-ink sm:col-span-2">
            <input
              type="checkbox"
              checked={yerAlti}
              onChange={(e) => setYerAlti(e.target.checked)}
              className="mt-1 size-3.5 shrink-0 border-ink/30 text-[#E86969] focus:ring-[#E86969]/30"
            />
            <span>Yer altı işi</span>
          </label>
        </form>
      </section>

      <section className="border-t border-ink/15 bg-white px-5 py-8 sm:px-8 sm:py-10">
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-copper">Sonuç</p>
        {!result.ok ? (
          <div className="mt-6">
            <p className="font-serif text-4xl leading-none tracking-tight text-ink/30 sm:text-5xl">—</p>
            <p className="mt-4 max-w-md text-[15px] leading-7 text-ink">{result.error}</p>
          </div>
        ) : (
          <div className="mt-5 space-y-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
              <p className="text-[14px] font-medium text-ink">Ele geçecek net tutar</p>
              <p className="font-serif text-4xl leading-none tracking-tight text-ink tabular-nums sm:text-5xl">
                {formatTry(result.kesintiler.net)}
              </p>
            </div>
            <p className="border-l-2 border-copper pl-4 text-[14px] leading-6 text-ink">
              Fesihte ödenen izin ücretinde son brüt ücret esas alınır; yan ödemeler dahil edilmez.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] border-t border-ink/20 text-[14px] text-ink">
                <caption className="sr-only">Yıllık izin hakkı tablosu</caption>
                <thead>
                  <tr className="border-b border-ink/20 text-left">
                    <th className="py-3 pr-3 font-semibold">Yıl</th>
                    <th className="py-3 pr-3 font-semibold">Tamamlanma</th>
                    <th className="py-3 pr-3 font-semibold">Yaş</th>
                    <th className="py-3 text-right font-semibold">Hak edilen gün</th>
                  </tr>
                </thead>
                <tbody>
                  {result.satirlar.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-3 text-ink">
                        Tamamlanan hizmet yılı yok; kıst dönem için izin hakkı doğmaz.
                      </td>
                    </tr>
                  ) : (
                    result.satirlar.map((row) => (
                      <tr key={row.n} className="border-b border-ink/15">
                        <td className="py-3 pr-3">{row.n}. yıl</td>
                        <td className="py-3 pr-3">{row.tamamlanma.toLocaleDateString("tr-TR")}</td>
                        <td className="py-3 pr-3">{row.yas}</td>
                        <td className="py-3 text-right tabular-nums">{row.hakGun}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <table className="w-full border-t border-ink/20 text-[14px] text-ink">
              <tbody>
                <ResultRow label="Toplam hak" value={`${result.toplamHak} gün`} />
                <ResultRow label="Kullanılan" value={`${result.kullanilanGun} gün`} />
                <ResultRow label="Kullanılmayan" value={`${result.kullanilmayanGun} gün`} />
                <ResultRow label="Günlük brüt" value={formatTry(result.gunlukBrut)} />
              </tbody>
            </table>
            <DeductionsTable brut={result.brut} kesintiler={result.kesintiler} />
            <StepsAccordion steps={result.adimlar} />
          </div>
        )}
      </section>
    </CalculatorShell>
  );
}
