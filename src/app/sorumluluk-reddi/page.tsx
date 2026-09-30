import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout } from "@/components/legal-layout";
import { siteConfig } from "@/lib/site";

const path = "/sorumluluk-reddi";
const title = `Sorumluluk Reddi | ${siteConfig.name}`;
const description =
  "iscininhaklari.com üzerindeki yazılar, hesaplama araçları ve dilekçe örnekleri genel bilgilendirme niteliğindedir; hukuki danışmanlık yerine geçmez.";
const url = `${siteConfig.url.replace(/\/$/, "")}${path}`;

const kvkkEmail = siteConfig.contactEmail;
const siteHost = siteConfig.url.replace(/^https?:\/\//, "").replace(/\/$/, "");

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  openGraph: { title, description, url },
  twitter: { card: "summary_large_image", title, description },
  alternates: { canonical: url },
};

export default function DisclaimerPage() {
  return (
    <LegalLayout title="Sorumluluk Reddi" lastUpdated="28 Eylül 2026">
      <p>
        {`${siteConfig.name} (${siteHost}), iş hukuku ve işçi hakları konularında genel nitelikli bilgi paylaşmak amacıyla kurulmuş bir hukuki bilgilendirme platformudur.`} Bu sayfa, sitede yer alan
        tüm içerik, araç ve hizmetlerin kullanımına ilişkin sorumluluk sınırlarını açıklar. Siteyi
        ziyaret etmek, içerikleri okumak veya araçları kullanmak, aşağıdaki koşulların kabul edildiği
        anlamına gelir.
      </p>

      <h2>1. Bilgilendirme niteliği</h2>
      <p>
        Sitede yayımlanan makaleler, rehberler, sıkça sorulan sorular, örnek metinler ve benzeri
        tüm içerikler yalnızca genel bilgilendirme amacını taşır. Bu içerikler, somut bir olaya
        özgü hukuki değerlendirme, mütalaa, savunma veya avukatlık hizmeti niteliği taşımaz;
        1136 sayılı Avukatlık Kanunu anlamında vekâlet ilişkisinin kurulmasına yol açmaz.
      </p>
      <p>
        İş hukuku uyuşmazlıkları; iş sözleşmesinin türü, tarafların sıfatı, çalışma süresi, ücret
        yapısı, fesih nedeni, toplu iş sözleşmesi hükümleri ve yargı kararları gibi pek çok unsura
        göre değişir. Sitede yer alan açıklamalar, her somut olayı kapsamayabilir ve sizin
        durumunuz bakımından farklı sonuçlar doğurabilir.
      </p>

      <h2>2. Avukat–müvekkil ilişkisi kurulmaz</h2>
      <p>
        Siteyi kullanmanız, iletişim formunu doldurmanız veya e-posta göndermeniz tek başına
        avukat–müvekkil ilişkisi, danışmanlık sözleşmesi veya gizlilik yükümlülüğü doğurmaz. Somut
        hukuki yardım talep etmeniz halinde, yetkili bir avukatla ayrı bir vekâlet veya danışmanlık
        ilişkisi kurulması gerekir.
      </p>
      <p>
        İletişim kanallarımız üzerinden iletilen bilgiler, yasal süreç başlatmak, süreleri durdurmak
        veya resmi bir başvuruyu kayıt altına almak için yeterli değildir. Hak düşürücü süreler ve
        zamanaşımı bakımından somut olayınızın bir hukukçu tarafından değerlendirilmesi önerilir.
      </p>

      <h2>3. Hesaplama araçları</h2>
      <p>
        Kıdem tazminatı, ihbar tazminatı, fazla mesai ücreti, yıllık izin ücreti ve benzeri
        hesaplama araçları; sizin girdiğiniz verilere ve sitede belirtilen yasal esaslara göre
        yaklaşık bir sonuç üretir. Bu sonuçlar bağlayıcı değildir; resmi bir hesap cetveli, bilirkişi
        raporu veya mahkeme kararı yerine geçmez.
      </p>
      <p>
        Giydirilmiş ücret unsurları, kıdem tavanı, vergi ve sigorta kesintileri, ara dinlenme,
        fazla mesai sınırları ve benzeri parametreler dosyanın özelliğine göre değişebilir. Eksik,
        hatalı veya varsayıma dayalı girişler yanıltıcı sonuç verebilir. Hesaplama çıktısını resmi
        bir talep, arabuluculuk veya dava dilekçesinde kullanmadan önce uzman değerlendirmesi
        almanız gerekir.
      </p>

      <h2>4. Dilekçe ve belge örnekleri</h2>
      <p>
        İstifa dilekçesi oluşturucu ve sitede sunulan diğer taslak metinler, kullanıcının girdiği
        bilgilere göre üretilen örnek belgelerdir. Bu belgeler, somut olaya uygunluk, süre,
        yetkili merci, tebligat şekli ve eklenmesi gereken deliller bakımından denetlenmemiştir.
      </p>
      <p>
        Oluşturulan metnin kullanılması, gönderilmesi veya imzalanması tamamen kullanıcının
        sorumluluğundadır. Yanlış, eksik veya zamansız bir başvuru hak kaybına yol açabilir.
      </p>

      <h2>5. Mevzuat ve içeriğin güncelliği</h2>
      <p>
        İş mevzuatı, asgari ücret, kıdem tazminatı tavanı, vergi tarifeleri ve yargı içtihatları
        zaman içinde değişebilir. Sitedeki bilgiler, yayım veya son güncelleme tarihinde mevcut
        olan genel çerçeveyi yansıtmaya çalışır; ancak her maddenin anlık olarak güncel olduğu
        garanti edilmez.
      </p>
      <p>
        Bir yazının tarihinin geçmiş olması, içeriğin tamamen geçersiz olduğu anlamına gelmez;
        yine de karar vermeden önce ilgili kanunun, yönetmeliğin ve güncel uygulamanın kontrol
        edilmesi kullanıcıya aittir.
      </p>

      <h2>6. Doğruluk ve eksiksizlik taahhüdü yoktur</h2>
      <p>
        İçerikler özenle hazırlanır; buna rağmen yazım hatası, teknik aksaklık, eksik aktarım veya
        yorum farkı olabilir. {`${siteConfig.name}, sitedeki bilgilerin doğru, tam, kesintisiz veya belirli bir amaca uygun olduğunu taahhüt etmez.`} Site “olduğu gibi” sunulmaktadır.
      </p>

      <h2>7. Sorumluluğun sınırlandırılması</h2>
      <p>
        Sitedeki herhangi bir içeriğin, hesaplama sonucunun, dilekçe örneğinin veya bağlantının
        kullanılması nedeniyle doğabilecek doğrudan veya dolaylı zarar, kâr kaybı, veri kaybı, hak
        kaybı, süre kaçırma veya benzeri sonuçlardan {siteConfig.name} ve içerik hazırlayanlar
        sorumlu tutulamaz. Bu sınırlama, yürürlükteki mevzuatın izin verdiği ölçüde geçerlidir.
      </p>
      <p>
        Kullanıcı, kendi durumuna uygun hukuki, mali ve idari adımları kendisi değerlendirmek ve
        gerektiğinde bağımsız uzman desteği almakla yükümlüdür.
      </p>

      <h2>8. Üçüncü taraf bağlantıları</h2>
      <p>
        Sitede mevzuat, yargı kararları, kamu kurumları veya sosyal medya hesaplarına yönlendiren
        dış bağlantılar bulunabilir. Bu sitelerin içeriği, gizlilik uygulamaları ve erişilebilirliği
        bu platformun kontrolünde değildir. Dış bağlantıların varlığı, bağlı sitenin onaylandığı
        veya tavsiye edildiği anlamına gelmez.
      </p>

      <h2>9. Fikri haklar</h2>
      <p>
        Aksi belirtilmedikçe sitedeki metin, görsel, düzen ve yazılım unsurları {siteConfig.name}{" "}
        platformuna aittir. İçeriklerin kaynak gösterilmeksizin kopyalanması, ticari olarak
        çoğaltılması veya yanıltıcı biçimde sunulması yasaktır. Kişisel ve gayri ticari kullanım,
        metnin bütünlüğünün bozulmaması kaydıyla mümkündür.
      </p>

      <h2>10. Kişisel veriler</h2>
      <p>
        İletişim formu ve benzeri kanallar üzerinden paylaşılan kişisel verilere ilişkin açıklama,{" "}
        <Link href="/aydinlatma-beyani-ve-acik-riza-onayi">
          Aydınlatma Beyanı ve Açık Rıza Onayı
        </Link>{" "}
        sayfasında yer alır. KVKK kapsamındaki başvurular için{" "}
        <Link href="/kvkk-basvuru-formu">KVKK Başvuru Formu</Link> kullanılabilir.
      </p>

      <h2>11. Uygulanacak hukuk</h2>
      <p>
        Bu metinden ve sitenin kullanılmasından doğan uyuşmazlıklarda Türkiye Cumhuriyeti hukuku
        uygulanır. Yetkili merciler, yürürlükteki mevzuata göre belirlenir.
      </p>

      <h2>12. İletişim</h2>
      <p>
        Metne, site işleyişine veya içerik düzeltmelerine ilişkin notlarınızı{" "}
        <Link href="/iletisim">iletişim</Link> sayfasından veya{" "}
        <a href={`mailto:${kvkkEmail}`}>{kvkkEmail}</a> adresinden
        iletebilirsiniz. Bu kanallar, bireysel hukuki danışmanlık veya acil hukuki müdahale hizmeti
        sunmaz.
      </p>
    </LegalLayout>
  );
}
