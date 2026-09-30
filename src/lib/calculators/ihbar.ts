import { CONFIG } from "@/lib/calculators/config";
import { addMonths, addYears, durationYmd, formatDuration, startOfDay } from "@/lib/calculators/dates";
import { brutToNet, type KesintiDokumu } from "@/lib/calculators/kesintiler";
import { formatTry, round2 } from "@/lib/calculators/money";

export type IhbarInput = {
  iseGiris: Date;
  istenCikis: Date;
  aylikBrut: number;
  yanOdemeler: number[];
  kumulatifMatrah?: number;
};

export type IhbarResult =
  | { ok: false; error: string }
  | {
      ok: true;
      hizmet: { yil: number; ay: number; gun: number; label: string };
      ihbarGun: number;
      giydirilmisAylik: number;
      gunlukGiydirilmis: number;
      brut: number;
      kesintiler: KesintiDokumu;
      adimlar: string[];
    };

export function ihbarGunSayisi(iseGiris: Date, istenCikis: Date): number {
  const start = startOfDay(iseGiris);
  const end = startOfDay(istenCikis);
  for (const kademe of CONFIG.ihbarSureleri) {
    if (!Number.isFinite(kademe.maxHizmetAy)) return kademe.gun;
    if (end.getTime() < addMonths(start, kademe.maxHizmetAy).getTime()) return kademe.gun;
  }
  return CONFIG.ihbarSureleri[CONFIG.ihbarSureleri.length - 1].gun;
}

export function calculateIhbar(input: IhbarInput): IhbarResult {
  const start = startOfDay(input.iseGiris);
  const end = startOfDay(input.istenCikis);
  if (end.getTime() < start.getTime()) {
    return { ok: false, error: "Çıkış tarihi, işe giriş tarihinden önce olamaz." };
  }
  if (input.aylikBrut < 0 || input.yanOdemeler.some((n) => n < 0)) {
    return { ok: false, error: "Ücret alanlarına geçerli bir tutar yazın." };
  }
  const yanToplam = input.yanOdemeler.reduce((s, n) => s + n, 0);
  const giydirilmisAylik = round2(input.aylikBrut + yanToplam);
  if (giydirilmisAylik <= 0) {
    return { ok: false, error: "Giydirilmiş aylık brüt 0’dan büyük olmalıdır." };
  }

  const hizmet = durationYmd(start, end);
  const ihbarGun = ihbarGunSayisi(start, end);
  const gunlukGiydirilmis = round2(giydirilmisAylik / CONFIG.aylikGunSayisi);
  const brut = round2(gunlukGiydirilmis * ihbarGun);
  const kesintiler = brutToNet(brut, {
    sgkKesilsin: false,
    kumulatifMatrah: input.kumulatifMatrah ?? 0,
  });
  const label = formatDuration(hizmet);

  const adimlar = [
    `Hizmet süresi: ${label}`,
    `İhbar süresi: ${ihbarGun} gün`,
    `Giydirilmiş aylık brüt: ${formatTry(input.aylikBrut)} + ${formatTry(yanToplam)} = ${formatTry(giydirilmisAylik)}`,
    `Günlük giydirilmiş brüt: ${formatTry(giydirilmisAylik)} / ${CONFIG.aylikGunSayisi} = ${formatTry(gunlukGiydirilmis)}`,
    `İhbar tazminatı (brüt): ${formatTry(gunlukGiydirilmis)} × ${ihbarGun} = ${formatTry(brut)}`,
    `SGK: kesilmez`,
    `Gelir vergisi: ${formatTry(kesintiler.gelirVergisi)}`,
    `Damga vergisi: ${formatTry(brut)} × ${CONFIG.damgaVergisiOrani} = ${formatTry(kesintiler.damga)}`,
    `Net: ${formatTry(kesintiler.net)}`,
  ];

  return {
    ok: true,
    hizmet: { ...hizmet, label },
    ihbarGun,
    giydirilmisAylik,
    gunlukGiydirilmis,
    brut,
    kesintiler,
    adimlar,
  };
}
