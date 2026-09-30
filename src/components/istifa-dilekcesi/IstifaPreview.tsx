"use client";

import { buildIstifaLetter, type IstifaFormValues } from "@/lib/istifa-dilekcesi";

export function IstifaPreview({ values }: { values: IstifaFormValues }) {
  const letter = buildIstifaLetter(values);

  return (
    <article className="mx-auto w-full max-w-[210mm] min-h-[297mm] border border-ink/10 bg-white px-10 py-12 sm:px-14 sm:py-16">
      <p className="text-right text-[13px] text-ink/70">{letter.tarih}</p>
      <h1 className="mt-10 text-center font-serif text-[18px] font-semibold tracking-[0.12em] text-ink">
        İSTİFA DİLEKÇESİ
      </h1>
      <div className="mt-10 space-y-1 text-[14px] leading-7 text-ink">
        <p className="font-medium">{letter.muhatapSatir}</p>
        {letter.adres ? <p className="whitespace-pre-line text-ink/70">{letter.adres}</p> : null}
      </div>
      <div className="mt-8 space-y-5 text-justify text-[14px] leading-7 text-ink">
        <p>{letter.paragraf1}</p>
        <p>{letter.paragraf2}</p>
      </div>
      <div className="mt-16 ml-auto w-[220px] space-y-1 text-center text-[13px] leading-6 text-ink">
        <p>{letter.imzaTarih}</p>
        <p className="font-medium">{letter.adSoyad}</p>
        {letter.tcKimlikNo ? <p>T.C. Kimlik No: {letter.tcKimlikNo}</p> : null}
        <p className="pt-6">İmza: ____________</p>
      </div>
    </article>
  );
}
