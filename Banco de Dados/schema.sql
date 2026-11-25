-- =====================================================
-- GESTLUX - SCHEMA INICIAL (SUPABASE / POSTGRES)
-- Execute este arquivo no SQL Editor do seu projeto.
-- =====================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------
-- Tabelas
-- -----------------------------------------------------
create table if not exists public.organizacoes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  segmento text not null default 'varejo',
  notificacoes boolean not null default true,
  respostas jsonb not null default '{}'::jsonb,
  modulos text[] not null default '{}',
  criado_em timestamptz not null default now()
);

create table if not exists public.perfis (
  id uuid primary key references auth.users(id) on delete cascade,
  organizacao_id uuid not null references public.organizacoes(id) on delete cascade,
  nome text not null,
  email text not null,
  papel text not null default 'admin' check (papel in ('admin', 'gerente', 'operador')),
  criado_em timestamptz not null default now()
);

create table if not exists public.produtos (
  id uuid primary key default gen_random_uuid(),
  organizacao_id uuid not null references public.organizacoes(id) on delete cascade,
  nome text not null,
  sku text,
  preco numeric(12, 2) not null default 0,
  quantidade integer not null default 0,
  minimo integer not null default 0,
  tipo_produto text,
  data_validade date,
  nota_fiscal text,
  codigo_barras text,
  fornecedor_padrao text,
  criado_em timestamptz not null default now()
);

create table if not exists public.movimentacoes (
  id uuid primary key default gen_random_uuid(),
  organizacao_id uuid not null references public.organizacoes(id) on delete cascade,
  produto_id uuid references public.produtos(id) on delete set null,
  produto_nome text,
  tipo text not null check (tipo in ('entrada', 'saida', 'venda')),
  quantidade integer not null,
  valor numeric(12, 2) not null default 0,
  observacao text,
  vendedor_id uuid,
  vendedor_nome text,
  fornecedor text,
  lote text,
  data_validade date,
  criado_em timestamptz not null default now()
);

create index if not exists produtos_organizacao_idx on public.produtos (organizacao_id);
create index if not exists movimentacoes_organizacao_idx on public.movimentacoes (organizacao_id, criado_em desc);

-- SKU único dentro da organização (o seed usa isso para não duplicar).
create unique index if not exists produtos_org_sku_uq on public.produtos (organizacao_id, sku) where sku is not null;

-- Convites: o link é gerado no painel e enviado pelo próprio administrador.
-- Nenhum e-mail é disparado automaticamente pelo sistema.
create table if not exists public.convites (
  id uuid primary key default gen_random_uuid(),
  organizacao_id uuid not null references public.organizacoes(id) on delete cascade,
  email text not null,
  nome text not null default '',
  papel text not null default 'operador' check (papel in ('admin', 'gerente', 'operador')),
  token text not null unique,
  status text not null default 'pendente' check (status in ('pendente', 'aceito', 'cancelado')),
  criado_em timestamptz not null default now(),
  aceito_em timestamptz
);

create unique index if not exists convites_org_email_pendente_uq
  on public.convites (organizacao_id, email) where status = 'pendente';

grant select, insert, update on public.convites to authenticated;

-- -----------------------------------------------------
-- Migração: preferências de onboarding por organização.
-- -----------------------------------------------------
alter table public.organizacoes add column if not exists respostas jsonb not null default '{}'::jsonb;
alter table public.organizacoes add column if not exists modulos text[] not null default '{}';

-- Organizações criadas antes do onboarding recebem os módulos do segmento,
-- sem apagar escolhas já salvas.
update public.organizacoes
set modulos = case segmento
  when 'varejo' then array['7', '8']
  when 'empresarial' then array['1', '2']
  when 'educacional' then array['3', '4']
  when 'saude' then array['5', '6']
  else array['7', '8']
end
where coalesce(array_length(modulos, 1), 0) = 0;

-- -----------------------------------------------------
-- Migração: o histórico sobrevive à exclusão do produto.
-- produto_id fica anulável (on delete set null) e o nome do
-- produto é denormalizado em produto_nome para os relatórios.
-- Assim, produto com estoque zerado pode ser excluído sem
-- apagar as vendas registradas. Seguro para rodar de novo.
-- -----------------------------------------------------
alter table public.produtos add column if not exists tipo_produto text;
alter table public.produtos add column if not exists data_validade date;
alter table public.produtos add column if not exists nota_fiscal text;
alter table public.produtos add column if not exists codigo_barras text;
alter table public.produtos add column if not exists fornecedor_padrao text;

