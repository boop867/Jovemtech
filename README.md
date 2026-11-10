# JovemTech - Lógica de Programação

Este repositório reúne exercícios práticos de lógica de programação em JavaScript e TypeScript, além de pequenos projetos e jogos no terminal.

## Estrutura do projeto

- `javascript/` — exercícios e projetos em JavaScript
- `typescript/` — exemplos em TypeScript e projetos orientados a objetos
- `dist/` — arquivos compilados pelo TypeScript

## Conteúdo

### JavaScript
- `javascript/atividade.html` — página HTML com funções básicas em JavaScript
- `javascript/atividade_1.js` — exercícios com condicionais
- `javascript/atividade_2.js` — laços de repetição (`for`, `while`, `do...while`)
- `javascript/atividade_3.js` — vetores e manipulação de dados
- `javascript/jogo.js` — jogo da memória das cores
- `javascript/maior_idade.js` — exemplo de notas, médias e condicionais

### TypeScript
- `typescript/calculo.ts` — introdução a tipos e funções
- `typescript/flappy.ts` — jogo estilo Flappy Bird no terminal
- `typescript/mario.ts` — exemplo de OO com encapsulamento e polimorfismo
- `typescript/tsconfig.json` — configuração do TypeScript

## Como executar

### JavaScript
No terminal, execute os arquivos da pasta `javascript/`:

```bash
node javascript/atividade_1.js
node javascript/atividade_2.js
node javascript/atividade_3.js
node javascript/jogo.js
node javascript/maior_idade.js
```

### TypeScript
Compile e rode os projetos em `typescript/`:

```bash
npm install
npm run build
node dist/calculo.js
node dist/mario.js
node dist/flappy.js
```

Também estão disponíveis atalhos:

```bash
npm start
npm run flappy
```

## Observações da revisão

- Corrigi pequenos problemas de organização e estrutura do projeto
- Removi uma atribuição redundante no jogo da memória
- Ajustei a entrada do teclado para evitar erros de tipo no projeto TypeScript
- Mantive os exercícios para que fiquem claros e fáceis de aprender

## Objetivo

Praticar lógica de programação, algoritmos básicos, estruturas de controle, arrays, orientação a objetos e desenvolvimento de jogos em terminal.
