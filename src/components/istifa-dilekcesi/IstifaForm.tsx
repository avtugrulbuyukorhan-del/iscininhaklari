"use client";

import type { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IHBAR_OPTIONS, type IstifaFormValues } from "@/lib/istifa-dilekcesi";

const fieldInputClass =
  "h-11 rounded-none border-0 border-b border-ink/15 bg-transparent px-0 text-[16px] tracking-tight text-ink shadow-none placeholder:text-ink/30 focus-visible:border-copper focus-visible:ring-0 md:text-[16px]";

const fieldTextareaClass =
  "min-h-[2.75rem] resize-y rounded-none border-0 border-b border-ink/15 bg-transparent px-0 py-2 text-[16px] tracking-tight text-ink shadow-none placeholder:text-ink/30 focus-visible:border-copper focus-visible:ring-0 md:text-[16px]";

const fieldSelectClass =
  "h-11 w-full appearance-none rounded-none border-0 border-b border-ink/15 bg-transparent px-0 text-[16px] tracking-tight text-ink outline-none focus-visible:border-copper";

type IstifaFormProps = {
  values: IstifaFormValues;
  onChange: (patch: Partial<IstifaFormValues>) => void;
};

function Field({
  id,
  label,
  hint,
  className,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className ?? "min-w-0 space-y-2"}>
      <label
        htmlFor={id}
        className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45"
      >
        {label}
      </label>
      {children}
      {hint ? <p className="text-[11px] leading-4 text-ink/40">{hint}</p> : null}
    </div>
  );
}

export function IstifaForm({ values, onChange }: IstifaFormProps) {
  return (
    <form
      className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2"
      onSubmit={(e) => e.preventDefault()}
    >
      <Field id="sirketUnvani" label="Şirket / işveren" className="min-w-0 space-y-2 sm:col-span-2">
        <Input
          id="sirketUnvani"
          value={values.sirketUnvani}
          onChange={(e) => onChange({ sirketUnvani: e.target.value })}
          placeholder="ABC Tekstil San. ve Tic. A.Ş."
          className={fieldInputClass}
        />
      </Field>
      <Field id="adSoyad" label="Ad soyad">
        <Input
          id="adSoyad"
          value={values.adSoyad}
          onChange={(e) => onChange({ adSoyad: e.target.value })}
          placeholder="Adınız Soyadınız"
          className={fieldInputClass}
        />
      </Field>
      <Field id="tcKimlikNo" label="T.C. kimlik no" hint="Opsiyonel">
        <Input
          id="tcKimlikNo"
          inputMode="numeric"
          maxLength={11}
          value={values.tcKimlikNo}
          onChange={(e) => onChange({ tcKimlikNo: e.target.value.replace(/\D/g, "").slice(0, 11) })}
          placeholder="11 hane"
          className={fieldInputClass}
        />
      </Field>
      <Field id="sirketAdresi" label="Şirket adresi" hint="Opsiyonel" className="min-w-0 space-y-2 sm:col-span-2">
        <Textarea
          id="sirketAdresi"
          value={values.sirketAdresi}
          onChange={(e) => onChange({ sirketAdresi: e.target.value })}
          placeholder="Mahalle, cadde, ilçe / il"
          rows={2}
          className={fieldTextareaClass}
        />
      </Field>
      <Field id="pozisyon" label="Görev / pozisyon">
        <Input
          id="pozisyon"
          value={values.pozisyon}
          onChange={(e) => onChange({ pozisyon: e.target.value })}
          placeholder="Satış Danışmanı"
          className={fieldInputClass}
        />
      </Field>
      <Field id="ihbarTercihi" label="İhbar süresi">
        <select
          id="ihbarTercihi"
          value={values.ihbarTercihi}
          onChange={(e) => onChange({ ihbarTercihi: e.target.value as IstifaFormValues["ihbarTercihi"] })}
          className={fieldSelectClass}
        >
          {IHBAR_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </Field>
      <Field id="iseGirisTarihi" label="İşe giriş">
        <Input
          id="iseGirisTarihi"
          type="date"
          value={values.iseGirisTarihi}
          onChange={(e) => onChange({ iseGirisTarihi: e.target.value })}
          className={fieldInputClass}
        />
      </Field>
      <Field id="sonCalismaGunu" label="Son çalışma günü">
        <Input
          id="sonCalismaGunu"
          type="date"
          value={values.sonCalismaGunu}
          onChange={(e) => onChange({ sonCalismaGunu: e.target.value })}
          className={fieldInputClass}
        />
      </Field>
      <Field id="duzenlemeTarihi" label="Düzenleme tarihi">
        <Input
          id="duzenlemeTarihi"
          type="date"
          value={values.duzenlemeTarihi}
          onChange={(e) => onChange({ duzenlemeTarihi: e.target.value })}
          className={fieldInputClass}
        />
      </Field>
      <Field
        id="ayrilmaSebebi"
        label="Ayrılma sebebi"
        hint="Opsiyonel"
        className="min-w-0 space-y-2 sm:col-span-2"
      >
        <Textarea
          id="ayrilmaSebebi"
          value={values.ayrilmaSebebi}
          onChange={(e) => onChange({ ayrilmaSebebi: e.target.value })}
          placeholder="Kişisel nedenler, taşınma, yeni iş"
          rows={2}
          className={fieldTextareaClass}
        />
      </Field>
    </form>
  );
}