alter table public.movimentacoes add column if not exists produto_nome text;
alter table public.movimentacoes add column if not exists observacao text;
alter table public.movimentacoes add column if not exists vendedor_id uuid;
alter table public.movimentacoes add column if not exists vendedor_nome text;
alter table public.movimentacoes add column if not exists fornecedor text;
alter table public.movimentacoes add column if not exists lote text;
alter table public.movimentacoes add column if not exists data_validade date;

-- Vendas antigas ficam sem vendedor identificado (não inventamos dados).
-- A FK mantém o vínculo quando disponível; o nome fica gravado no histórico.
do $$
declare
  v_fk text;
begin
  select conname into v_fk
  from pg_constraint
  where conrelid = 'public.movimentacoes'::regclass
    and contype = 'f'
    and pg_get_constraintdef(oid) like '%vendedor_id%';

  if not found then
    alter table public.movimentacoes
      add constraint movimentacoes_vendedor_fk
      foreign key (vendedor_id) references public.perfis(id) on delete set null;
  end if;
end $$;

-- Movimentações antigas ganham o nome do produto (para sobreviver
-- à exclusão dele nos relatórios).
update public.movimentacoes m
set produto_nome = p.nome
from public.produtos p
where m.produto_id = p.id and m.produto_nome is null;

do $$
declare
  v_fk text;
begin
  select conname into v_fk
  from pg_constraint
  where conrelid = 'public.movimentacoes'::regclass
    and contype = 'f'
    and pg_get_constraintdef(oid) like '%produto_id%';

  if found then
    execute 'alter table public.movimentacoes drop constraint ' || quote_ident(v_fk);
  end if;
end $$;

alter table public.movimentacoes alter column produto_id drop not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.movimentacoes'::regclass
      and contype = 'f'
      and pg_get_constraintdef(oid) like '%produto_id%'
  ) then
    alter table public.movimentacoes
      add constraint movimentacoes_produto_fk
      foreign key (produto_id) references public.produtos(id) on delete set null;
  end if;
end $$;

-- -----------------------------------------------------
-- Função auxiliar: organização do usuário autenticado.
-- SECURITY DEFINER evita recursão nas políticas de RLS.
-- -----------------------------------------------------
create or replace function public.organizacao_atual()
returns uuid
language sql
security definer
set search_path = public
as $$
  select organizacao_id from public.perfis where id = auth.uid() limit 1;
$$;

-- Papel do usuário autenticado. SECURITY DEFINER evita recursão
-- nas policies que precisam decidir entre admin, gerente e operador.
create or replace function public.papel_atual()
returns text
language sql
security definer
set search_path = public
as $$
  select papel from public.perfis where id = auth.uid() limit 1;
$$;

revoke all on function public.papel_atual() from public;
grant execute on function public.papel_atual() to authenticated;

