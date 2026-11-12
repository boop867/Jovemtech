# JovemTech — Lógica de Programação

Exercícios e pequenos projetos didáticos em JavaScript e TypeScript.

## Requisitos

- Node.js instalado
- npm (incluído com Node.js)
- Terminal interativo para executar alguns jogos

## Instalação

Na raiz do repositório, execute:

```bash
npm install
```

## Compilar todos os arquivos TypeScript

```bash
npx tsc -p .
```

Os arquivos compilados são gerados na pasta `dist/`.

## Executar os projetos

```bash
node .\dist\calculo.js
node .\dist\mario.js
node .\dist\passaro.js
```

Também é possível usar os scripts do `package.json`:

```bash
npm run calculo
npm run start
npm run passaro
```

## Jogos e exemplos

- `calculo.ts` — exemplo básico de TypeScript com soma e tipos
- `mario.ts` — demonstração de POO com herança, encapsulamento e power-ups
- `passaro.ts` — jogo estilo Flappy Bird em terminal

## Estrutura principal

- `typescript/` — fontes TypeScript
- `dist/` — arquivos compilados gerados automaticamente
- `javascript/` — exercícios em JavaScript

## Observações

A execução do jogo do pássaro precisa de um terminal interativo. Use espaços para pular, `R` para reiniciar e `Ctrl+C` para sair.
