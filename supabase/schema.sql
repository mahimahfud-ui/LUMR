create extension if not exists pgcrypto;

create table if not exists public.profiles(
 id uuid primary key references auth.users(id) on delete cascade,
 username text not null unique check(username ~ '^[a-z0-9_.-]{3,24}$'),
 display_name text,
 bio text default 'photographs · motion · moments',
 avatar_url text,
 instagram_url text default 'https://www.instagram.com/mahimahfud/',
 youtube_url text,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);

create table if not exists public.media(
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references public.profiles(id) on delete cascade,
 type text not null check(type in('image','video')),
 storage_path text unique not null,
 thumbnail_path text,
 original_url text not null,
 thumbnail_url text,
 title text,
 caption text,
 mime_type text not null,
 width integer,
 height integer,
 duration numeric,
 file_size bigint not null default 0,
 visibility text not null default 'public' check(visibility in('public','private')),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);

do $$
begin
 if not exists(select 1 from pg_constraint where conname='media_video_duration_check') then
   alter table public.media add constraint media_video_duration_check
   check(type='image' or (duration is not null and duration >= 0 and duration <= 90));
 end if;
 if not exists(select 1 from pg_constraint where conname='media_video_resolution_check') then
   alter table public.media add constraint media_video_resolution_check
   check(type='image' or (width is not null and height is not null and greatest(width,height) <= 1920 and least(width,height) <= 1080));
 end if;
end$$;

create index if not exists media_user_created_idx on public.media(user_id,created_at desc);
create schema if not exists private;

create or replace function private.handle_new_user()
returns trigger language plpgsql security definer set search_path=public
as $$
declare u text;
begin
 u:=lower(coalesce(new.raw_user_meta_data->>'username',split_part(new.email,'@',1)));
 u:=substr(regexp_replace(u,'[^a-z0-9_.-]','','g'),1,24);
 if length(u)<3 then u:='user_'||substr(new.id::text,1,8); end if;
 insert into public.profiles(id,username,display_name)
 values(new.id,u,coalesce(new.raw_user_meta_data->>'display_name',u))
 on conflict(id) do nothing;
 return new;
end;
$$;
revoke all on function private.handle_new_user() from public;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function private.handle_new_user();

alter table public.profiles enable row level security;
alter table public.media enable row level security;

drop policy if exists profiles_public_read on public.profiles;
create policy profiles_public_read on public.profiles for select to anon,authenticated using(true);
drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own on public.profiles for insert to authenticated with check((select auth.uid())=id);
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update to authenticated using((select auth.uid())=id) with check((select auth.uid())=id);

drop policy if exists media_public_read on public.media;
create policy media_public_read on public.media for select to anon,authenticated using(visibility='public' or (select auth.uid())=user_id);
drop policy if exists media_insert_own on public.media;
create policy media_insert_own on public.media for insert to authenticated with check((select auth.uid())=user_id);
drop policy if exists media_update_own on public.media;
create policy media_update_own on public.media for update to authenticated using((select auth.uid())=user_id) with check((select auth.uid())=user_id);
drop policy if exists media_delete_own on public.media;
create policy media_delete_own on public.media for delete to authenticated using((select auth.uid())=user_id);

grant select,insert,update,delete on public.profiles to anon,authenticated;
grant select,insert,update,delete on public.media to anon,authenticated;

insert into storage.buckets(id,name,public,file_size_limit)
values('media','media',true,536870912)
on conflict(id) do update set public=true,file_size_limit=536870912;

drop policy if exists media_bucket_insert on storage.objects;
create policy media_bucket_insert on storage.objects for insert to authenticated
with check(bucket_id='media' and (storage.foldername(name))[1]=(select auth.uid()::text));

drop policy if exists media_bucket_update on storage.objects;
create policy media_bucket_update on storage.objects for update to authenticated
using(bucket_id='media' and (storage.foldername(name))[1]=(select auth.uid()::text))
with check(bucket_id='media' and (storage.foldername(name))[1]=(select auth.uid()::text));

drop policy if exists media_bucket_delete on storage.objects;
create policy media_bucket_delete on storage.objects for delete to authenticated
using(bucket_id='media' and (storage.foldername(name))[1]=(select auth.uid()::text));