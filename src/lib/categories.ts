export const SITE_CATEGORIES = [
  { slug: "isten-cikarilma-ve-fesih", name: "İşten Çıkarılma ve Fesih" },
  { slug: "kidem-tazminati", name: "Kıdem Tazminatı" },
  { slug: "ihbar-tazminati", name: "İhbar Tazminatı" },
  { slug: "ucret-ve-iscilik-alacaklari", name: "Ücret ve İşçilik Alacakları" },
  { slug: "calisma-sureleri-ve-izinler", name: "Çalışma Süreleri ve İzinler" },
  { slug: "ise-iade-ve-is-guvencesi", name: "İşe İade ve İş Güvencesi" },
  { slug: "isyerinde-haklar-ve-mobbing", name: "İşyerinde Haklar ve Mobbing" },
  { slug: "is-davalari-ve-arabuluculuk", name: "İş Davaları ve Arabuluculuk" },
  { slug: "is-kazasi-ve-meslek-hastaligi", name: "İş Kazası ve Meslek Hastalığı" },
  { slug: "sgk-ve-sigortalilik", name: "SGK ve Sigortalılık" },
] as const;

export type SiteCategorySlug = (typeof SITE_CATEGORIES)[number]["slug"];

export const KNOWN_CATEGORIES: Record<string, string> = Object.fromEntries(
  SITE_CATEGORIES.map((c) => [c.slug, c.name])
);

export const KNOWN_CATEGORY_SLUGS: string[] = SITE_CATEGORIES.map((c) => c.slug);
