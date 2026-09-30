import { CONFIG } from "@/lib/calculators/config";
import { hoursBetween, inclusiveDays, startOfDay } from "@/lib/calculators/dates";
import { brutToNet, type KesintiDokumu } from "@/lib/calculators/kesintiler";
import { formatTry, round2 } from "@/lib/calculators/money";

export const HAFTA_GUNLERI = [
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi",
  "Pazar",
] as const;

export type HaftaGunu = {
  calisir: boolean;
  baslangic: string;
  bitis: string;
};

export type FazlaMesaiInput = {
  donemBaslangic: Date;
  donemBitis: Date;
  hafta: HaftaGunu[];
  aylikBrut: number;
  calisilmayanGun: number;
  hakkaniyetUygula: boolean;
  hakkaniyetOrani: number;
  kumulatifMatrah?: number;
};

export type HaftalikOzet = {
  brutSaat: number;
  araDinlenmeSaat: number;
  netSaat: number;
  fazlaMesaiSaat: number;
};

export type FazlaMesaiResult =
  | { ok: false; error: string }
  | {
      ok: true;
      haftalik: HaftalikOzet;
      donemGun: number;
      calisanHafta: number;
      toplamFmSaat: number;
      saatlikBrut: number;
      brutIndirimsiz: number;
      brut: number;
      yillikSinirAsildi: boolean;
      kesintiler: KesintiDokumu;
      adimlar: string[];
    };

export function araDinlenmeSaat(brutSaat: number): number {
  if (brutSaat <= 0) return 0;
  for (const kademe of CONFIG.araDinlenme) {
    if (brutSaat <= kademe.maxSaat || !Number.isFinite(kademe.maxSaat)) {
      return kademe.dakika / 60;
    }
  }
  return CONFIG.araDinlenme[CONFIG.araDinlenme.length - 1].dakika / 60;
}

export function summarizeWeek(hafta: HaftaGunu[]): HaftalikOzet | { error: string } {
  if (hafta.length !== 7) return { error: "Haftanın 7 günü girilmelidir." };
  let brutSaat = 0;
  let araDinlenme = 0;
  let netSaat = 0;
  for (const gun of hafta) {
    if (!gun.calisir) continue;
    const brut = hoursBetween(gun.baslangic, gun.bitis);
    if (brut === null) return { error: "Saat alanlarını SS:DD formatında girin." };
    const ara = araDinlenmeSaat(brut);
    const net = Math.max(0, brut - ara);
    brutSaat += brut;
    araDinlenme += ara;
    netSaat += net;
  }
  const fazlaMesaiSaat = Math.max(0, netSaat - CONFIG.haftalikNormalSaat);
  return {
    brutSaat: round2(brutSaat),
    araDinlenmeSaat: round2(araDinlenme),
    netSaat: round2(netSaat),
    fazlaMesaiSaat: round2(fazlaMesaiSaat),
  };
}

export function calculateFazlaMesai(input: FazlaMesaiInput): FazlaMesaiResult {
  const start = startOfDay(input.donemBaslangic);
  const end = startOfDay(input.donemBitis);
  if (end.getTime() < start.getTime()) {
    return { ok: false, error: "Dönem bitişi, başlangıçtan önce olamaz." };
  }
  if (input.aylikBrut <= 0) {
    return { ok: false, error: "Aylık brüt ücret 0’dan büyük olmalıdır." };
  }
  if (input.calisilmayanGun < 0) {
    return { ok: false, error: "Çalışılmayan gün sayısı negatif olamaz." };
  }
  const week = summarizeWeek(input.hafta);
  if ("error" in week) return { ok: false, error: week.error };

  const donemGun = inclusiveDays(start, end);
  const calisanHafta = Math.max(0, (donemGun - input.calisilmayanGun) / 7);
  const toplamFmSaat = round2(week.fazlaMesaiSaat * calisanHafta);
  const saatlikBrut = input.aylikBrut / CONFIG.aylikFazlaMesaiBoleni;
  const brutIndirimsiz = round2(toplamFmSaat * saatlikBrut * CONFIG.fazlaMesaiCarpani);
  const oran = input.hakkaniyetUygula ? Math.min(1, Math.max(0, input.hakkaniyetOrani)) : 0;
  const brut = round2(brutIndirimsiz * (1 - oran));
  const kesintiler = brutToNet(brut, {
    sgkKesilsin: true,
    kumulatifMatrah: input.kumulatifMatrah ?? 0,
  });
  const yillikSinirAsildi = toplamFmSaat > CONFIG.yillikFazlaMesaiSiniri;

  const adimlar = [
    `Haftalık brüt süre: ${week.brutSaat} saat`,
    `Ara dinlenme: ${week.araDinlenmeSaat} saat`,
    `Haftalık net çalışma: ${week.netSaat} saat`,
    `Haftalık fazla mesai: max(0, ${week.netSaat} − ${CONFIG.haftalikNormalSaat}) = ${week.fazlaMesaiSaat} saat`,
    `Dönem: ${donemGun} gün − ${input.calisilmayanGun} çalışılmayan gün; hafta sayısı = ${round2(calisanHafta)}`,
    `Toplam FM saati: ${week.fazlaMesaiSaat} × ${round2(calisanHafta)} = ${toplamFmSaat}`,
    `Saatlik brüt: ${formatTry(input.aylikBrut)} / ${CONFIG.aylikFazlaMesaiBoleni} = ${formatTry(saatlikBrut)}`,
    `FM ücreti (brüt): ${toplamFmSaat} × ${formatTry(saatlikBrut)} × ${CONFIG.fazlaMesaiCarpani} = ${formatTry(brutIndirimsiz)}`,
    input.hakkaniyetUygula
      ? `Hakkaniyet indirimi %${round2(oran * 100)}: ${formatTry(brutIndirimsiz)} × ${1 - oran} = ${formatTry(brut)}`
      : "Hakkaniyet indirimi uygulanmadı",
    `SGK (%${round2((CONFIG.sgkIsciOrani + CONFIG.issizlikIsciOrani) * 100)}): ${formatTry(kesintiler.sgk)}`,
    `Gelir vergisi: ${formatTry(kesintiler.gelirVergisi)}`,
    `Damga vergisi: ${formatTry(kesintiler.damga)}`,
    `Net: ${formatTry(kesintiler.net)}`,
  ];

  return {
    ok: true,
    haftalik: week,
    donemGun,
    calisanHafta,
    toplamFmSaat,
    saatlikBrut,
    brutIndirimsiz,
    brut,
    yillikSinirAsildi,
    kesintiler,
    adimlar,
  };
}
