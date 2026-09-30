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
