# EventWall - Schema do Banco de Dados (Supabase)

Este documento define a estrutura do banco do zero. Use como referência para recriar o projeto Supabase.

---

## Visão Geral das Tabelas

* `clients` — organizadores/clientes que contratam o serviço
* `events` — cada evento individual, vinculado a um client
* `event_themes` — configuração visual de cada evento
* `submissions` — fotos e recados enviados pelos convidados
* `app_admins` — usuários com acesso ao Admin do App

Autenticação de `clients` e `app_admins` usa o Supabase Auth nativo (`auth.users`). Convidados **não** têm conta — nunca autenticam.

---

## Tabela: `clients`

Representa quem contratou a plataforma (o organizador do evento, ou uma empresa que revende o serviço).

```sql
create table clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  name text not null,
  email text not null,
  phone text,
  created_at timestamptz default now()
);
```

---

## Tabela: `events`

```sql
create table events (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) not null,
  name text not null,
  slug text unique not null, -- usado na URL do QR Code
  event_date date,
  status text not null default 'draft' check (status in ('draft', 'active', 'ended')),
  moderation_enabled boolean not null default false, -- se true, admin aprova antes de ir pro telão
  allow_guest_name boolean not null default true,
  welcome_message text default 'Envie sua foto e recado!',
  created_at timestamptz default now()
);

create index idx_events_slug on events(slug);
```

`slug` é o identificador usado na URL que o QR Code aponta: `eventwall.app/e/{slug}`.

---

## Tabela: `event_themes`

Um evento tem um tema (relação 1:1). Separado da tabela `events` para manter a configuração visual isolada e fácil de expandir.

```sql
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
  background_image_url text, -- opcional, imagem de fundo customizada
  logo_url text, -- opcional, logo do evento
  animation_style text not null default 'confetti' check (animation_style in ('confetti', 'hearts', 'balloons', 'sparkles', 'none')),
  created_at timestamptz default now()
);
```

Ver `DESIGN_SYSTEM.md` para como esses campos viram tokens de design aplicados na Página do Convidado e no Telão.

---

## Tabela: `submissions`

O coração do produto: cada foto + recado enviado por um convidado.

```sql
create table submissions (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) not null,
  guest_name text, -- opcional
  message text,
  photo_url text, -- storage path no Supabase Storage
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  featured boolean not null default false, -- destacar no telão (fixar/dar mais tempo de tela)
  created_at timestamptz default now()
);

create index idx_submissions_event_status on submissions(event_id, status);
```

Regra: se `moderation_enabled = false` no evento, toda submission nasce com `status = 'approved'` automaticamente (via trigger ou lógica no insert). Se `moderation_enabled = true`, nasce `pending` e precisa de ação no Admin do Evento.

Pelo menos um entre `message` e `photo_url` deve existir — validar na aplicação (não obrigatório no banco, pois a regra pode mudar).

---

## Tabela: `app_admins`

```sql
create table app_admins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null unique,
  created_at timestamptz default now()
);
```

Simples de propósito — só marca quem tem acesso de super admin.

---

## Storage (Supabase Storage)

Bucket: `event-photos`

* Estrutura de path sugerida: `{event_id}/{submission_id}.jpg`
* Bucket público para leitura (o Telão e a página de convidado leem sem autenticação)
* Upload restrito via política (ver RLS abaixo) — apenas insert, sem necessidade de auth de convidado

---

## Row Level Security (RLS)

Habilitar RLS em todas as tabelas.

### `clients`
* Client só lê/edita a própria linha (`user_id = auth.uid()`)

### `events`
* Client só lê/edita eventos onde `client_id` pertence a ele
* `app_admins` leem todos os eventos
* Leitura pública (anon) permitida **apenas** para campos não sensíveis via uma view pública (`slug`, `name`, `status`, `welcome_message`, `allow_guest_name`) — usada pela Página do Convidado para carregar o evento pelo slug sem expor dados do client

### `event_themes`
* Leitura pública liberada (anon) — o tema precisa carregar na Página do Convidado e no Telão sem login
* Escrita restrita ao client dono do evento e a `app_admins`

### `submissions`
* **Insert público (anon) liberado** — é assim que o convidado envia, sem conta. Validar no insert que `event_id` existe e está `active`.
* **Select público (anon) liberado apenas para `status = 'approved'`** — é isso que o Telão consome em tempo real.
* Select de `pending`/`rejected` restrito ao client dono do evento (Admin do Evento precisa ver a fila de moderação).
* Update/delete restrito ao client dono do evento e a `app_admins`.

---

## Supabase Realtime

Habilitar Realtime na tabela `submissions`, filtrado por `event_id` e `status = 'approved'`.

O Telão assina o canal Realtime do seu `event_id` e reage a inserts/updates com `status = 'approved'` — é isso que cria o efeito de "aparecer na hora".

---

## Fluxo de Moderação (resumo lógico)

```
Convidado envia → insert em submissions
  ├─ se moderation_enabled = false → status = 'approved' (aparece direto no telão)
  └─ se moderation_enabled = true  → status = 'pending' (fica na fila do Admin do Evento)
       Admin aprova → status = 'approved' → Realtime dispara → aparece no telão
       Admin rejeita → status = 'rejected' → nunca aparece
```
