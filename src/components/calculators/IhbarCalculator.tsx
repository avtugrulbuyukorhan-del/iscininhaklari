"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { calculateIhbar } from "@/lib/calculators/ihbar";
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

type YanOdeme = { id: string; ad: string; tutar: string };

let yanOdemeSeq = 1;

function newRow(): YanOdeme {
  yanOdemeSeq += 1;
  return { id: `yan-${yanOdemeSeq}`, ad: "", tutar: "" };
}

export function IhbarCalculator() {
  const [iseGiris, setIseGiris] = useState("");
  const [istenCikis, setIstenCikis] = useState(() => toIsoDate(new Date()));
  const [aylikBrut, setAylikBrut] = useState("");
  const [yanOdemeler, setYanOdemeler] = useState<YanOdeme[]>([{ id: "yan-1", ad: "", tutar: "" }]);
  const [kumulatif, setKumulatif] = useState("");

  const result = useMemo(() => {
    const start = parseIsoDate(iseGiris);
    const end = parseIsoDate(istenCikis);
    const brut = parseMoney(aylikBrut);
    const extras = yanOdemeler.map((row) => parseMoney(row.tutar));
    const matrah = parseMoney(kumulatif);
    if (!start || !end) return { ok: false as const, error: "İşe giriş ve çıkış tarihlerini girin." };
    if (brut === null || extras.some((n) => n === null) || matrah === null) {
      return { ok: false as const, error: "Ücret alanlarına geçerli bir tutar yazın." };
    }
    return calculateIhbar({
      iseGiris: start,
      istenCikis: end,
      aylikBrut: brut,
      yanOdemeler: extras as number[],
      kumulatifMatrah: matrah,
    });
  }, [iseGiris, istenCikis, aylikBrut, yanOdemeler, kumulatif]);

  return (
    <CalculatorShell>
      <section className="bg-cream px-5 py-7 sm:px-8 sm:py-8">
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-copper">Girdi</p>
        <form className="mt-6 grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
          <CalcField id="ihbar-giris" label="İşe giriş">
            <CalcInput id="ihbar-giris" type="date" value={iseGiris} onChange={(e) => setIseGiris(e.target.value)} />
          </CalcField>
          <CalcField id="ihbar-cikis" label="İşten çıkış">
            <CalcInput id="ihbar-cikis" type="date" value={istenCikis} onChange={(e) => setIstenCikis(e.target.value)} />
          </CalcField>
          <CalcField id="ihbar-brut" label="Aylık brüt ücret" hint="TL">
            <CalcInput
              id="ihbar-brut"
              inputMode="decimal"
              value={aylikBrut}
              onChange={(e) => setAylikBrut(e.target.value)}
              placeholder="40.000"
            />
          </CalcField>
          <CalcField id="ihbar-gv" label="Kümülatif GV matrahı" hint="Opsiyonel">
            <CalcInput
              id="ihbar-gv"
              inputMode="decimal"
              value={kumulatif}
              onChange={(e) => setKumulatif(e.target.value)}
              placeholder="0"
            />
          </CalcField>
        </form>

        <div className="mt-8 space-y-4">
          <p className="text-[13px] font-semibold text-ink">Düzenli aylık yan ödemeler</p>
          <p className="text-[12px] text-ink/70">Yol, yemek, ikramiye/12 vb. Satır ekleyip çıkarabilirsiniz.</p>
          <div className="space-y-4">
            {yanOdemeler.map((row, index) => (
              <div key={row.id} className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1fr_auto]">
                <CalcField id={`yan-ad-${row.id}`} label={index === 0 ? "Açıklama" : ""}>
                  <CalcInput
                    id={`yan-ad-${row.id}`}
                    value={row.ad}
                    onChange={(e) =>
                      setYanOdemeler((rows) => rows.map((r) => (r.id === row.id ? { ...r, ad: e.target.value } : r)))
                    }
                    placeholder="Yemek"
                  />
                </CalcField>
                <CalcField id={`yan-tutar-${row.id}`} label={index === 0 ? "Tutar (TL)" : ""}>
                  <CalcInput
                    id={`yan-tutar-${row.id}`}
                    inputMode="decimal"
                    value={row.tutar}
                    onChange={(e) =>
                      setYanOdemeler((rows) =>
                        rows.map((r) => (r.id === row.id ? { ...r, tutar: e.target.value } : r))
                      )
                    }
                    placeholder="5.000"
                  />
                </CalcField>
                <div className={index === 0 ? "flex items-end pb-1" : "flex items-center"}>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-ink"
                    onClick={() => setYanOdemeler((rows) => (rows.length === 1 ? [newRow()] : rows.filter((r) => r.id !== row.id)))}
                    aria-label="Satırı sil"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            className="border-ink/20 text-ink"
            onClick={() => setYanOdemeler((rows) => [...rows, newRow()])}
          >
            <Plus className="size-4" />
            Satır ekle
          </Button>
        </div>
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
              İhbar tazminatında kıdem tazminatı tavanı uygulanmaz.
            </p>
            <table className="w-full border-t border-ink/20 text-[14px] text-ink">
              <caption className="sr-only">İhbar tazminatı özeti</caption>
              <tbody>
                <ResultRow label="Hizmet süresi" value={result.hizmet.label} />
                <ResultRow label="İhbar süresi" value={`${result.ihbarGun} gün`} />
                <ResultRow label="Giydirilmiş aylık brüt" value={formatTry(result.giydirilmisAylik)} />
                <ResultRow label="Günlük giydirilmiş brüt" value={formatTry(result.gunlukGiydirilmis)} />
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
