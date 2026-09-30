"use client";

import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";
import { CALCULATOR_PATHS, DISCLAIMER } from "@/lib/calculators/config";
import { formatTry } from "@/lib/calculators/money";
import type { KesintiDokumu } from "@/lib/calculators/kesintiler";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";

export const fieldInputClass =
  "h-11 rounded-none border-0 border-b border-ink/30 bg-transparent px-0 text-[16px] tracking-tight text-ink shadow-none placeholder:text-ink/40 focus-visible:border-copper focus-visible:ring-0 md:text-[16px]";

export function CalcField({
  id,
  label,
  hint,
  children,
}: {
  id?: string;
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

export function CalcInput(props: ComponentProps<typeof Input>) {
  return <Input {...props} className={[fieldInputClass, props.className].filter(Boolean).join(" ")} />;
}

export function ResultRow({
  label,
  value,
  caption,
  strong,
}: {
  label: string;
  value: string;
  caption?: string;
  strong?: boolean;
}) {
  return (
    <tr className="border-b border-ink/15 last:border-b-0">
      <th
        scope="row"
        className={`py-3 pr-4 text-left text-[14px] ${strong ? "font-semibold" : "font-medium"} text-ink`}
      >
        {label}
      </th>
      <td className={`py-3 text-right text-[14px] tabular-nums text-ink ${strong ? "font-semibold" : "font-medium"}`}>
        {value}
        {caption ? <span className="mt-0.5 block text-[12px] font-normal text-ink/70">{caption}</span> : null}
      </td>
    </tr>
  );
}

export function DeductionsTable({ brut, kesintiler }: { brut: number; kesintiler: KesintiDokumu }) {
  return (
    <table className="w-full border-t border-ink/20 text-[14px] text-ink">
      <caption className="sr-only">Kesinti dökümü</caption>
      <tbody>
        <ResultRow label="Brüt tutar" value={formatTry(brut)} />
        {kesintiler.sgk > 0 ? <ResultRow label="SGK + işsizlik (işçi)" value={formatTry(kesintiler.sgk)} /> : (
          <ResultRow label="SGK" value="Kesilmez" />
        )}
        <ResultRow label="Gelir vergisi" value={formatTry(kesintiler.gelirVergisi)} />
        <ResultRow label="Damga vergisi" value={formatTry(kesintiler.damga)} />
        <ResultRow label="Net tutar" value={formatTry(kesintiler.net)} strong />
      </tbody>
    </table>
  );
}

export function StepsAccordion({ steps }: { steps: string[] }) {
  if (!steps.length) return null;
  return (
    <Accordion type="single" collapsible className="border-t border-ink/15">
      <AccordionItem value="adimlar" className="border-0">
        <AccordionTrigger className="text-[14px] font-semibold text-ink hover:no-underline">
          Hesaplama adımları
        </AccordionTrigger>
        <AccordionContent>
          <ol className="list-decimal space-y-2 pl-5 text-[14px] leading-6 text-ink">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export function CalculatorShell({
  children,
  note,
}: {
  children: ReactNode;
  note?: string;
}) {
  return (
    <div className="overflow-hidden rounded-[4px] border border-ink/25">
      {children}
      <p className="bg-white px-5 py-4 text-[13px] leading-5 text-ink sm:px-8">{note ?? DISCLAIMER}</p>
    </div>
  );
}

export function RelatedCalculators({ current }: { current: keyof typeof CALCULATOR_PATHS }) {
  const items = [
    { key: "ihbar" as const, label: "İhbar Tazminatı Hesaplama" },
    { key: "fazlaMesai" as const, label: "Fazla Mesai Ücreti Hesaplama" },
    { key: "yillikIzin" as const, label: "Yıllık İzin Ücreti Hesaplama" },
  ].filter((item) => item.key !== current);

  return (
    <nav className="max-w-2xl space-y-3" aria-label="Diğer hesaplama araçları">
      <p className="text-[13px] font-semibold text-ink">Diğer hesaplama araçları</p>
      <ul className="flex flex-col gap-2 sm:flex-row sm:gap-3">
        {items.map((item) => (
          <li key={item.key} className="min-w-0 sm:flex-1">
            <Link
              href={CALCULATOR_PATHS[item.key]}
              className="flex h-full items-center rounded-[8px] border border-ink/20 px-4 py-3 text-[14px] font-medium text-[#E86969] transition-colors hover:border-[#E86969]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E86969]/40"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
