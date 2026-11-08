-- =====================================================================
-- Veltrixx — base de données du site (Supabase)
-- Comptes, profils, avis, messagerie en direct, administrateur.
-- À lancer une fois dans Supabase > SQL Editor > New query > Run.
-- On peut le relancer sans risque : tout est « if not exists / or replace ».
-- =====================================================================

-- ---------- Profils publics (pseudo + photo) ----------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Membre' check (char_length(display_name) between 1 and 40),
  avatar_url  text check (avatar_url is null or avatar_url ~* '^https://'),
  created_at  timestamptz not null default now()
);

-- ---------- Administrateurs (toi) ----------
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- Création automatique du profil à l'inscription
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    left(coalesce(nullif(new.raw_user_meta_data->>'display_name', ''), nullif(new.raw_user_meta_data->>'full_name', ''),
                  nullif(new.raw_user_meta_data->>'name', ''), nullif(new.raw_user_meta_data->'custom_claims'->>'global_name', ''),
                  split_part(new.email, '@', 1), 'Membre'), 40),
    case when coalesce(new.raw_user_meta_data->>'avatar_url', '') ~* '^https://' then new.raw_user_meta_data->>'avatar_url' end
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Avis (un par compte) ----------
create table if not exists public.reviews (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null unique references public.profiles(id) on delete cascade,
  rating     int  not null check (rating between 1 and 5),
  text       text not null check (char_length(text) between 5 and 600),
  role       text check (role is null or char_length(role) <= 50),
  link       text check (link is null or link ~* '^https?://[^\s"<>]+$'),
  visible    boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Un membre ne peut pas se remettre en ligne s'il a été masqué par l'admin
create or replace function public.reviews_guard() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then
    if tg_op = 'INSERT' then new.visible := true;
    else new.visible := old.visible; new.user_id := old.user_id; new.created_at := old.created_at;
    end if;
  end if;
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists reviews_guard on public.reviews;
create trigger reviews_guard before insert or update on public.reviews
  for each row execute function public.reviews_guard();

-- ---------- Messagerie (une conversation par membre, avec toi) ----------
create table if not exists public.messages (
  id         bigint generated always as identity primary key,
  thread_id  uuid not null references public.profiles(id) on delete cascade,   -- = le membre
  sender_id  uuid not null references public.profiles(id) on delete cascade,
  body       text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now(),
  read_at    timestamptz
);
create index if not exists messages_thread_idx on public.messages (thread_id, created_at);

-- Seul « lu » peut être modifié, et seulement par le destinataire
create or replace function public.messages_guard() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.body <> old.body or new.thread_id <> old.thread_id or new.sender_id <> old.sender_id or new.created_at <> old.created_at then
    raise exception 'Seul le statut « lu » peut changer';
  end if;
  if old.sender_id = auth.uid() then raise exception 'On ne marque pas ses propres messages comme lus'; end if;
  return new;
end $$;
drop trigger if exists messages_guard on public.messages;
create trigger messages_guard before update on public.messages
  for each row execute function public.messages_guard();

-- Anti-spam : 20 messages par minute maximum par personne
create or replace function public.messages_rate() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.messages where sender_id = new.sender_id and created_at > now() - interval '1 minute') >= 20 then
    raise exception 'Trop de messages, attends un peu';
  end if;
  return new;
end $$;
drop trigger if exists messages_rate on public.messages;
create trigger messages_rate before insert on public.messages
  for each row execute function public.messages_rate();

-- ---------- Sécurité (RLS) ----------
alter table public.profiles enable row level security;
alter table public.admins   enable row level security;
alter table public.reviews  enable row level security;
alter table public.messages enable row level security;

drop policy if exists "profils visibles" on public.profiles;
create policy "profils visibles" on public.profiles for select using (true);
drop policy if exists "je modifie mon profil" on public.profiles;
create policy "je modifie mon profil" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "admin se voit" on public.admins;
create policy "admin se voit" on public.admins for select using (user_id = auth.uid());

