export type GelirVergisiDilimi = { limit: number; oran: number };

export const CONFIG = {
  sgkIsciOrani: 0.14,
  issizlikIsciOrani: 0.01,
  damgaVergisiOrani: 0.00759,
  gelirVergisiDilimleri: [{ limit: Number.POSITIVE_INFINITY, oran: 0 }] as GelirVergisiDilimi[],
  aylikGunSayisi: 30,
  aylikFazlaMesaiBoleni: 225,
  haftalikNormalSaat: 45,
  fazlaMesaiCarpani: 1.5,
  hakkaniyetIndirimiVarsayilan: 0.3,
  yillikFazlaMesaiSiniri: 270,
  ihbarSureleri: [
    { maxHizmetAy: 6, gun: 14 },
    { maxHizmetAy: 18, gun: 28 },
    { maxHizmetAy: 36, gun: 42 },
    { maxHizmetAy: Number.POSITIVE_INFINITY, gun: 56 },
  ],
  araDinlenme: [
    { maxSaat: 4, dakika: 15 },
    { maxSaat: 7.5, dakika: 30 },
    { maxSaat: Number.POSITIVE_INFINITY, dakika: 60 },
  ],
  izinHaklari: [
    { maxYil: 5, gun: 14 },
    { maxYil: 14, gun: 20 },
    { maxYil: Number.POSITIVE_INFINITY, gun: 26 },
  ],
  izinMinYas: 18,
  izinMaxYas: 50,
  izinYasTabanGun: 20,
  yerAltiEkGun: 4,
};

export const CALCULATOR_PATHS = {
  ihbar: "/hesaplama/ihbar-tazminati",
  fazlaMesai: "/hesaplama/fazla-mesai-ucreti",
  yillikIzin: "/hesaplama/yillik-izin-ucreti",
} as const;

export const DISCLAIMER =
  "Bu hesaplama bilgilendirme amaçlıdır; kesin tutar bilirkişi hesabı ve dosya kapsamına göre değişir.";
