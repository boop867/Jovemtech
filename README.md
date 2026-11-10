# JovemTech — Lógica de Programação

Exercícios e pequenos projetos didáticos em JavaScript e TypeScript.

## Requisitos

- Node.js instalado
- npm (incluído com Node.js)
- Um terminal interativo para jogar Flappy Bird

## TypeScript: instalar, compilar e executar

Na raiz do repositório, instale as dependências:

```bash
npm install
```

Compile todos os exemplos TypeScript:

```bash
npm run build
```

Os arquivos JavaScript compilados são gerados em `dist/typescript/`. Para rodar cada exemplo:

```bash
npm run calculo
npm start       # demonstração de orientação a objetos (Mario)
npm run flappy  # jogo de terminal (Espaço pula; R reinicia; Ctrl+C sai)
```

`npm test` executa a compilação TypeScript como verificação básica.

## JavaScript

Execute os exercícios a partir da raiz:

```bash
node javascript/atividade_1.js
node javascript/atividade_2.js
node javascript/atividade_3.js
node javascript/jogo.js
node javascript/maior_idade.js
```

Abra `javascript/atividade.html` no navegador para testar a página interativa.

## Estrutura principal

- `javascript/` — exemplos e exercícios JavaScript
- `typescript/` — fontes TypeScript e configuração do compilador
- `dist/typescript/` — arquivos gerados durante a compilação; não edite manualmente

Há alguns arquivos TypeScript antigos na raiz mantidos por compatibilidade. A compilação usa como fonte oficial os arquivos em `typescript/`.
