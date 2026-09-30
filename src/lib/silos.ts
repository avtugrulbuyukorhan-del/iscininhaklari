import { CALCULATOR_PATHS } from "@/lib/calculators/config";

export const TOOLS_HUB_PATH = "/hesaplama-araclari";
export const PETITIONS_HUB_PATH = "/dilekce-yaz";

export type SiloItem = {
  slug: string;
  title: string;
  text: string;
  href: string;
  available: boolean;
};

export const toolsHub = {
  path: TOOLS_HUB_PATH,
  eyebrow: "Hesaplama Araçları",
  title: "İşçilik alacaklarınızı hesaplayın",
  intro:
    "Çalışma bilgilerinizi girerek kıdem, ihbar, fazla mesai ve izin gibi işçilik alacaklarınıza ilişkin yaklaşık hesaplamalar yapabilirsiniz.",
  items: [
    {
      slug: "kidem-tazminati-hesaplama",
      title: "Kıdem Tazminatı Hesaplama",
      text: "İşe giriş, ayrılış ve giydirilmiş brüt ücretinizle kıdem tazminatını hesaplayın.",
      href: `${TOOLS_HUB_PATH}/kidem-tazminati-hesaplama`,
      available: true,
    },
    {
      slug: "ihbar-tazminati-hesaplama",
      title: "İhbar Tazminatı Hesaplama",
      text: "Bildirim süresine göre ihbar tazminatı tutarını hesaplayın.",
      href: CALCULATOR_PATHS.ihbar,
      available: true,
    },
    {
      slug: "fazla-mesai-hesaplama",
      title: "Fazla Mesai Hesaplama",
      text: "Çalışma sürenize göre fazla mesai alacağınızı hesaplayın.",
      href: CALCULATOR_PATHS.fazlaMesai,
      available: true,
    },
    {
      slug: "yillik-izin-ucreti-hesaplama",
      title: "Yıllık İzin Ücreti Hesaplama",
      text: "Kullanılmayan yıllık izinlerin ücret karşılığını hesaplayın.",
      href: CALCULATOR_PATHS.yillikIzin,
      available: true,
    },
  ],
} as const satisfies {
  path: string;
  eyebrow: string;
  title: string;
  intro: string;
  items: readonly SiloItem[];
};

export const petitionsHub = {
  path: PETITIONS_HUB_PATH,
  eyebrow: "Dilekçe Yaz",
  title: "İş hukuku dilekçesi oluşturun",
  intro:
    "Bilgilerinizi girerek iş hukukunda sık kullanılan dilekçeleri oluşturun, önizleyin ve PDF olarak indirin.",
  items: [
    {
      slug: "istifa-dilekcesi",
      title: "İstifa Dilekçesi",
      text: "Şirket, görev ve ayrılış bilgilerinizle istifa dilekçesi oluşturun.",
      href: `${PETITIONS_HUB_PATH}/istifa-dilekcesi`,
      available: true,
    },
    {
      slug: "ucret-alacagi-ihtarnamesi",
      title: "Ücret Alacağı İhtarnamesi",
      text: "Ödenmeyen ücret ve işçilik alacakları için ihtarname taslağı oluşturun.",
      href: "",
      available: false,
    },
    {
      slug: "ise-iade-basvurusu",
      title: "İşe İade Başvurusu",
      text: "Fesih sonrası işe iade başvurusuna ilişkin dilekçe taslağı oluşturun.",
      href: "",
      available: false,
    },
  ],
} as const satisfies {
  path: string;
  eyebrow: string;
  title: string;
  intro: string;
  items: readonly SiloItem[];
};
