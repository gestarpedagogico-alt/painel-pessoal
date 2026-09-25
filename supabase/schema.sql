-- Painel Pessoal Norte Rios — schema Supabase/PostgreSQL
-- Rode este arquivo primeiro no SQL Editor do Supabase, depois rode seed.sql.
--
-- Duas famílias de tabelas:
--  1) Catálogo (somente leitura pelo app): espelham 1:1 o que hoje está hardcoded
--     em js/app/data.js. Nunca são escritas pela interface.
--  2) Estado (leitura + escrita pelo app): espelham 1:1 o que hoje fica em
--     localStorage via js/app/state.js (defaultState()). Dataset único e
--     compartilhado — não há coluna de usuário (decisão registrada no plano de
--     migração: o gate de login continua sendo só um allowlist client-side, não
--     uma fronteira real de autenticação/autorização).

-- ======================= CATÁLOGO =======================

create table if not exists naturezas (
  slug text primary key,
  rotulo text not null
);

create table if not exists semana_dias (
  id text primary key,
  nome text not null,
  foco text not null,
  cor text not null,
  ordem int not null unique
);

create table if not exists semana_blocos (
  id text primary key,
  dia_id text not null references semana_dias(id) on delete cascade,
  ordem int not null,
  hora text,
  tarefa text,
  natureza_slug text references naturezas(slug) on delete set null,
  bloqueado boolean not null default false,
  almoco boolean not null default false,
  unique (dia_id, ordem)
);

create table if not exists encontros_gestores (
  id text primary key,
  data date not null,
  mes_chave text,
  data_label text not null,
  dia_semana text not null,
  horario text not null,
  publico text not null,
  encontro_label text not null,
  is_seminario boolean not null default false
);

create table if not exists meses (
  chave text primary key,
  rotulo text not null,
  nota text,
  inicio text,
  durante text,
  fim text,
  ordem int not null unique
);

-- semana_dias/encontros_gestores/meses acima não têm FK cruzada obrigatória:
-- o "mes" de um encontro (ex.: "dez" no Seminário de Integração) pode não
-- existir em `meses` (dezembro não é modelado como mês do painel hoje), então
-- mes_chave fica como texto livre, sem FK dura — preserva o dado real sem
-- inventar uma linha de mês que não existe no app atual.

create table if not exists bimestre_itens (
  ordem int primary key,
  objetivo text not null,
  evidencia text not null,
  sucesso text not null,
  proximo_passo text not null
);

create table if not exists frentes (
  n int primary key,
  nome text not null,
  peso numeric not null,
  obrigatorio boolean not null default false,
  meta text not null,
  acoes text not null,
  produto text not null,
  prazo text not null,
  evidencia text not null,
  resultado text not null
);

create table if not exists eixos (
  letra text primary key,
  nome text not null,
  prioridade text not null,
  cor text not null,
  aplicacao text not null
);

create table if not exists eixos_cursos (
  id serial primary key,
  eixo_letra text not null references eixos(letra) on delete cascade,
  ordem int not null,
  mes_label text not null,
  curso text not null,
  unique (eixo_letra, ordem)
);

create table if not exists eixos_media (
  id serial primary key,
  nome text not null,
  prioridade text not null,
  ordem int not null unique
);

create table if not exists mapa_entregas (
  id text primary key,
  acao text not null,
  entrega text not null,
  periodicidade text not null,
  evidencia text not null,
  meta text not null,
  ordem int not null unique
);

create table if not exists status_opts (
  valor text primary key,
  rotulo text not null,
  ordem int not null unique
);

-- ======================= ESTADO =======================

create table if not exists painel_estado (
  id smallint primary key default 1 check (id = 1),
  pdi_curso_atual text,
  pdi_percent int not null default 0,
  prioridades text not null default '',
  pendencias text not null default '',
  observacoes text not null default '',
  mes_ativo text references meses(chave),
  atualizado_em timestamptz not null default now()
);

create table if not exists checks (
  item_id text primary key,
  marcado boolean not null default false,
  atualizado_em timestamptz not null default now()
);

create table if not exists entrega_status (
  mapa_id text primary key references mapa_entregas(id) on delete cascade,
  status text not null references status_opts(valor),
  atualizado_em timestamptz not null default now()
);

create table if not exists edits (
  chave text primary key,
  valor text not null,
  atualizado_em timestamptz not null default now()
);

-- ======================= RLS =======================
-- Sem Supabase Auth real (o app usa só a anon key). RLS fica habilitado em
-- todas as tabelas, com policies permissivas equivalentes ao acesso que o app
-- já faz hoje: catálogo só leitura, estado leitura + escrita. Mesma concessão
-- de segurança já documentada para o gate de login (não é uma fronteira real).

alter table naturezas enable row level security;
alter table semana_dias enable row level security;
alter table semana_blocos enable row level security;
alter table encontros_gestores enable row level security;
alter table meses enable row level security;
alter table bimestre_itens enable row level security;
alter table frentes enable row level security;
alter table eixos enable row level security;
alter table eixos_cursos enable row level security;
alter table eixos_media enable row level security;
alter table mapa_entregas enable row level security;
alter table status_opts enable row level security;
alter table painel_estado enable row level security;
alter table checks enable row level security;
alter table entrega_status enable row level security;
alter table edits enable row level security;

create policy "catalogo_leitura" on naturezas for select using (true);
create policy "catalogo_leitura" on semana_dias for select using (true);
create policy "catalogo_leitura" on semana_blocos for select using (true);
create policy "catalogo_leitura" on encontros_gestores for select using (true);
create policy "catalogo_leitura" on meses for select using (true);
create policy "catalogo_leitura" on bimestre_itens for select using (true);
create policy "catalogo_leitura" on frentes for select using (true);
create policy "catalogo_leitura" on eixos for select using (true);
create policy "catalogo_leitura" on eixos_cursos for select using (true);
create policy "catalogo_leitura" on eixos_media for select using (true);
create policy "catalogo_leitura" on mapa_entregas for select using (true);
create policy "catalogo_leitura" on status_opts for select using (true);

create policy "estado_leitura" on painel_estado for select using (true);
create policy "estado_escrita" on painel_estado for update using (true) with check (true);

create policy "estado_leitura" on checks for select using (true);
create policy "estado_escrita_insert" on checks for insert with check (true);
create policy "estado_escrita_update" on checks for update using (true) with check (true);
create policy "estado_escrita_delete" on checks for delete using (true);

create policy "estado_leitura" on entrega_status for select using (true);
create policy "estado_escrita_insert" on entrega_status for insert with check (true);
create policy "estado_escrita_update" on entrega_status for update using (true) with check (true);

create policy "estado_leitura" on edits for select using (true);
create policy "estado_escrita_insert" on edits for insert with check (true);
create policy "estado_escrita_update" on edits for update using (true) with check (true);
