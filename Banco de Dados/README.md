# Banco de Dados — GESTLUX

Esta pasta reúne os artefatos do banco de dados do projeto **GESTLUX**, desenvolvido no contexto do JovemTech.

O sistema usa **PostgreSQL no Supabase** para organizar empresas, usuários, produtos, estoque, vendas, reposições e convites.

## Arquivos

| Arquivo | Descrição |
|---|---|
| [`schema.sql`](./schema.sql) | Script completo de criação, migração, funções, permissões e políticas de segurança. |
| [`Diagrama Conceitual BRMW.pdf`](./Diagrama%20Conceitual%20BRMW.pdf) | Representação conceitual das principais entidades e seus relacionamentos. |
| [`Diagrama Lógico BRMW.pdf`](./Diagrama%20L%C3%B3gico%20BRMW.pdf) | Representação lógica com tabelas, campos e chaves do banco. |
| [`dadosProdutos.png`](./dadosProdutos.png) | Imagem com dados ou estrutura relacionada aos produtos. |
| [`diagramaSupabase.png`](./diagramaSupabase.png) | Visão gráfica do banco implementado no Supabase. |

## Tecnologias

- PostgreSQL
- Supabase
- SQL com PL/pgSQL
- Row Level Security — RLS
- Autenticação integrada do Supabase

## Estrutura principal

### `organizacoes`
Representa cada organização cadastrada no sistema.

Campos principais:

- `id`: identificador único da organização
- `nome`: nome da organização
- `segmento`: varejo, empresarial, educacional ou saúde
- `notificacoes`: indica se as notificações estão habilitadas
- `respostas`: respostas do processo de onboarding em JSON
- `modulos`: módulos disponibilizados para o segmento
- `criado_em`: data de criação

### `perfis`
Relaciona um usuário autenticado do Supabase a uma organização.

Campos principais:

- `id`: corresponde ao usuário em `auth.users`
- `organizacao_id`: organização à qual o usuário pertence
- `nome` e `email`
- `papel`: `admin`, `gerente` ou `operador`
- `criado_em`: data de criação

### `produtos`
Armazena os produtos e o estoque disponível.

Campos principais:

- `organizacao_id`: organização proprietária do produto
- `nome` e `sku`
- `preco` e `quantidade`
- `minimo`: quantidade mínima para alerta de estoque
- `tipo_produto`, `data_validade` e `nota_fiscal`
- `codigo_barras` e `fornecedor_padrao`

Dentro da mesma organização, o SKU é único.

### `movimentacoes`
Mantém o histórico de entradas, saídas e vendas.

Campos principais:

- `organizacao_id`
- `produto_id`
- `produto_nome`: nome preservado no histórico
- `tipo`: `entrada`, `saida` ou `venda`
- `quantidade` e `valor`
- `vendedor_id` e `vendedor_nome`
- `fornecedor`, `lote` e `data_validade`
- `observacao`
- `criado_em`

A exclusão de um produto não apaga seu histórico: `produto_id` passa a ser nulo e `produto_nome` mantém o nome utilizado no registro.

### `convites`
Controla convites para novos usuários.

Campos principais:

- `organizacao_id`
- `email` e `nome`
- `papel`: função atribuída ao usuário convidado
- `token`: identificador único do convite
- `status`: `pendente`, `aceito` ou `cancelado`
- `criado_em` e `aceito_em`

O sistema gera o link no painel. Nenhum e-mail é enviado automaticamente pelo banco.

## Relacionamentos

- Uma organização possui vários perfis, produtos, movimentações e convites.
- Um usuário autenticado possui um perfil associado a uma organização.
- Uma organização possui vários produtos.
- Um produto pode ter várias movimentações.
- Uma movimentação pode estar vinculada a um perfil de vendedor.
- Uma movimentação preserva o nome do produto, mesmo após sua exclusão.
- Um convite pertence a uma organização e pode originar um perfil após ser aceito.

## Funções principais

| Função | Finalidade |
|---|---|
| `criar_organizacao` | Cria a organização e o perfil administrador do usuário. |
| `salvar_onboarding` | Salva respostas e módulos escolhidos no onboarding. |
| `criar_convite` | Cria um convite para um novo usuário. |
| `detalhes_convite` | Consulta os dados públicos necessários para aceitar um convite. |
| `aceitar_convite` | Cria o perfil do usuário após validar o convite. |
| `atualizar_papel` | Permite que administradores alterem papéis. |
| `cancelar_convite` | Cancela um convite pendente. |
| `registrar_venda_com_pessoa` | Registra uma venda e baixa o estoque atomicamente. |
| `registrar_entrada` | Registra uma entrada e aumenta o estoque atomicamente. |

As funções críticas usam `SECURITY DEFINER` para controlar o contexto seguro da operação e evitar recursões nas políticas RLS.

## Perfis e permissões

- **Administrador:** gerencia organização, produtos, pessoas, convites e configurações.
- **Gerente:** gerencia produtos e convites, mas só pode convidar operadores.
- **Operador:** consulta produtos e relatórios e pode registrar entradas ou vendas.

As regras são reforçadas por políticas RLS e por funções RPC no próprio banco.

## Segurança

O script ativa Row Level Security nas tabelas principais:

- usuários somente acessam dados da própria organização;
- operadores têm leitura limitada ao necessário;
- administradores e gerentes possuem permissões ampliadas;
- convites são visíveis apenas a administradores e gerentes;
- vendas e reposições são executadas por funções controladas;
- nenhuma chave de serviço é usada no navegador.

## Como instalar

1. Abra o projeto no [Supabase](https://supabase.com).
2. Acesse **SQL Editor**.
3. Abra o arquivo [`schema.sql`](./schema.sql).
4. Execute todo o conteúdo no projeto.
5. Confirme a criação das tabelas, funções e políticas RLS.

O script foi preparado para ser seguro para execução repetida por meio de verificações, migrações condicionais e substituição das funções.

## Observações

- O banco utiliza UUIDs como identificadores principais.
- Os dados são separados por organização, permitindo uso de múltiplas empresas na mesma base.
- O histórico de movimentações é protegido contra perda de nomes de produtos e vendedores.
- O arquivo SQL é a referência mais atualizada da implementação realizada no Supabase.
