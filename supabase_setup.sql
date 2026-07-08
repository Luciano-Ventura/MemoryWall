-- EventWall - Schema Inicial Supabase

-- 1. Criação das Tabelas

create table clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  name text not null,
  email text not null,
  phone text,
  created_at timestamptz default now()
);

create table events (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) not null,
  name text not null,
  slug text unique not null,
  event_date date,
  status text not null default 'draft' check (status in ('draft', 'active', 'ended')),
  moderation_enabled boolean not null default false,
  allow_guest_name boolean not null default true,
  welcome_message text default 'Envie sua foto e recado!',
  created_at timestamptz default now()
);

create index idx_events_slug on events(slug);

create table event_themes (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) not null unique,
  primary_color text not null default '#FF6B6B',
  secondary_color text not null default '#4ECDC4',
  background_color text not null default '#FFF8F0',
  accent_color text not null default '#FFD93D',
  text_color text not null default '#2D2D2D',
  font_display text not null default 'Fredoka',
  font_body text not null default 'Inter',
  background_image_url text,
  logo_url text,
  animation_style text not null default 'confetti' check (animation_style in ('confetti', 'hearts', 'balloons', 'sparkles', 'none')),
  created_at timestamptz default now()
);

create table submissions (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) not null,
  guest_name text,
  message text,
  photo_url text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  featured boolean not null default false,
  created_at timestamptz default now()
);

create index idx_submissions_event_status on submissions(event_id, status);

create table app_admins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null unique,
  created_at timestamptz default now()
);

-- 2. Habilitar RLS em todas as tabelas
alter table clients enable row level security;
alter table events enable row level security;
alter table event_themes enable row level security;
alter table submissions enable row level security;
alter table app_admins enable row level security;

-- 3. Políticas de RLS

-- Clients
create policy "Client só lê a própria linha" on clients for select using (user_id = auth.uid());
create policy "Client só edita a própria linha" on clients for update using (user_id = auth.uid());
create policy "App admins leem todos os clients" on clients for select using (exists (select 1 from app_admins where user_id = auth.uid()));

-- Events
create policy "Client lê próprios eventos" on events for select using (client_id in (select id from clients where user_id = auth.uid()));
create policy "Client edita próprios eventos" on events for update using (client_id in (select id from clients where user_id = auth.uid()));
create policy "Client insere próprios eventos" on events for insert with check (client_id in (select id from clients where user_id = auth.uid()));
create policy "App admins leem todos os eventos" on events for select using (exists (select 1 from app_admins where user_id = auth.uid()));

-- Event Themes
create policy "Leitura pública do tema" on event_themes for select using (true);
create policy "Client dono do evento escreve tema" on event_themes for all using (
  event_id in (select id from events where client_id in (select id from clients where user_id = auth.uid()))
);
create policy "App admins escrevem tema" on event_themes for all using (exists (select 1 from app_admins where user_id = auth.uid()));

-- Submissions
create policy "Insert público liberado (anon)" on submissions for insert with check (
  exists (select 1 from events where id = event_id and status = 'active')
);
create policy "Select público apenas approved" on submissions for select using (status = 'approved');
create policy "Client dono le pending e rejected" on submissions for select using (
  event_id in (select id from events where client_id in (select id from clients where user_id = auth.uid()))
);
create policy "Client dono altera/deleta submissions" on submissions for all using (
  event_id in (select id from events where client_id in (select id from clients where user_id = auth.uid()))
);
create policy "App admins tem total acesso as submissions" on submissions for all using (exists (select 1 from app_admins where user_id = auth.uid()));

-- App Admins
create policy "Apenas super admins leem tabela app_admins" on app_admins for select using (exists (select 1 from app_admins where user_id = auth.uid()));

-- 4. Storage Bucket
insert into storage.buckets (id, name, public) values ('event-photos', 'event-photos', true);
create policy "Upload publico de fotos" on storage.objects for insert with check ( bucket_id = 'event-photos' );
create policy "Leitura publica de fotos" on storage.objects for select using ( bucket_id = 'event-photos' );

-- 5. Habilitar Realtime
alter publication supabase_realtime add table submissions;
