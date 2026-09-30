import { CONFIG } from "@/lib/calculators/config";
import { addYears, ageOn, durationYmd, startOfDay } from "@/lib/calculators/dates";
import { brutToNet, type KesintiDokumu } from "@/lib/calculators/kesintiler";
import { formatTry, round2 } from "@/lib/calculators/money";

export type YillikIzinInput = {
  iseGiris: Date;
  istenCikis: Date;
  dogumTarihi: Date;
  aylikBrut: number;
  kullanilanGun: number;
  yerAlti: boolean;
  kumulatifMatrah?: number;
};

export type IzinYilSatiri = {
  n: number;
  tamamlanma: Date;
  yas: number;
  hakGun: number;
};

export type YillikIzinResult =
  | { ok: false; error: string }
  | {
      ok: true;
      tamamlananYil: number;
      satirlar: IzinYilSatiri[];
      toplamHak: number;
      kullanilanGun: number;
      kullanilmayanGun: number;
      gunlukBrut: number;
      brut: number;
      kesintiler: KesintiDokumu;
      adimlar: string[];
    };

export function izinHakGun(n: number, yas: number, yerAlti: boolean): number {
  let hak = CONFIG.izinHaklari[CONFIG.izinHaklari.length - 1].gun;
  for (const kademe of CONFIG.izinHaklari) {
    if (n <= kademe.maxYil) {
      hak = kademe.gun;
      break;
    }
  }
  if (yas <= CONFIG.izinMinYas || yas >= CONFIG.izinMaxYas) {
    hak = Math.max(hak, CONFIG.izinYasTabanGun);
  }
  if (yerAlti) hak += CONFIG.yerAltiEkGun;
  return hak;
}

export function calculateYillikIzin(input: YillikIzinInput): YillikIzinResult {
  const start = startOfDay(input.iseGiris);
  const end = startOfDay(input.istenCikis);
  const birth = startOfDay(input.dogumTarihi);
  if (end.getTime() < start.getTime()) {
    return { ok: false, error: "Çıkış tarihi, işe giriş tarihinden önce olamaz." };
  }
  if (input.aylikBrut <= 0) {
    return { ok: false, error: "Aylık brüt ücret 0’dan büyük olmalıdır." };
  }
  if (input.kullanilanGun < 0) {
    return { ok: false, error: "Kullanılan izin günü negatif olamaz." };
  }

  const { yil } = durationYmd(start, end);
  const satirlar: IzinYilSatiri[] = [];
  for (let n = 1; n <= yil; n += 1) {
    const tamamlanma = addYears(start, n);
    if (tamamlanma.getTime() > end.getTime()) break;
    const yas = ageOn(birth, tamamlanma);
    satirlar.push({
      n,
      tamamlanma,
      yas,
      hakGun: izinHakGun(n, yas, input.yerAlti),
    });
  }

  const toplamHak = satirlar.reduce((s, r) => s + r.hakGun, 0);
  const kullanilmayanGun = Math.max(0, toplamHak - input.kullanilanGun);
  const gunlukBrut = input.aylikBrut / CONFIG.aylikGunSayisi;
  const brut = round2(kullanilmayanGun * gunlukBrut);
  const kesintiler = brutToNet(brut, {
    sgkKesilsin: true,
    kumulatifMatrah: input.kumulatifMatrah ?? 0,
  });

  const adimlar = [
    `Tamamlanan hizmet yılı: ${yil} (kıst yıl için izin hakkı yok)`,
    ...satirlar.map(
      (s) =>
        `${s.n}. yıl (${s.tamamlanma.toLocaleDateString("tr-TR")}): yaş ${s.yas} → ${s.hakGun} gün`
    ),
    `Toplam hak: ${toplamHak} gün`,
    `Kullanılan: ${input.kullanilanGun} gün`,
    `Kullanılmayan: max(0, ${toplamHak} − ${input.kullanilanGun}) = ${kullanilmayanGun} gün`,
    `Günlük brüt: ${formatTry(input.aylikBrut)} / ${CONFIG.aylikGunSayisi} = ${formatTry(gunlukBrut)}`,
    `İzin ücreti (brüt): ${kullanilmayanGun} × ${formatTry(gunlukBrut)} = ${formatTry(brut)}`,
    `SGK: ${formatTry(kesintiler.sgk)}`,
    `Gelir vergisi: ${formatTry(kesintiler.gelirVergisi)}`,
    `Damga vergisi: ${formatTry(kesintiler.damga)}`,
    `Net: ${formatTry(kesintiler.net)}`,
  ];

  return {
    ok: true,
    tamamlananYil: yil,
    satirlar,
    toplamHak,
    kullanilanGun: input.kullanilanGun,
    kullanilmayanGun,
    gunlukBrut,
    brut,
    kesintiler,
    adimlar,
  };
}
