import { CALCULATOR_PATHS } from "@/lib/calculators/config";
import { ARTICLES_PATH } from "@/lib/paths";

export const homeLinks = {
  about: "/hakkimizda",
  articles: ARTICLES_PATH,
  toolsHub: "/hesaplama-araclari",
  kidemCalculator: "/hesaplama-araclari/kidem-tazminati-hesaplama",
  petitionsHub: "/dilekce-yaz",
  istifa: "/dilekce-yaz/istifa-dilekcesi",
  contact: "/iletisim",
  fazlaMesaiCalculator: CALCULATOR_PATHS.fazlaMesai,
  ihbarCalculator: CALCULATOR_PATHS.ihbar,
  yillikIzinCalculator: CALCULATOR_PATHS.yillikIzin,
  workerRights: {
    kidem: "/kidem-tazminati",
    ihbar: "/ihbar-tazminati",
    fazlaMesai: "/ucret-ve-iscilik-alacaklari",
    iseIade: "/ise-iade-ve-is-guvencesi",
    mobbing: "/isyerinde-haklar-ve-mobbing",
    yillikIzin: "/calisma-sureleri-ve-izinler",
  },
} as const;

export const homeContent = {
  lawyer: {
    name: "Av. Tuğrul Büyükorhan",
    shortName: "İşçinin Hakları",
    title: "İş Hukuku",
    baro: "Ankara 2 No'lu Barosu",
    sicilNo: "3289",
    experienceYears: 6,
    casesResolved: 240,
    phoneDisplay: "0532 000 00 00",
    phoneHref: "tel:+905320000000",
    email: "bilgi@iscininhaklari.com",
    address: "Çankaya, Ankara",
    portrait: {
      src: "/images/placeholder-portrait.svg",
      alt: "Av. Tuğrul Büyükorhan",
    },
  },
  nav: [
    { href: homeLinks.about, label: "Hakkımızda" },
    { href: homeLinks.toolsHub, label: "Hesaplama Araçları" },
    { href: homeLinks.articles, label: "Makaleler" },
    { href: homeLinks.contact, label: "İletişim" },
  ],
  hero: {
    eyebrow: "İş Hukuku · İşçi Hakları Rehberi",
    headline: "İşçi haklarınızı bilin, doğru adımı zamanında atın.",
    support:
      "Kıdem tazminatı, ihbar tazminatı, fazla mesai, işe iade, yıllık izin, mobbing ve işten çıkarılma gibi iş hukukunun en çok merak edilen konularını anlaşılır ve güncel bilgilerle öğrenin.",
    primary: { label: "İşçi Haklarını İncele", href: "/#isci-haklari" },
    secondary: { label: "Hesaplama Araçları", href: homeLinks.toolsHub },
    image: {
      src: "/images/iscinin-haklari-nelerdir.webp",
      alt: "İşçinin hakları nelerdir",
    },
  },
  quickAccess: [
    {
      icon: "Calculator",
      title: "Kıdemini Hesapla",
      text: "Ne kadar kıdem tazminatı alabileceğinizi hesaplayın.",
      href: homeLinks.kidemCalculator,
    },
    {
      icon: "Bell",
      title: "İhbar Tazminatını Hesapla",
      text: "Ne kadar ihbar tazminatı alabileceğinizi hesaplayın.",
      href: homeLinks.ihbarCalculator,
    },
    {
      icon: "FileText",
      title: "Dilekçe Yaz",
      text: "İş hukukunda kullanılabilecek dilekçe örneklerini oluşturun.",
      href: homeLinks.petitionsHub,
    },
    {
      icon: "Timer",
      title: "Fazla Mesaini Hesapla",
      text: "Çalışma sürenize göre fazla mesai alacağınızı hesaplayın.",
      href: homeLinks.fazlaMesaiCalculator,
    },
  ],
  workerRights: {
    id: "isci-haklari",
    eyebrow: "İşçi Hakları",
    title: "En Çok Merak Edilen İşçi Hakları",
    intro:
      "İş hayatında en sık karşılaşılan sorunları ve işçilerin kanundan doğan haklarını ayrıntılı rehberlerle inceleyin.",
    items: [
      {
        slug: "kidem-tazminati",
        icon: "Wallet",
        title: "Kıdem Tazminatı",
        description:
          "Kimler kıdem tazminatı alabilir, hangi şartlar aranır ve hangi durumlarda hak kaybedilebilir?",
        href: homeLinks.workerRights.kidem,
      },
      {
        slug: "ihbar-tazminati",
        icon: "Bell",
        title: "İhbar Tazminatı",
        description:
          "İhbar süreleri, ihbar tazminatı hakkı ve fesih halinde uygulanacak temel kurallar.",
        href: homeLinks.workerRights.ihbar,
      },
      {
        slug: "fazla-mesai",
        icon: "Clock",
        title: "Fazla Mesai",
        description:
          "Fazla çalışma ücretinin hesaplanması, ispatı ve işçinin fazla mesai hakları.",
        href: homeLinks.workerRights.fazlaMesai,
      },
      {
        slug: "ise-iade",
        icon: "Undo2",
        title: "İşe İade",
        description: "İşe iade şartları, arabuluculuk süreci ve başvuru süreleri.",
        href: homeLinks.workerRights.iseIade,
      },
      {
        slug: "mobbing",
        icon: "ShieldAlert",
        title: "Mobbing",
        description: "İşyerinde psikolojik taciz halinde işçinin sahip olduğu hukuki haklar.",
        href: homeLinks.workerRights.mobbing,
      },
      {
        slug: "yillik-izin",
        icon: "CalendarDays",
        title: "Yıllık İzin",
        description:
          "Yıllık ücretli izin süresi, kullanılmayan izinler ve izin ücretine ilişkin haklar.",
        href: homeLinks.workerRights.yillikIzin,
      },
    ],
  },
  about: {
    eyebrow: "İşçinin Hakları Hakkında",
    cta: { label: "Hakkımızda", href: homeLinks.about },
    slides: [
      {
        title: "İş hukukunu herkesin anlayabileceği şekilde anlatıyoruz.",
        body: "İşçinin Hakları, çalışanların iş hukukundan doğan haklarına ilişkin doğru ve anlaşılır bilgiye ulaşabilmesi amacıyla hazırlanmış bir hukuk platformudur.",
        image: {
          src: "/images/is-hukuku-avukati.webp",
          alt: "İş hukuku avukatı",
          width: 1536,
          height: 2752,
        },
      },
      {
        title: "Kıdemden işe iadeye, merak edilen her konu.",
        body: "Kıdem tazminatı, ihbar, fazla mesai, yıllık izin, mobbing ve işten çıkarılma gibi başlıklarda mevzuat ve yargı kararlarını sade bir dille derliyoruz.",
        image: {
          src: "/images/slider-2.webp",
          alt: "İş hukuku rehberi",
          width: 1536,
          height: 2752,
        },
      },
      {
        title: "İçerikler hukuki bakışla hazırlanır.",
        body: "Yazılar Av. Tuğrul Büyükorhan tarafından hazırlanır ve gözden geçirilir. Amaç, çalışanın kendi durumunu daha net görebilmesidir.",
        image: {
          src: "/images/slider-3.webp",
          alt: "İş hukuku içerik hazırlığı",
          width: 1536,
          height: 2752,
        },
      },
    ],
  },
  blog: {
    eyebrow: "Güncel Rehberler",
    title: "İşçi Hakları Rehberleri",
    intro:
      "İş hayatında en çok karşılaşılan sorunlara mevzuat, yargı kararları ve uygulamadan örneklerle cevaplar.",
    allHref: homeLinks.articles,
    allLabel: "Tüm Makaleleri Gör",
    fallbackImage: "/images/placeholder-blog.svg",
  },
  dismissal: {
    id: "isten-cikarilma",
    eyebrow: "İşten Çıkarılma",
    title: "İşten Çıkarıldığınızda Ne Yapmalısınız?",
    steps: [
      {
        n: "01",
        title: "Fesih nedenini öğrenin",
        text: "İşveren tarafından bildirilen fesih sebebini ve size verilen belgeleri kontrol edin.",
      },
      {
        n: "02",
        title: "Haklarınızı belirleyin",
        text: "Kıdem, ihbar, yıllık izin, fazla mesai ve diğer işçilik alacaklarınızı değerlendirin.",
      },
      {
        n: "03",
        title: "Süreleri kaçırmayın",
        text: "İşe iade ve diğer hukuki başvurular bakımından tabi olduğunuz süreleri kontrol edin.",
      },
      {
        n: "04",
        title: "Hukuki yolları değerlendirin",
        text: "Uyuşmazlığın niteliğine göre arabuluculuk ve dava yollarının gündeme gelebileceğini unutmayın.",
      },
    ],
  },
  tools: {
    id: "hesaplama-araclari",
    eyebrow: "Pratik Araçlar",
    title: "İşçilik Alacaklarınızı Hesaplayın",
    intro: "Çalışma bilgilerinizi girerek işçilik alacaklarınıza ilişkin yaklaşık hesaplamalar yapabilirsiniz.",
    allHref: homeLinks.toolsHub,
    allLabel: "Tüm Hesaplama Araçları",
    items: [
      {
        title: "Kıdem Tazminatı Hesaplama",
        href: homeLinks.kidemCalculator,
      },
      {
        title: "İhbar Tazminatı Hesaplama",
        href: homeLinks.ihbarCalculator,
      },
      {
        title: "Fazla Mesai Hesaplama",
        href: homeLinks.fazlaMesaiCalculator,
      },
      {
        title: "Yıllık İzin Ücreti Hesaplama",
        href: homeLinks.yillikIzinCalculator,
      },
    ],
  },
  faq: {
    eyebrow: "Sık Sorulan Sorular",
    title: "İşçi Hakları Hakkında Merak Edilenler",
    items: [
      {
        q: "İstifa eden işçi kıdem tazminatı alabilir mi?",
        a: "Kural olarak işçinin haklı bir neden bulunmaksızın kendi isteğiyle ayrılması kıdem tazminatı hakkı doğurmaz. Ancak ücretin ödenmemesi, mobbing veya kanunda sayılan diğer haklı fesih halleri ile evlilik, askerlik ve emeklilik gibi özel durumlar sonucu değiştirebilir. Somut olayın ayrıca değerlendirilmesi gerekir.",
      },
      {
        q: "Kıdem tazminatı almak için kaç yıl çalışmak gerekir?",
        a: "Kıdem tazminatına hak kazanılabilmesi için kural olarak aynı işverene bağlı çalışma süresinin en az bir yıl olması gerekir. Bir yılın nasıl hesaplandığı, kesintili çalışmalar ve işyeri devri gibi durumlar dosyanın özelliğine göre değişebilir.",
      },
      {
        q: "İşe iade başvuru süresi ne kadardır?",
        a: "İş güvencesi kapsamındaki işçiler bakımından fesih bildiriminin tebliğinden itibaren bir aylık süre içinde arabuluculuğa başvurulması gerekir. Bu süre hak düşürücü niteliktedir; kaçırılması işe iade yolunu kapatabilir. Kapsam ve süre hesabı somut olaya göre kontrol edilmelidir.",
      },
      {
        q: "Fazla mesai nasıl ispatlanır?",
        a: "Fazla çalışma; puantaj, giriş-çıkış kayıtları, yazışmalar ve tanık beyanı gibi delillerle ortaya konulabilir. İspat yükü somut uyuşmazlığa göre değişir. Bordroda yer alan ibrazlar tek başına her zaman sonucu belirlemez.",
      },
      {
        q: "İşveren yıllık izin kullandırmazsa ne olur?",
        a: "Yıllık ücretli izin, işçinin dinlenme hakkıdır ve kural olarak işveren tarafından kullandırılmalıdır. Kullanılmayan izinlerin ücrete dönüşmesi, iş sözleşmesinin sona erme şekline ve somut çalışma dönemine göre değerlendirilir. Süre ve hesap bakımından belgeler önemlidir.",
      },
    ],
  },
  ctaBand: {
    title: "Aradığınız işçi hakkını öğrenin.",
    text: "Kıdem tazminatından işe iadeye kadar iş hukukuna ilişkin rehberleri inceleyerek haklarınız hakkında bilgi edinin.",
    primary: { label: "Makaleleri İncele", href: homeLinks.articles },
    secondary: { label: "Hesaplama Araçları", href: homeLinks.toolsHub },
  },
  footer: {
    blurb: "İşçi hakları üzerine sade rehber yazıları ve iş hukuku odaklı bir bilgi platformu.",
    quickLinks: [
      { href: homeLinks.about, label: "Hakkımızda" },
      { href: homeLinks.toolsHub, label: "Hesaplama Araçları" },
      { href: homeLinks.petitionsHub, label: "Dilekçe Yaz" },
      { href: homeLinks.articles, label: "Makaleler" },
    ],
    legalLinks: [
      { href: "/aydinlatma-beyani-ve-acik-riza-onayi", label: "Aydınlatma beyanı" },
      { href: "/kvkk-basvuru-formu", label: "KVKK başvuru formu" },
      { href: "/sorumluluk-reddi", label: "Sorumluluk reddi" },
    ],
  },
} as const;

export type QuickAccessIconName = (typeof homeContent.quickAccess)[number]["icon"];
export type WorkerRightIconName = (typeof homeContent.workerRights.items)[number]["icon"];
