import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal-layout";
import { siteConfig } from "@/lib/site";

const path = "/aydinlatma-beyani-ve-acik-riza-onayi";
const title = `Aydınlatma Beyanı ve Açık Rıza Onayı | ${siteConfig.name}`;
const description =
  "6698 sayılı KVKK kapsamında aydınlatma ve açık rıza metni. Veri sorumlusu Avukat Tuğrul Büyükorhan.";
const url = `${siteConfig.url.replace(/\/$/, "")}${path}`;

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  openGraph: { title, description, url },
  twitter: { card: "summary_large_image", title, description },
  alternates: { canonical: url },
};

export default function AydinlatmaBeyaniPage() {
  return (
    <LegalLayout title="Aydınlatma Beyanı ve Açık Rıza Onayı" lastUpdated="28 Eylül 2026">
      <p>
        6698 Sayılı Kişisel Verilerin Korunması Kanunu (KVKK) Kapsamında Aydınlatma ve Açık Rıza
        Metni
      </p>
      <p>
        Avukat Tuğrul Büyükorhan, veri sorumlusu olarak danışanlarının, müvekkillerinin, web
        sitesini ziyaret eden ziyaretçilerin kişisel verilerini gerektiğinde çeşitli formlar,
        e-mail, telefon veya diğer elverişli yöntemlerle toplamakta, işlemekte, güncellemekte,
        saklamakta, sınıflandırmaktadır. Ancak Avukat Tuğrul Büyükorhan, 6698 sayılı kanun gereği
        gerekli teknik ve idari tedbirleri alarak bu verilerinizi korumaktadır.
      </p>
      <p>
        Kişisel veri; kimliği belirli veya belirlenebilir gerçek kişiye ilişkin her türlü bilgiyi
        ifade eder.
      </p>
      <p>
        Kişisel verilerin işlenmesi; kişisel verilerin elde edilmesi, kaydedilmesi, depolanması,
        muhafaza edilmesi, değiştirilmesi, yeniden düzenlenmesi, açıklanması, aktarılması,
        devredilmesi, elde edilebilir hale getirilmesi, sınıflandırılması, kullanılmasının
        engellenmesi dahil olmak üzere toplandıktan sonra silme, yok etme ya da anonim hale getirme
        aşamalarını içeren her türlü faaliyettir.
      </p>

      <h2>Kişisel Verilerin Toplanması ve İşlenmesi</h2>
      <p>
        Avukat Tuğrul Büyükorhan, internet üzerinden web sitesinde (buyukorhan.av.tr) ve hukuk
        bürosunda işlenme ihtimali bulunan verileriniz ile ilgili olarak veri sorumlusudur.
      </p>
      <p>
        Aşağıda yer alan verileriniz ofiste fiziksel olarak hazırlanan formlar veya internet sitesi
        üzerinden elektronik bir şekilde beyan, bilgi ve onayınız doğrultusunda toplanabilecektir:
      </p>
      <p>
        İletişim bölümündeki bilgi formunu kullanarak web sitemiz üzerinde bize ulaşmanız halinde
        belirttiğiniz ad ve soyad, e-mail ve telefon numaranız ve form içeriğinde verdiğiniz kişisel
        bilgiler tarafımızdan toplanarak işlenebilecektir.
      </p>
      <p>
        Hukuki zorunluluk nedeniyle; internet sitesine gerçekleştirdiğiniz ziyarete ilişkin;
        bağlantı/çıkış tarih ve saat bilgisi, internet protokolü, kaynak ve hedef nokta bilgileri
        ile konum bilgisi, internet sitesini daha etkili, kolay ve hızlı kullanmanızı sağlama, site
        hizmet ve faaliyetlerini ihtiyaçlarınız doğrultusunda özelleştirme, üçüncü kişi web
        sitelerin size daha uygun hizmet ve teklif sunabilmesini sağlama amaçlı kullanılan
        çerezlerin topladığı veriler toplanabilmekte veya işlenebilmektedir.
      </p>

      <h2>Kişisel Verilerinizin İşlenme Amaçları</h2>
      <p>
        Kişisel verileriniz; avukatlık hizmet ve faaliyetlerinden yararlanabilmeniz için gerekli
        çalışmaların yapılabilmesi, Avukat Tuğrul Büyükorhan tarafından sunulan hizmet ve
        faaliyetlerin, beğeni, kullanım şekliniz ve ihtiyaçlarınıza göre özelleştirilerek sizlere
        önerilmesi ile talepleriniz doğrultusunda gerekli teknik destek ve kalitenin sağlanması.
      </p>
      <p>
        Sosyal ağlar ile sitenin ilişkilendirilmesini sağlayarak, hızlı ve engelsiz paylaşım
        yapılabilmesi.
      </p>
      <p>
        Hizmet ve faaliyetlerimize ilişkin her türlü soru ve şikayetinize cevap verilebilmesi, Veri
        güvenliği kapsamında tüm gerekli teknik ve idari tedbirleri alınması.
      </p>
      <p>
        Düzenleyici ve denetleyici kurumlarla, resmi mercilerin talep ve denetimleri doğrultusunda
        gerekli bilgilerin temini ve idari operasyonların yürütülmesi.
      </p>

      <h2>Kişisel Verilerinizin Aktarılması</h2>
      <p>
        Avukat Tuğrul Büyükorhan yürüttüğü faaliyetlerle ilgili Aydınlatma Metninde belirtilen
        kişisel veri işleme amaçlarının gerçekleştirilmesi ve aşağıda belirtilen amaçlarla kişisel
        verilerinizi onayınız doğrultusunda paylaşılabilmekte veya aktarılabilmektedir. Kişisel
        verileriniz, tarafınızca yetki verilmiş olan vekil ve temsilcilerinize, düzenleyici ve
        denetleyici kurumlar ile mahkeme ve icra müdürlükleri gibi sair resmî kurumlara, kişisel
        verilerinizi talep etmeye yetkili olan diğer kamu kurum veya kuruluşlarına, KVKK nın 8. ve
        9. maddelerinde belirtilen kişisel veri işleme şartları ve amaçları çerçevesinde
        aktarılabilecektir.
      </p>

      <h2>Kişisel Verilerin Korunmasına Yönelik Haklarınız</h2>
      <p>Avukat Tuğrul Büyükorhan’a başvurarak kendinizle ilgili;</p>
      <p>a) Kişisel veri işlenip işlenmediğini öğrenme,</p>
      <p>b) Kişisel verileri işlenmişse buna ilişkin bilgi talep etme,</p>
      <p>
        c) Kişisel verilerin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını
        öğrenme,
      </p>
      <p>ç) Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme,</p>
      <p>
        d) Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini
        isteme,
      </p>
      <p>e) Kişisel verilerin silinmesini veya yok edilmesini isteme,</p>
      <p>
        f) (d) ve (e) bentleri uyarınca yapılan işlemlerin, kişisel verilerin aktarıldığı üçüncü
        kişilere bildirilmesini isteme,
      </p>
      <p>
        g) İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle
        kişinin kendisi aleyhine bir sonucun ortaya çıkmasına itiraz etme,
      </p>
      <p>
        ğ) Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğraması hâlinde
        zararın giderilmesini talep edebilirsiniz.
      </p>
      <p>
        Taleplerinizi mektup, telefon veya e-mail yoluyla, şahsen başvurarak veya noter
        aracılığıyla iletebilirsiniz. Başvuru formunu{" "}
        <a href="/kvkk-basvuru-formu">KVKK Başvuru Formu</a> sayfasından indirebilirsiniz.
      </p>
      <p>
        Tarafımıza iletilmesinden itibaren en geç 30 gün içinde talepleriniz ücretsiz bir şekilde
        sonuçlandırılacaktır.
      </p>

      <h2>Açık Rıza veya Onay Metni</h2>
      <p>
        6698 sayılı Kişisel Verilerin Korunması Kanunu çerçevesinde kişisel/özel nitelikli kişisel
        verilerimin; fiziksel olarak ofis adresinde veya web sitesi (buyukorhan.av.tr) üzerinden
        tamamen veya kısmen elde edilmesi, kaydedilmesi, depolanması, değiştirilmesi,
        güncellenmesi, sınıflandırılması, işlendikleri amaç için gerekli olan ya da ilgili kanunda
        öngörülen süre kadar muhafaza edilmesi, kanuni nedenlerle veya yapılan işin niteliği gereği
        üçüncü kişiler ile paylaşılması, yurtdışına aktarılması da dahil olmak üzere yukarıda
        açıklandığı üzere işlenmesine, konu hakkında tereddüde yer vermeyecek şekilde bilgi sahibi
        ve aydınlatılmış olarak açık rızam ile onay veriyorum.
      </p>

      <h2>Veri Sorumlusunun Kimliği</h2>
      <p>Ad, Soyad ve Unvan: Avukat Tuğrul Büyükorhan</p>
      <p>
        Web Adresi:{" "}
        <a href="https://iscininhaklari.com">iscininhaklari.com</a>
      </p>
      <p>
        E-mail:{" "}
        <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
      </p>
      <p>Telefon Numarası: +90 538 893 30 96</p>
      <p>
        Adres: Mustafa Kemal Mah. Dumlupınar Blv. No:274/2 Mahall Ankara C2 Blok No:47
        Çankaya-Ankara
      </p>
    </LegalLayout>
  );
}
