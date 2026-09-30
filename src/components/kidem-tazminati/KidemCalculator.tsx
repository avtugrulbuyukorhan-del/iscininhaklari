"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  calculateKidem,
  currentKidemTavan,
  formatTry,
  toIsoDate,
  type KidemFormValues,
} from "@/lib/kidem-tazminati";

const fieldInputClass =
  "h-11 rounded-none border-0 border-b border-ink/30 bg-transparent px-0 text-[16px] tracking-tight text-ink shadow-none placeholder:text-ink/40 focus-visible:border-copper focus-visible:ring-0 md:text-[16px]";

function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0 space-y-2">
      <label htmlFor={id} className="block text-[13px] font-semibold text-ink">
        {label}
      </label>
      {children}
      {hint ? <p className="text-[12px] leading-4 text-ink/70">{hint}</p> : null}
    </div>
  );
}

function ResultRow({
  label,
  value,
  caption,
}: {
  label: string;
  value: string;
  caption?: string;
}) {
  return (
    <tr className="border-b border-ink/15 last:border-b-0">
      <th scope="row" className="py-3 pr-4 text-left text-[14px] font-medium text-ink">
        {label}
      </th>
      <td className="py-3 text-right text-[14px] tabular-nums text-ink">
        <span className="font-medium">{value}</span>
        {caption ? <span className="mt-0.5 block text-[12px] font-normal text-ink/70">{caption}</span> : null}
      </td>
    </tr>
  );
}

export function KidemCalculator() {
  const [values, setValues] = useState<KidemFormValues>(() => ({
    iseGiris: "",
    istenCikis: toIsoDate(new Date()),
    brutUcret: "",
    ekOdemeler: "",
  }));
  const result = useMemo(() => calculateKidem(values), [values]);
  const guncelTavan = currentKidemTavan();

  const onChange = (patch: Partial<KidemFormValues>) => {
    setValues((prev) => ({ ...prev, ...patch }));
  };

  return (
    <div className="overflow-hidden rounded-[4px] border border-ink/25">
      <section className="bg-cream px-5 py-7 sm:px-8 sm:py-8">
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-copper">Girdi</p>
        <form
          className="mt-6 grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2 xl:grid-cols-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <Field id="iseGiris" label="İşe giriş">
            <Input
              id="iseGiris"
              type="date"
              value={values.iseGiris}
              onChange={(e) => onChange({ iseGiris: e.target.value })}
              className={fieldInputClass}
            />
          </Field>
          <Field id="istenCikis" label="İşten ayrılış">
            <Input
              id="istenCikis"
              type="date"
              value={values.istenCikis}
              onChange={(e) => onChange({ istenCikis: e.target.value })}
              className={fieldInputClass}
            />
          </Field>
          <Field id="brutUcret" label="Giydirilmiş brüt" hint="Aylık, TL">
            <Input
              id="brutUcret"
              inputMode="decimal"
              value={values.brutUcret}
              onChange={(e) => onChange({ brutUcret: e.target.value })}
              placeholder="45.000"
              className={fieldInputClass}
            />
          </Field>
          <Field id="ekOdemeler" label="Düzenli ek ödemeler" hint="Yemek, yol, prim — opsiyonel">
            <Input
              id="ekOdemeler"
              inputMode="decimal"
              value={values.ekOdemeler}
              onChange={(e) => onChange({ ekOdemeler: e.target.value })}
              placeholder="0"
              className={fieldInputClass}
            />
          </Field>
        </form>
      </section>

      <section className="border-t border-ink/15 bg-white px-5 py-8 sm:px-8 sm:py-10">
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-copper">Sonuç</p>
        {!result.ok ? (
          <div className="mt-6">
            <p className="font-serif text-4xl leading-none tracking-tight text-ink/30 sm:text-5xl">—</p>
            <p className="mt-4 max-w-md text-[15px] leading-7 text-ink">{result.error}</p>
            <p className="mt-3 text-[13px] leading-6 text-ink/80">
              Güncel tavan ({guncelTavan.label}): {formatTry(guncelTavan.amount)}
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
              <p className="text-[14px] font-medium text-ink">Ele geçecek net tutar</p>
              <p className="font-serif text-4xl leading-none tracking-tight text-ink tabular-nums sm:text-5xl">
                {formatTry(result.net)}
              </p>
            </div>
            {!result.hakEder ? (
              <p className="border-l-2 border-copper pl-4 text-[14px] leading-6 text-ink">
                Kıdem tazminatı kural olarak en az 1 yıllık kıdem şartına bağlıdır. Bu sürede yasal
                hak doğmayabilir; tutar 0 gösterilir.
              </p>
            ) : null}
            <table className="w-full border-t border-ink/20 text-[14px] text-ink">
              <caption className="sr-only">Kıdem tazminatı hesap dökümü</caption>
              <tbody>
                <ResultRow label="Hizmet" value={result.hizmetLabel} />
                <ResultRow label="Giydirilmiş ücret" value={formatTry(result.giydirilmis)} />
                <ResultRow
                  label="Kıdem tavanı"
                  value={formatTry(result.tavan)}
                  caption={result.tavanLabel}
                />
                <ResultRow
                  label="Esas ücret"
                  value={
                    result.tavanUygulandi
                      ? `${formatTry(result.esasUcret)} · tavan`
                      : formatTry(result.esasUcret)
                  }
                />
                <ResultRow label="Brüt kıdem" value={formatTry(result.brut)} />
                <ResultRow label="Damga ‰7,59" value={formatTry(result.damga)} />
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="bg-white px-5 py-4 text-[13px] leading-5 text-ink/80 sm:px-8">
        Sonuç genel bilgilendirme içindir; tavan, damga oranı ve hak ediş şartları değişebilir.
        Dosyanıza özgü hesap için{" "}
        <Link href="/iletisim" className="text-copper underline-offset-2 hover:underline">
          iletişime geçin
        </Link>
        .
      </p>
    </div>
  );
}