-- -----------------------------------------------------
-- Cadastro atômico: cria organização + perfil do usuário.
-- -----------------------------------------------------
create or replace function public.criar_organizacao(
  p_nome text,
  p_segmento text,
  p_nome_usuario text,
  p_email_usuario text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org uuid;
begin
  if exists (select 1 from public.perfis where id = auth.uid()) then
    return public.organizacao_atual();
  end if;

  insert into public.organizacoes (nome, segmento, modulos)
  values (
    p_nome,
    p_segmento,
    case p_segmento
      when 'varejo' then array['7', '8']
      when 'empresarial' then array['1', '2']
      when 'educacional' then array['3', '4']
      when 'saude' then array['5', '6']
      else array[]::text[]
    end
  )
  returning id into v_org;

  insert into public.perfis (id, organizacao_id, nome, email, papel)
  values (auth.uid(), v_org, p_nome_usuario, p_email_usuario, 'admin');

  return v_org;
end;
$$;

revoke all on function public.criar_organizacao(text, text, text, text) from public;
grant execute on function public.criar_organizacao(text, text, text, text) to authenticated;

-- -----------------------------------------------------
-- Onboarding: salva as respostas e os módulos escolhidos
-- apenas na organização do usuário autenticado.
-- -----------------------------------------------------
create or replace function public.salvar_onboarding(
  p_respostas jsonb,
  p_modulos text[]
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org uuid;
begin
  if coalesce(public.papel_atual(), '') <> 'admin' then
    raise exception 'Somente administradores podem alterar configurações.';
  end if;

  v_org := public.organizacao_atual();
  if v_org is null then
    raise exception 'Organização não encontrada.';
  end if;

  update public.organizacoes
  set respostas = coalesce(p_respostas, '{}'::jsonb),
      modulos = coalesce(p_modulos, array[]::text[])
  where id = v_org;
end;
$$;

revoke all on function public.salvar_onboarding(jsonb, text[]) from public;
grant execute on function public.salvar_onboarding(jsonb, text[]) to authenticated;

-- -----------------------------------------------------
-- Pessoas: convite por link, papel e venda por vendedor.
-- Nenhuma chave de serviço é usada no navegador.
-- -----------------------------------------------------
create or replace function public.criar_convite(
  p_email text,
  p_nome text,
  p_papel text
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org uuid;
  v_papel_admin text;
  v_token text;
begin
  select papel into v_papel_admin from public.perfis where id = auth.uid();
  if coalesce(v_papel_admin, '') not in ('admin', 'gerente') then
    raise exception 'Somente administradores e gerentes podem convidar.';
  end if;

  v_org := public.organizacao_atual();
  if v_org is null then
    raise exception 'Organização não encontrada.';
  end if;
  if coalesce(p_papel, '') not in ('admin', 'gerente', 'operador') then
    raise exception 'Papel inválido.';
  end if;
  -- Gerente pode convidar apenas operadores; papéis de gestão
  -- só são definidos por administradores.
  if v_papel_admin = 'gerente' and p_papel <> 'operador' then
    raise exception 'Gerentes podem convidar apenas operadores.';
  end if;

  -- gen_random_uuid() é nativo; evita depender da extensão pgcrypto no search_path.
  v_token := md5(gen_random_uuid()::text || clock_timestamp()::text || lower(trim(p_email)));
  insert into public.convites (organizacao_id, email, nome, papel, token)
  values (v_org, lower(trim(p_email)), trim(coalesce(p_nome, '')), p_papel, v_token);

  return v_token;
end;
$$;

revoke all on function public.criar_convite(text, text, text) from public;
grant execute on function public.criar_convite(text, text, text) to authenticated;

create or replace function public.detalhes_convite(p_token text)
returns table (email text, nome text, papel text, organizacao text, segmento text)
language sql
security definer
set search_path = public
as $$
  select c.email, c.nome, c.papel, o.nome, o.segmento
  from public.convites c
  join public.organizacoes o on o.id = c.organizacao_id
  where c.token = p_token and c.status = 'pendente'
  limit 1;
$$;

revoke all on function public.detalhes_convite(text) from public;
grant execute on function public.detalhes_convite(text) to anon, authenticated;

create or replace function public.aceitar_convite(
  p_token text,
  p_nome_usuario text,
  p_email_usuario text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_conv public.convites%rowtype;
  v_uid uuid;
begin
  v_uid := auth.uid();
  if v_uid is null then
    raise exception 'Usuário não autenticado.';
  end if;

  select * into v_conv
  from public.convites
  where token = p_token and status = 'pendente'
  for update;

  if not found then
    raise exception 'Convite inválido ou já utilizado.';
  end if;
  if lower(trim(p_email_usuario)) <> v_conv.email then
    raise exception 'Use o e-mail do convite para aceitá-lo.';
  end if;
  if exists (select 1 from public.perfis where id = v_uid) then
    raise exception 'Este usuário já pertence a uma organização.';
  end if;

  insert into public.perfis (id, organizacao_id, nome, email, papel)
  values (v_uid, v_conv.organizacao_id, trim(p_nome_usuario), v_conv.email, v_conv.papel);

  update public.convites
  set status = 'aceito', aceito_em = now()
  where id = v_conv.id;
end;
$$;

revoke all on function public.aceitar_convite(text, text, text) from public;
grant execute on function public.aceitar_convite(text, text, text) to authenticated;

create or replace function public.atualizar_papel(
  p_usuario_id uuid,
  p_papel text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_papel_admin text;
  v_org uuid;
begin
  if coalesce(p_papel, '') not in ('admin', 'gerente', 'operador') then
    raise exception 'Papel inválido.';
  end if;

  select papel into v_papel_admin from public.perfis where id = auth.uid();
  if coalesce(v_papel_admin, '') <> 'admin' then
    raise exception 'Somente administradores podem alterar papéis.';
  end if;
  if p_usuario_id = auth.uid() then
    raise exception 'Você não pode alterar seu próprio papel.';
  end if;

  v_org := public.organizacao_atual();
  if not exists (
    select 1 from public.perfis
    where id = p_usuario_id and organizacao_id = v_org
  ) then
    raise exception 'Pessoa não encontrada nesta organização.';
  end if;

  update public.perfis
  set papel = p_papel
  where id = p_usuario_id and organizacao_id = v_org;
end;
$$;

revoke all on function public.atualizar_papel(uuid, text) from public;
grant execute on function public.atualizar_papel(uuid, text) to authenticated;

create or replace function public.cancelar_convite(p_token text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_papel text;
  v_org uuid;
begin
  select papel into v_papel from public.perfis where id = auth.uid();
  if coalesce(v_papel, '') not in ('admin', 'gerente') then
    raise exception 'Somente administradores e gerentes podem cancelar convites.';
  end if;

  v_org := public.organizacao_atual();
  update public.convites
  set status = 'cancelado'
  where token = p_token
    and organizacao_id = v_org
    and status = 'pendente';
end;
$$;

revoke all on function public.cancelar_convite(text) from public;
grant execute on function public.cancelar_convite(text) to authenticated;

-- -----------------------------------------------------
-- Venda atômica: valida estoque, grava a movimentação e
-- baixa o produto em uma única transação (evita corrida).
-- O vendedor é opcional: vendas antigas ficam "Sem vendedor".
-- -----------------------------------------------------
create or replace function public.registrar_venda_com_pessoa(
  p_produto_id uuid,
  p_quantidade integer,
  p_vendedor_id uuid default null,
  p_vendedor_nome text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org uuid;
  v_preco numeric(12, 2);
  v_estoque integer;
  v_nome text;
begin
  if p_quantidade is null or p_quantidade <= 0 then
    raise exception 'Quantidade inválida.';
  end if;

  v_org := public.organizacao_atual();

  select preco, quantidade into v_preco, v_estoque
  from public.produtos
  where id = p_produto_id and organizacao_id = v_org
  for update;

  if not found then
    raise exception 'Produto não encontrado.';
  end if;

  if v_estoque < p_quantidade then
    raise exception 'Estoque insuficiente.';
  end if;

  -- Só aceita um vendedor que pertença à organização atual.
  if p_vendedor_id is not null then
    select nome into v_nome
    from public.perfis
    where id = p_vendedor_id and organizacao_id = v_org;
    if not found then
      raise exception 'Vendedor não encontrado nesta organização.';
    end if;
    p_vendedor_nome := coalesce(nullif(trim(p_vendedor_nome), ''), v_nome);
  else
    p_vendedor_nome := null;
  end if;

  insert into public.movimentacoes (
    organizacao_id, produto_id, produto_nome, tipo, quantidade, valor,
    vendedor_id, vendedor_nome
  )
  select v_org, p.id, p.nome, 'venda', p_quantidade, v_preco * p_quantidade,
         p_vendedor_id, p_vendedor_nome
  from public.produtos p
  where p.id = p_produto_id;

  update public.produtos
  set quantidade = quantidade - p_quantidade
  where id = p_produto_id;
end;
$$;

-- Mantém a assinatura antiga compatível com quem já usa o painel.
create or replace function public.registrar_venda(
  p_produto_id uuid,
  p_quantidade integer
)
returns void
language sql
security definer
set search_path = public
as $$
  select public.registrar_venda_com_pessoa(p_produto_id, p_quantidade);
$$;

revoke all on function public.registrar_venda_com_pessoa(uuid, integer, uuid, text) from public;
grant execute on function public.registrar_venda_com_pessoa(uuid, integer, uuid, text) to authenticated;
revoke all on function public.registrar_venda(uuid, integer) from public;
grant execute on function public.registrar_venda(uuid, integer) to authenticated;

-- -----------------------------------------------------
-- Reposição atômica: grava a entrada e aumenta o estoque em
-- uma única transação. Operador pode repor, mas não altera
-- cadastro de produtos diretamente (a RLS bloqueia o acesso).
-- -----------------------------------------------------
create or replace function public.registrar_entrada(
  p_produto_id uuid,
  p_quantidade integer,
  p_observacao text default null,
  p_fornecedor text default null,
  p_lote text default null,
  p_data_validade date default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org uuid;
  v_nome text;
  v_qtd integer;
begin
  if coalesce(public.papel_atual(), '') not in ('admin', 'gerente', 'operador') then
    raise exception 'Sem permissão para registrar entradas.';
  end if;
  if p_quantidade is null or p_quantidade <= 0 then
    raise exception 'Quantidade inválida.';
  end if;

  v_qtd := p_quantidade;
  v_org := public.organizacao_atual();

  select nome into v_nome
  from public.produtos
  where id = p_produto_id and organizacao_id = v_org
  for update;

  if not found then
    raise exception 'Produto não encontrado.';
  end if;

  insert into public.movimentacoes (
    organizacao_id, produto_id, produto_nome, tipo, quantidade, valor,
    observacao, fornecedor, lote, data_validade
  )
  values (
    v_org, p_produto_id, v_nome, 'entrada', v_qtd, 0,
    nullif(trim(coalesce(p_observacao, '')), ''),
    nullif(trim(coalesce(p_fornecedor, '')), ''),
    nullif(trim(coalesce(p_lote, '')), ''),
    p_data_validade
  );

  update public.produtos
  set quantidade = quantidade + v_qtd
  where id = p_produto_id and organizacao_id = v_org;
end;
$$;

revoke all on function public.registrar_entrada(uuid, integer, text, text, text, date) from public;
grant execute on function public.registrar_entrada(uuid, integer, text, text, text, date) to authenticated;

-- -----------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------
alter table public.organizacoes enable row level security;
alter table public.perfis enable row level security;
alter table public.produtos enable row level security;
alter table public.movimentacoes enable row level security;
alter table public.convites enable row level security;

drop policy if exists "organizacao do usuario" on public.organizacoes;
drop policy if exists "organizacao leitura" on public.organizacoes;
drop policy if exists "organizacao atualizacao" on public.organizacoes;
drop policy if exists "organizacao atualizacao admin" on public.organizacoes;

-- Leitura para todos os membros; alteração só para admin.
-- Sem política de DELETE: a organização não pode ser apagada pelo front
-- (evita cascade apagando perfis, produtos e movimentações).
create policy "organizacao leitura" on public.organizacoes
  for select to authenticated using (id = public.organizacao_atual());

create policy "organizacao atualizacao admin" on public.organizacoes
  for update to authenticated
  using (
    id = public.organizacao_atual()
    and public.papel_atual() = 'admin'
  )
  with check (
    id = public.organizacao_atual()
    and public.papel_atual() = 'admin'
  );

drop policy if exists "perfil proprio" on public.perfis;
drop policy if exists "perfis da organizacao" on public.perfis;

-- Operador vê só o próprio perfil; admin/gerente veem a organização.
create policy "perfil proprio" on public.perfis
  for select to authenticated
  using (
    id = auth.uid()
    or (
      public.papel_atual() in ('admin', 'gerente')
      and organizacao_id = public.organizacao_atual()
    )
  );

drop policy if exists "produtos da organizacao" on public.produtos;
drop policy if exists "produtos leitura" on public.produtos;
drop policy if exists "produtos gestao" on public.produtos;

-- Todos os membros leem o estoque. Só gestão altera o cadastro.
-- Vendas e reposições passam por RPC security definer.
create policy "produtos leitura" on public.produtos
  for select to authenticated
  using (organizacao_id = public.organizacao_atual());

create policy "produtos gestao" on public.produtos
  for all to authenticated
  using (
    organizacao_id = public.organizacao_atual()
    and public.papel_atual() in ('admin', 'gerente')
  )
  with check (
    organizacao_id = public.organizacao_atual()
    and public.papel_atual() in ('admin', 'gerente')
  );

drop policy if exists "movimentacoes da organizacao" on public.movimentacoes;
drop policy if exists "movimentacoes leitura" on public.movimentacoes;
drop policy if exists "movimentacoes gestao" on public.movimentacoes;

-- Relatório é leitura para todos; escrita só por RPC (venda/entrada).
create policy "movimentacoes leitura" on public.movimentacoes
  for select to authenticated
  using (organizacao_id = public.organizacao_atual());

create policy "movimentacoes gestao" on public.movimentacoes
  for all to authenticated
  using (
    organizacao_id = public.organizacao_atual()
    and public.papel_atual() in ('admin', 'gerente')
  )
  with check (
    organizacao_id = public.organizacao_atual()
    and public.papel_atual() in ('admin', 'gerente')
  );

-- Convites só aparecem para admin/gerente.
-- O convidado lê os dados do link apenas pela RPC detalhes_convite.
drop policy if exists "convites leitura" on public.convites;
drop policy if exists "convites criar" on public.convites;
drop policy if exists "convites cancelar" on public.convites;

create policy "convites leitura" on public.convites
  for select to authenticated
  using (
    organizacao_id = public.organizacao_atual()
    and public.papel_atual() in ('admin', 'gerente')
  );

create policy "convites criar" on public.convites
  for insert to authenticated
  with check (
    organizacao_id = public.organizacao_atual()
    and public.papel_atual() in ('admin', 'gerente')
  );

create policy "convites cancelar" on public.convites
  for update to authenticated
  using (
    organizacao_id = public.organizacao_atual()
    and public.papel_atual() in ('admin', 'gerente')
  )
  with check (
    organizacao_id = public.organizacao_atual()
    and public.papel_atual() in ('admin', 'gerente')
  );
