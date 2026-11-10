# JovemTech — Lógica de Programação

Repositório de exercícios para praticar lógica, JavaScript, TypeScript e programação orientada a objetos.

## Estrutura

- `javascript/` — exemplos de JavaScript, exercícios de terminal e página HTML.
- `typescript/` — exemplos TypeScript e jogos de terminal.
- `dist/typescript/` — saída gerada pelo compilador; não edite manualmente.

Os arquivos correspondentes que ainda aparecem na raiz são versões antigas. Use os diretórios acima como fonte principal.

## JavaScript

Execute a partir da raiz do repositório:

```bash
node javascript/atividade_1.js
node javascript/atividade_2.js
node javascript/atividade_3.js
node javascript/jogo.js
node javascript/maior_idade.js
```

Abra `javascript/atividade.html` no navegador para testar a página interativa.

## TypeScript

Requer Node.js e npm. Instale as dependências e compile:

```bash
npm install
npm run build
```

Para executar os exemplos compilados:

```bash
npm run calculo
npm start       # demonstração de orientação a objetos (Mario)
npm run flappy  # jogo de terminal; use um terminal interativo
```

Os comandos TypeScript compilam os arquivos e geram JavaScript em `dist/typescript/`.

## O que os exercícios praticam

- entrada e validação de dados
- variáveis, operações e condicionais
- laços `for`, `while` e `do...while`
- arrays, busca e análise de dados
- funções e tipagem estática
- classes, interfaces, herança e polimorfismo

## Observação

Os valores e regras são exemplos didáticos. Por exemplo, o cálculo da idade considera apenas o ano de nascimento.
