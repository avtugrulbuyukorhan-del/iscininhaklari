export const DAMGA_VERGISI_ORANI = 0.00759;

export const KIDEM_TAVANLARI: { start: string; end: string; amount: number; label: string }[] = [
  { start: "2024-01-01", end: "2024-06-30", amount: 35058.58, label: "1 Ocak – 30 Haziran 2024" },
  { start: "2024-07-01", end: "2024-12-31", amount: 41828.42, label: "1 Temmuz – 31 Aralık 2024" },
  { start: "2025-01-01", end: "2025-06-30", amount: 46655.43, label: "1 Ocak – 30 Haziran 2025" },
  { start: "2025-07-01", end: "2025-12-31", amount: 53919.68, label: "1 Temmuz – 31 Aralık 2025" },
  { start: "2026-01-01", end: "2026-06-30", amount: 64948.77, label: "1 Ocak – 30 Haziran 2026" },
  { start: "2026-07-01", end: "2026-12-31", amount: 73729.87, label: "1 Temmuz – 31 Aralık 2026" },
];

export type KidemFormValues = {
  iseGiris: string;
  istenCikis: string;
  brutUcret: string;
  ekOdemeler: string;
};

export type KidemResult =
  | { ok: false; error: string }
  | {
      ok: true;
      yil: number;
      kalanGun: number;
      hizmetLabel: string;
      giydirilmis: number;
      tavan: number;
      tavanLabel: string;
      tavanUygulandi: boolean;
      esasUcret: number;
      hakEder: boolean;
      brut: number;
      damga: number;
      net: number;
    };

export function createEmptyKidemForm(): KidemFormValues {
  return { iseGiris: "", istenCikis: "", brutUcret: "", ekOdemeler: "" };
}

export function parseIsoDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [y, m, d] = value.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return null;
  return dt;
}

export function parseMoney(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return 0;
  const normalized = trimmed.replace(/\./g, "").replace(",", ".").replace(/[^\d.-]/g, "");
  if (!normalized) return null;
  const n = Number(normalized);
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addYears(d: Date, years: number): Date {
  const next = new Date(d.getFullYear() + years, d.getMonth(), d.getDate());
  if (d.getMonth() === 1 && d.getDate() === 29 && next.getMonth() !== 1) {
    return new Date(d.getFullYear() + years, 1, 28);
  }
  return next;
}

function diffDays(from: Date, to: Date): number {
  const a = startOfDay(from).getTime();
  const b = startOfDay(to).getTime();
  return Math.round((b - a) / 86400000);
}

export function serviceBreakdown(start: Date, end: Date): { yil: number; kalanGun: number } {
  const s = startOfDay(start);
  const e = startOfDay(end);
  let yil = 0;
  let cursor = s;
  while (true) {
    const next = addYears(cursor, 1);
    if (next.getTime() <= e.getTime()) {
      yil += 1;
      cursor = next;
    } else {
      break;
    }
  }
  return { yil, kalanGun: Math.max(0, diffDays(cursor, e)) };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function tavanForDate(date: Date): { amount: number; label: string } {
  const iso = toIsoDate(date);
  const hit = KIDEM_TAVANLARI.find((p) => iso >= p.start && iso <= p.end);
  if (hit) return { amount: hit.amount, label: hit.label };
  const last = KIDEM_TAVANLARI[KIDEM_TAVANLARI.length - 1];
  const first = KIDEM_TAVANLARI[0];
  if (iso > last.end) return { amount: last.amount, label: last.label };
  return { amount: first.amount, label: first.label };
}

export function currentKidemTavan(): { amount: number; label: string } {
  return tavanForDate(new Date());
}

export function formatTry(n: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

export function calculateKidem(values: KidemFormValues): KidemResult {
  const start = parseIsoDate(values.iseGiris);
  const end = parseIsoDate(values.istenCikis);
  if (!start || !end) {
    return { ok: false, error: "İşe giriş ve işten ayrılış tarihlerini girin." };
  }
  if (end.getTime() < start.getTime()) {
    return { ok: false, error: "Ayrılış tarihi, işe giriş tarihinden önce olamaz." };
  }
  const brut = parseMoney(values.brutUcret);
  const ek = parseMoney(values.ekOdemeler);
  if (brut === null || ek === null) {
    return { ok: false, error: "Ücret alanlarına geçerli bir tutar yazın." };
  }
  if (brut + ek <= 0) {
    return { ok: false, error: "Giydirilmiş brüt ücret 0’dan büyük olmalıdır." };
  }

  const { yil, kalanGun } = serviceBreakdown(start, end);
  const giydirilmis = round2(brut + ek);
  const tavan = tavanForDate(end);
  const tavanUygulandi = giydirilmis > tavan.amount;
  const esasUcret = round2(Math.min(giydirilmis, tavan.amount));
  const hakEder = yil >= 1;
  const kesir = yil + kalanGun / 365;
  const brutTutar = hakEder ? round2(esasUcret * kesir) : 0;
  const damga = hakEder ? round2(brutTutar * DAMGA_VERGISI_ORANI) : 0;
  const net = round2(brutTutar - damga);
  const yilPart = yil > 0 ? `${yil} yıl` : "";
  const gunPart = kalanGun > 0 ? `${kalanGun} gün` : yil === 0 ? "0 gün" : "";
  const hizmetLabel = [yilPart, gunPart].filter(Boolean).join(" ");

  return {
    ok: true,
    yil,
    kalanGun,
    hizmetLabel,
    giydirilmis,
    tavan: tavan.amount,
    tavanLabel: tavan.label,
    tavanUygulandi,
    esasUcret,
    hakEder,
    brut: brutTutar,
    damga,
    net,
  };
}
