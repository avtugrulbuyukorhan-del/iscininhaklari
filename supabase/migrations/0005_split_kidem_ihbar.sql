insert into public.categories (slug, name)
values
  ('kidem-tazminati', 'Kıdem Tazminatı'),
  ('ihbar-tazminati', 'İhbar Tazminatı')
on conflict (slug) do update set name = excluded.name;

update public.articles
set category = 'kidem-tazminati'
where category = 'kidem-ve-ihbar-tazminati';

delete from public.categories
where slug = 'kidem-ve-ihbar-tazminati';
