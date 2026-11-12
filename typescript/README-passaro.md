# Jogo do Pássaro em TypeScript

Jogo de terminal inspirado em Flappy Bird. O personagem pula automaticamente ao pressionar a tecla de espaço, evita o cano e tenta alcançar a maior pontuação possível.

## Requisitos

- Node.js e npm instalados
- Terminal interativo para leitura de teclas

## Como executar

Na raiz do repositório:

```bash
npm install
npx tsc -p .
node .\dist\passaro.js
```

Também é possível usar:

```bash
npm run passaro
```

## Controles

- **Espaço**: pular
- **R**: reiniciar após game over
- **Ctrl+C**: sair do jogo

## Arquivo-fonte

[`../passaro.ts`](../passaro.ts)
