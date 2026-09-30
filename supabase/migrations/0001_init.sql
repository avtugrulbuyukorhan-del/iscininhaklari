create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user',
  created_at timestamptz not null default now()
);

create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.profiles where id = uid and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;

create policy "profiles_self_select" on public.profiles
for select using (auth.uid() = id);

create policy "profiles_insert_self" on public.profiles
for insert with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role)
  values (
    new.id,
    case
      when new.id = '0047e81b-8308-4762-ace7-9c49d1725c8a'::uuid
        or lower(coalesce(new.email, '')) = 'tb@iscininhaklari.com'
      then 'admin'
      else 'user'
    end
  )
  on conflict (id) do update set role = excluded.role;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

insert into public.profiles (id, role)
select u.id, 'admin'
from auth.users u
where u.id = '0047e81b-8308-4762-ace7-9c49d1725c8a'::uuid
   or lower(u.email) = 'tb@iscininhaklari.com'
on conflict (id) do update set role = 'admin';

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  intro text,
  pillar_md text,
  meta_title text,
  meta_description text,
  updated_at timestamptz default now()
);

alter table public.categories enable row level security;

create policy "categories_select_public" on public.categories
for select to public using (true);

create policy "categories_admin_write" on public.categories
for insert with check (is_admin(auth.uid()));

create policy "categories_admin_update" on public.categories
for update using (is_admin(auth.uid()));

create policy "categories_admin_delete" on public.categories
for delete using (is_admin(auth.uid()));

create table if not exists public.authors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  bio text,
  photo_url text,
  title text,
  bar_name text,
  bar_registration text,
  sameas_links jsonb default '[]'::jsonb,
  linkedin_url text,
  instagram_url text,
  whatsapp_url text,
  created_at timestamptz not null default now()
);

create index if not exists idx_authors_slug on public.authors(slug);

alter table public.authors enable row level security;

create policy "Public can read authors"
  on public.authors for select
  using (true);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  category text,
  author_id uuid references public.authors(id) on delete set null,
  content text not null default '',
  meta_title text,
  meta_description text,
  featured_image_url text,
  featured_image_alt text,
  faq jsonb default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists idx_articles_category_slug_unique
  on public.articles (category, slug)
  where category is not null;

create unique index if not exists idx_articles_slug_null_category_unique
  on public.articles (slug)
  where category is null;

create index if not exists idx_articles_slug on public.articles(slug);
create index if not exists idx_articles_status on public.articles(status);
create index if not exists idx_articles_category on public.articles(category);
create index if not exists idx_articles_author_id on public.articles(author_id);

alter table public.articles enable row level security;

create policy "Public can read published articles"
  on public.articles for select
  using (status = 'published');

create policy "Admin can read all articles"
  on public.articles for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists articles_updated_at on public.articles;
create trigger articles_updated_at
  before update on public.articles
  for each row execute function public.set_updated_at();

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  message text not null,
  whatsapp_consent boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);

alter table public.contact_messages enable row level security;

create policy "contact_messages_admin_select" on public.contact_messages
for select
using (is_admin(auth.uid()));

create table if not exists public.contact_submission_log (
  id uuid primary key default gen_random_uuid(),
  ip_address text not null,
  submitted_at timestamptz not null default now()
);

create index if not exists contact_submission_log_ip_time
  on public.contact_submission_log (ip_address, submitted_at desc);

alter table public.contact_submission_log enable row level security;

create table if not exists public.consent_log (
  id uuid primary key default gen_random_uuid(),
  ip_address text not null,
  consent_at timestamptz not null default now(),
  consent_status boolean not null default true,
  phone text,
  form_type text not null,
  whatsapp_consent boolean default null
);

create index if not exists consent_log_ip_at on public.consent_log (ip_address, consent_at desc);

alter table public.consent_log enable row level security;

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
on conflict (slug) do nothing;
