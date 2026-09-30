insert into storage.buckets (id, name, public)
values
  ('article-images', 'article-images', true),
  ('author-images', 'author-images', true)
on conflict (id) do nothing;

create policy "Public read article images"
on storage.objects for select
using (bucket_id = 'article-images');

create policy "Public read author images"
on storage.objects for select
using (bucket_id = 'author-images');
