"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { IstifaForm } from "@/components/istifa-dilekcesi/IstifaForm";
import { IstifaPreview } from "@/components/istifa-dilekcesi/IstifaPreview";
import { createEmptyIstifaForm, type IstifaFormValues } from "@/lib/istifa-dilekcesi";
import { Button } from "@/components/ui/button";

const IstifaPdfDownload = dynamic(
  () => import("@/components/istifa-dilekcesi/IstifaPdfDownload"),
  {
    ssr: false,
    loading: () => (
      <Button disabled variant="copper" className="w-full">
        PDF olarak indir
      </Button>
    ),
  }
);

export function IstifaDilekcesiGenerator() {
  const [values, setValues] = useState<IstifaFormValues>(createEmptyIstifaForm);

  const onChange = (patch: Partial<IstifaFormValues>) => {
    setValues((prev) => ({ ...prev, ...patch }));
  };

  return (
    <div className="overflow-hidden rounded-[4px] border border-ink/15">
      <div className="grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:items-start">
        <section className="bg-cream px-5 py-7 sm:px-8 sm:py-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-copper">Girdi</p>
          <div className="mt-6">
            <IstifaForm values={values} onChange={onChange} />
          </div>
          <div className="mt-8">
            <IstifaPdfDownload values={values} />
          </div>
        </section>

        <section className="border-t border-ink/10 bg-white px-5 py-7 sm:px-8 sm:py-8 lg:sticky lg:top-24 lg:border-t-0 lg:border-l">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-copper">Önizleme</p>
          <div className="mt-6 overflow-x-auto">
            <IstifaPreview values={values} />
          </div>
        </section>
      </div>
      <p className="border-t border-ink/10 bg-white px-5 py-4 text-[12px] leading-5 text-ink/45 sm:px-8">
        Oluşturulan metin genel bilgilendirme içindir; kendi durumunuza göre kontrol etmeniz gerekir.
        Dosyanıza özgü dilekçe için{" "}
        <Link href="/iletisim" className="text-copper underline-offset-2 hover:underline">
          iletişime geçin
        </Link>
        .
      </p>
    </div>
  );
}
