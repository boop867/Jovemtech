# GESTLUX - Banco de Dados

Projeto de banco de dados para sistema de gestão (estoque, vendas, organizações e usuários) modelado com **BrModeloWeb** e implementado no **Supabase (PostgreSQL)**.

## Estrutura

- `schema.sql` — script completo com tabelas, funções, índices e políticas de Row Level Security (RLS)
- `Diagrama Conceitual BRMW.pdf` — modelo conceitual no BrModeloWeb
- `Diagrama Lógico BRMW.pdf` — modelo lógico no BrModeloWeb
- `diagramaSupabase.png` — diagrama visual do banco no Supabase
- `dadosProdutos.png` — exemplo de dados da tabela de produtos

## Tabelas principais

| Tabela | Descrição |
|--------|-----------|
| `organizacoes` | Cadastro de organizações/empresas |
| `perfis` | Usuários vinculados a uma organização |
| `produtos` | Catálogo de produtos com estoque |
| `movimentacoes` | Entradas, saídas e vendas de produtos |
| `convites` | Convites por link para ingressar em organizações |

## Links

- [Gestlux](https://gestlux.vercel.app)
- [BrModeloWeb - Diagrama Lógico](https://app.brmodeloweb.com/publicview/6afeec2a36aee6de5b5d29fd)
- [BrModeloWeb - Diagrama Conceitual](https://app.brmodeloweb.com/publicview/6aff3e6036aee6de5b5d39f4)

## Tecnologias

- PostgreSQL (via Supabase)
- Row Level Security (RLS)
- BrModeloWeb para modelagem
