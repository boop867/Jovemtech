# JovemTech - Lógica de Programação

Repositório com exercícios práticos de lógica de programação em JavaScript e TypeScript, além de pequenos jogos para navegador e terminal.

## Conteúdo

### JavaScript
- `atividade.html` — página com funções básicas de JavaScript
- `atividade_1.js` — exercícios de lógica e estruturas condicionais
- `atividade_2.js` — exemplos de laços `for`, `while` e `do...while`
- `atividade_3.js` — exercícios com vetores e manipulação de dados
- `jogo.js` — jogo da memória das cores no terminal
- `maior_idade.js` — exemplo de média escolar, arrays e condicionais

### TypeScript
- `calculo.ts` — tipos, função de soma e saída no console
- `flappy.ts` — jogo inspirado em Flappy Bird para terminal, com entrada pelo teclado
- `mario.ts` — exemplo de orientação a objetos com interfaces, classes abstratas, herança, encapsulamento e polimorfismo
- `tsconfig.json` — configuração de compilação do TypeScript

## Requisitos

- Node.js e npm instalados
- Para jogar `flappy.ts`, use um terminal interativo que suporte entrada pelo teclado

## Como executar

### Página HTML
Abra `atividade.html` em um navegador.

### Exercícios JavaScript
Execute na raiz do projeto:

```bash
node atividade_1.js
node atividade_2.js
node atividade_3.js
node jogo.js
node maior_idade.js
```

### Arquivos TypeScript
Instale as dependências e compile os arquivos:

```bash
npm install
npm run build
```

Os arquivos compilados serão gerados na pasta `dist/`. Depois, execute-os com:

```bash
node dist/calculo.js
node dist/mario.js
node dist/flappy.js
```

Atalhos para iniciar os jogos (compilam antes de executar):

```bash
npm start       # Mario
npm run flappy  # Flappy Bird
```

## Objetivo

Praticar conceitos iniciais de programação, incluindo variáveis, operadores, condicionais, laços de repetição, arrays, funções, tipagem e programação orientada a objetos.
