import { slugify } from "@/lib/slugify";

export const ISTIFA_PLACEHOLDER = "…………";

export type IhbarTercihi = "ihbar_uyarak" | "ihbar_tazminat" | "belirtme";

export type IstifaFormValues = {
  sirketUnvani: string;
  sirketAdresi: string;
  adSoyad: string;
  tcKimlikNo: string;
  pozisyon: string;
  iseGirisTarihi: string;
  sonCalismaGunu: string;
  ayrilmaSebebi: string;
  ihbarTercihi: IhbarTercihi;
  duzenlemeTarihi: string;
};

export const IHBAR_OPTIONS: { value: IhbarTercihi; label: string }[] = [
  { value: "ihbar_uyarak", label: "İhbar süresine uyarak" },
  { value: "ihbar_tazminat", label: "İhbar süresi tazminatımı kabul ederek" },
  { value: "belirtme", label: "Belirtme" },
];

export function todayIsoDate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function createEmptyIstifaForm(): IstifaFormValues {
  return {
    sirketUnvani: "",
    sirketAdresi: "",
    adSoyad: "",
    tcKimlikNo: "",
    pozisyon: "",
    iseGirisTarihi: "",
    sonCalismaGunu: "",
    ayrilmaSebebi: "",
    ihbarTercihi: "ihbar_uyarak",
    duzenlemeTarihi: todayIsoDate(),
  };
}

export function formatTrLongDate(iso: string): string {
  const trimmed = iso.trim();
  if (!trimmed) return ISTIFA_PLACEHOLDER;
  const d = new Date(`${trimmed}T00:00:00`);
  if (Number.isNaN(d.getTime())) return ISTIFA_PLACEHOLDER;
  return d.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function displayOrPlaceholder(value: string): string {
  const t = value.trim();
  return t || ISTIFA_PLACEHOLDER;
}

export function ihbarClause(tercih: IhbarTercihi): string {
  if (tercih === "ihbar_uyarak") return "ihbar süresine uyarak";
  if (tercih === "ihbar_tazminat") return "ihbar süresi tazminatımı kabul ederek";
  return "";
}

export type IstifaLetterContent = {
  tarih: string;
  muhatapSatir: string;
  adres: string | null;
  paragraf1: string;
  paragraf2: string;
  imzaTarih: string;
  adSoyad: string;
  tcKimlikNo: string | null;
};

export function buildIstifaLetter(values: IstifaFormValues): IstifaLetterContent {
  const sirket = displayOrPlaceholder(values.sirketUnvani);
  const pozisyon = displayOrPlaceholder(values.pozisyon);
  const giris = formatTrLongDate(values.iseGirisTarihi);
  const cikis = formatTrLongDate(values.sonCalismaGunu);
  const duzenleme = formatTrLongDate(values.duzenlemeTarihi);
  const adSoyad = displayOrPlaceholder(values.adSoyad);
  const clause = ihbarClause(values.ihbarTercihi);
  const ayrilma = clause ? `görevimden ${clause} ayrılmak` : "görevimden ayrılmak";
  const adres = values.sirketAdresi.trim() || null;
  const tc = values.tcKimlikNo.trim() || null;
  const sebep = values.ayrilmaSebebi.trim();
  const fesihCumlesi = sebep
    ? `${sebep} nedeniyle iş sözleşmemi kendi isteğimle feshetmek istiyorum.`
    : "İş sözleşmemi kendi isteğimle feshetmek istiyorum.";

  return {
    tarih: duzenleme,
    muhatapSatir: `${sirket} İnsan Kaynakları Departmanına`,
    adres,
    paragraf1: `${sirket} bünyesinde ${pozisyon} pozisyonunda ${giris} tarihinden itibaren çalışmaktayım. ${fesihCumlesi}`,
    paragraf2: `${cikis} tarihi itibarıyla ${ayrilma} istediğimi bilgilerinize sunar, gereğinin yapılmasını arz ederim.`,
    imzaTarih: duzenleme,
    adSoyad,
    tcKimlikNo: tc,
  };
}

export function isIstifaFormValid(values: IstifaFormValues): boolean {
  return (
    values.sirketUnvani.trim().length > 0 &&
    values.adSoyad.trim().length > 0 &&
    values.pozisyon.trim().length > 0 &&
    values.sonCalismaGunu.trim().length > 0
  );
}

export function pdfFileName(adSoyad: string): string {
  const slug = slugify(adSoyad.trim()) || "istifa-dilekcesi";
  return `istifa-dilekcesi-${slug}.pdf`;
}