drop policy if exists "avis visibles" on public.reviews;
create policy "avis visibles" on public.reviews for select using (visible or user_id = auth.uid() or public.is_admin());
drop policy if exists "je poste mon avis" on public.reviews;
create policy "je poste mon avis" on public.reviews for insert with check (user_id = auth.uid());
drop policy if exists "je modifie mon avis" on public.reviews;
create policy "je modifie mon avis" on public.reviews for update using (user_id = auth.uid() or public.is_admin());
drop policy if exists "je supprime mon avis" on public.reviews;
create policy "je supprime mon avis" on public.reviews for delete using (user_id = auth.uid() or public.is_admin());

drop policy if exists "je lis ma conversation" on public.messages;
create policy "je lis ma conversation" on public.messages for select using (thread_id = auth.uid() or public.is_admin());
drop policy if exists "j'écris dans ma conversation" on public.messages;
create policy "j'écris dans ma conversation" on public.messages for insert
  with check (sender_id = auth.uid() and (thread_id = auth.uid() or public.is_admin()));
drop policy if exists "je marque comme lu" on public.messages;
create policy "je marque comme lu" on public.messages for update using (thread_id = auth.uid() or public.is_admin());
drop policy if exists "admin supprime" on public.messages;
create policy "admin supprime" on public.messages for delete using (public.is_admin());

-- Liste des conversations pour l'admin (dernier message + non lus)
create or replace function public.admin_threads()
returns table (thread_id uuid, display_name text, avatar_url text, email text, last_body text, last_at timestamptz, last_sender uuid, unread bigint)
language sql stable security definer set search_path = public as $$
  select m.thread_id, p.display_name, p.avatar_url, u.email::text,
         (array_agg(m.body order by m.created_at desc))[1],
         max(m.created_at),
         (array_agg(m.sender_id order by m.created_at desc))[1],
         count(*) filter (where m.read_at is null and m.sender_id = m.thread_id)
  from public.messages m
  join public.profiles p on p.id = m.thread_id
  join auth.users u on u.id = m.thread_id
  where public.is_admin()
  group by m.thread_id, p.display_name, p.avatar_url, u.email
  order by max(m.created_at) desc;
$$;

-- Statistiques pour le panneau admin
create or replace function public.admin_stats()
returns json language sql stable security definer set search_path = public as $$
  select case when public.is_admin() then json_build_object(
    'members',  (select count(*) from auth.users),
    'reviews',  (select count(*) from public.reviews),
    'hidden',   (select count(*) from public.reviews where not visible),
    'avg',      (select round(avg(rating)::numeric, 2) from public.reviews where visible),
    'unread',   (select count(*) from public.messages where read_at is null and sender_id = thread_id)
  ) end;
$$;

-- Suppression de son propre compte (RGPD) : efface le compte et tout ce qui va avec
create or replace function public.delete_my_account() returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'Non connecté'; end if;
  delete from auth.users where id = auth.uid();
end $$;

revoke all on function public.admin_threads() from anon;
revoke all on function public.admin_stats() from anon;
revoke all on function public.delete_my_account() from anon;

-- ---------- Droits d'accès de l'API (les règles RLS ci-dessus filtrent ensuite ligne par ligne) ----------
grant usage on schema public to anon, authenticated;
grant select on public.profiles, public.reviews to anon;
grant select, update on public.profiles to authenticated;
grant select on public.admins to authenticated;
grant select, insert, update, delete on public.reviews to authenticated;
grant select, insert, update, delete on public.messages to authenticated;
grant usage, select on sequence public.messages_id_seq to authenticated;
grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.admin_threads(), public.admin_stats(), public.delete_my_account() to authenticated;

-- ---------- Temps réel pour le chat ----------
do $$ begin
  alter publication supabase_realtime add table public.messages;
exception when duplicate_object then null; end $$;

-- =====================================================================
-- Te nommer admin (à lancer APRÈS avoir créé ton compte et confirmé ton email) :
--   insert into public.admins (user_id)
--   select id from auth.users where email = 'contact@veltrixx.eu' and email_confirmed_at is not null
--   on conflict do nothing;
-- =====================================================================
