"use client";

import { useMemo, useState } from "react";
import {
  calculateFazlaMesai,
  HAFTA_GUNLERI,
  type HaftaGunu,
} from "@/lib/calculators/fazlaMesai";
import { CONFIG } from "@/lib/calculators/config";
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

function defaultHafta(): HaftaGunu[] {
  return HAFTA_GUNLERI.map((_, i) => ({
    calisir: i < 5,
    baslangic: "08:00",
    bitis: "17:00",
  }));
}

export function FazlaMesaiCalculator() {
  const [donemBaslangic, setDonemBaslangic] = useState("");
  const [donemBitis, setDonemBitis] = useState(() => toIsoDate(new Date()));
  const [hafta, setHafta] = useState<HaftaGunu[]>(defaultHafta);
  const [aylikBrut, setAylikBrut] = useState("");
  const [calisilmayan, setCalisilmayan] = useState("0");
  const [hakkaniyet, setHakkaniyet] = useState(false);
  const [hakkaniyetOran, setHakkaniyetOran] = useState("30");
  const [kumulatif, setKumulatif] = useState("");

  const patchGun = (index: number, patch: Partial<HaftaGunu>) => {
    setHafta((rows) => rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  const result = useMemo(() => {
    const start = parseIsoDate(donemBaslangic);
    const end = parseIsoDate(donemBitis);
    const brut = parseMoney(aylikBrut);
    const izin = parseMoney(calisilmayan);
    const matrah = parseMoney(kumulatif);
    const oranRaw = parseMoney(hakkaniyetOran);
    if (!start || !end) return { ok: false as const, error: "Çalışma dönemi tarihlerini girin." };
    if (brut === null || izin === null || matrah === null || oranRaw === null) {
      return { ok: false as const, error: "Sayısal alanlara geçerli bir değer yazın." };
    }
    return calculateFazlaMesai({
      donemBaslangic: start,
      donemBitis: end,
      hafta,
      aylikBrut: brut,
      calisilmayanGun: izin,
      hakkaniyetUygula: hakkaniyet,
      hakkaniyetOrani: oranRaw / 100,
      kumulatifMatrah: matrah,
    });
  }, [donemBaslangic, donemBitis, hafta, aylikBrut, calisilmayan, hakkaniyet, hakkaniyetOran, kumulatif]);

  return (
    <CalculatorShell>
      <section className="bg-cream px-5 py-7 sm:px-8 sm:py-8">
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-copper">Girdi</p>
        <form className="mt-6 grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
          <CalcField id="fm-bas" label="Dönem başlangıcı">
            <CalcInput id="fm-bas" type="date" value={donemBaslangic} onChange={(e) => setDonemBaslangic(e.target.value)} />
          </CalcField>
          <CalcField id="fm-bit" label="Dönem bitişi">
            <CalcInput id="fm-bit" type="date" value={donemBitis} onChange={(e) => setDonemBitis(e.target.value)} />
          </CalcField>
          <CalcField id="fm-brut" label="Aylık brüt ücret" hint="TL">
            <CalcInput
              id="fm-brut"
              inputMode="decimal"
              value={aylikBrut}
              onChange={(e) => setAylikBrut(e.target.value)}
              placeholder="30.000"
            />
          </CalcField>
          <CalcField id="fm-izin" label="Çalışılmayan gün sayısı" hint="Yıllık izin, rapor vb.">
            <CalcInput
              id="fm-izin"
              inputMode="numeric"
              value={calisilmayan}
              onChange={(e) => setCalisilmayan(e.target.value)}
            />
          </CalcField>
          <CalcField id="fm-gv" label="Kümülatif GV matrahı" hint="Opsiyonel">
            <CalcInput
              id="fm-gv"
              inputMode="decimal"
              value={kumulatif}
              onChange={(e) => setKumulatif(e.target.value)}
              placeholder="0"
            />
          </CalcField>
          <div className="space-y-3 sm:col-span-2">
            <label className="flex cursor-pointer items-start gap-2.5 text-[14px] text-ink">
              <input
                type="checkbox"
                checked={hakkaniyet}
                onChange={(e) => setHakkaniyet(e.target.checked)}
                className="mt-1 size-3.5 shrink-0 border-ink/30 text-[#E86969] focus:ring-[#E86969]/30"
              />
              <span>Hakkaniyet indirimi uygula</span>
            </label>
            {hakkaniyet ? (
              <CalcField id="fm-hak" label="İndirim oranı (%)" hint={`Varsayılan %${CONFIG.hakkaniyetIndirimiVarsayilan * 100}`}>
                <CalcInput
                  id="fm-hak"
                  inputMode="decimal"
                  value={hakkaniyetOran}
                  onChange={(e) => setHakkaniyetOran(e.target.value)}
                />
              </CalcField>
            ) : null}
          </div>
        </form>

        <div className="mt-8 overflow-x-auto">
          <p className="mb-4 text-[13px] font-semibold text-ink">Haftalık çalışma saatleri</p>
          <table className="w-full min-w-[520px] text-[14px] text-ink">
            <thead>
              <tr className="border-b border-ink/20 text-left">
                <th className="py-2 pr-3 font-semibold">Gün</th>
                <th className="py-2 pr-3 font-semibold">Çalışır</th>
                <th className="py-2 pr-3 font-semibold">Başlangıç</th>
                <th className="py-2 font-semibold">Bitiş</th>
              </tr>
            </thead>
            <tbody>
              {hafta.map((gun, i) => (
                <tr key={HAFTA_GUNLERI[i]} className="border-b border-ink/10">
                  <td className="py-3 pr-3 font-medium">{HAFTA_GUNLERI[i]}</td>
                  <td className="py-3 pr-3">
                    <input
                      type="checkbox"
                      checked={gun.calisir}
                      onChange={(e) => patchGun(i, { calisir: e.target.checked })}
                      aria-label={`${HAFTA_GUNLERI[i]} çalışılır`}
                      className="size-3.5 border-ink/30 text-[#E86969] focus:ring-[#E86969]/30"
                    />
                  </td>
                  <td className="py-3 pr-3">
                    <CalcInput
                      type="time"
                      value={gun.baslangic}
                      disabled={!gun.calisir}
                      onChange={(e) => patchGun(i, { baslangic: e.target.value })}
                      aria-label={`${HAFTA_GUNLERI[i]} başlangıç`}
                    />
                  </td>
                  <td className="py-3">
                    <CalcInput
                      type="time"
                      value={gun.bitis}
                      disabled={!gun.calisir}
                      onChange={(e) => patchGun(i, { bitis: e.target.value })}
                      aria-label={`${HAFTA_GUNLERI[i]} bitiş`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
            {result.yillikSinirAsildi ? (
              <p className="border-l-2 border-copper pl-4 text-[14px] leading-6 text-ink">
                m.41 yıllık {CONFIG.yillikFazlaMesaiSiniri} saat sınırı aşılıyor — işçinin alacağını ortadan kaldırmaz.
              </p>
            ) : null}
            <table className="w-full border-t border-ink/20 text-[14px] text-ink">
              <caption className="sr-only">Fazla mesai özeti</caption>
              <tbody>
                <ResultRow label="Haftalık net çalışma" value={`${result.haftalik.netSaat} saat`} />
                <ResultRow label="Haftalık fazla mesai" value={`${result.haftalik.fazlaMesaiSaat} saat`} />
                <ResultRow label="Toplam FM saati" value={`${result.toplamFmSaat} saat`} />
                <ResultRow label="Saatlik brüt" value={formatTry(result.saatlikBrut)} />
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
