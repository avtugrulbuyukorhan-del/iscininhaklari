delete from public.categories
where slug in (
  'is-hukuku',
  'aile-hukuku',
  'miras-hukuku',
  'icra-hukuku',
  'ceza-hukuku',
  'gayrimenkul-hukuku',
  'diger'
);

insert into public.categories (slug, name)
values
  ('isten-cikarilma-ve-fesih', 'İşten Çıkarılma ve Fesih'),
  ('kidem-ve-ihbar-tazminati', 'Kıdem ve İhbar Tazminatı'),
  ('ucret-ve-iscilik-alacaklari', 'Ücret ve İşçilik Alacakları'),
  ('calisma-sureleri-ve-izinler', 'Çalışma Süreleri ve İzinler'),
  ('ise-iade-ve-is-guvencesi', 'İşe İade ve İş Güvencesi'),
  ('isyerinde-haklar-ve-mobbing', 'İşyerinde Haklar ve Mobbing'),
  ('is-davalari-ve-arabuluculuk', 'İş Davaları ve Arabuluculuk'),
  ('is-kazasi-ve-meslek-hastaligi', 'İş Kazası ve Meslek Hastalığı'),
  ('sgk-ve-sigortalilik', 'SGK ve Sigortalılık')
on conflict (slug) do update set name = excluded.name;
