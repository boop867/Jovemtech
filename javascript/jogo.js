// Jogo da memória das cores — execute com: node javascript/jogo.js
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const perguntar = (texto) => new Promise((resolve) => rl.question(texto, resolve));

const TAMANHO = 4;
const CORES = [
  { nome: 'VERMELHO', cor: '\x1b[31m', simbolo: '●' },
  { nome: 'VERDE', cor: '\x1b[32m', simbolo: '●' },
  { nome: 'AMARELO', cor: '\x1b[33m', simbolo: '●' },
  { nome: 'AZUL', cor: '\x1b[34m', simbolo: '●' },
  { nome: 'MAGENTA', cor: '\x1b[35m', simbolo: '●' },
  { nome: 'CIANO', cor: '\x1b[36m', simbolo: '●' },
  { nome: 'BRANCO', cor: '\x1b[37m', simbolo: '●' },
  { nome: 'LARANJA', cor: '\x1b[33m', simbolo: '◆' }
];
const RESET = '\x1b[0m';

function embaralhar(cartas) {
  for (let i = cartas.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cartas[i], cartas[j]] = [cartas[j], cartas[i]];
  }
  return cartas;
}

function criarTabuleiro() {
  const cartas = embaralhar([...CORES, ...CORES]);
  return Array.from({ length: TAMANHO }, (_, linha) =>
    cartas.slice(linha * TAMANHO, (linha + 1) * TAMANHO)
  );
}

function converterPosicao(entrada) {
  const partes = entrada.trim().split(/\s+/).map(Number);
  if (partes.length !== 2 || !partes.every(Number.isInteger)) return null;
  const [linha, coluna] = partes.map((valor) => valor - 1);
  if (linha < 0 || linha >= TAMANHO || coluna < 0 || coluna >= TAMANHO) return null;
  return { linha, coluna };
}

function mostrarTabuleiro(tabuleiro, encontradas, temporarias = []) {
  console.log('\n========== JOGO DA MEMÓRIA ==========');
  console.log('       1       2       3       4');
  for (let linha = 0; linha < TAMANHO; linha++) {
    let saida = `${linha + 1}  `;
    for (let coluna = 0; coluna < TAMANHO; coluna++) {
      const carta = tabuleiro[linha][coluna];
      const visivel = encontradas[linha][coluna] || temporarias.some((p) => p.linha === linha && p.coluna === coluna);
      saida += visivel ? `[${carta.cor}${carta.simbolo} ${carta.nome}${RESET}] ` : '[   ?   ] ';
    }
    console.log(saida);
  }
}

async function escolherPosicao(tabuleiro, encontradas, numero, primeira = null) {
  while (true) {
    const entrada = await perguntar(`Posição da carta ${numero} (linha e coluna, ex.: 2 3): `);
    const posicao = converterPosicao(entrada);
    if (!posicao) {
      console.log('Posição inválida: informe dois números entre 1 e 4.');
      continue;
    }
    if (encontradas[posicao.linha][posicao.coluna]) {
      console.log('Essa carta já foi encontrada. Escolha outra.');
      continue;
    }
    if (primeira && primeira.linha === posicao.linha && primeira.coluna === posicao.coluna) {
      console.log('Escolha duas posições diferentes.');
      continue;
    }
    return posicao;
  }
}

async function jogar() {
  const tabuleiro = criarTabuleiro();
  const encontradas = Array.from({ length: TAMANHO }, () => Array(TAMANHO).fill(false));
  let pares = 0;
  let tentativas = 0;

  console.log('Bem-vindo ao jogo da memória das cores! Encontre os 8 pares.');
  console.log('Informe primeiro a linha e depois a coluna.');

  while (pares < CORES.length) {
    mostrarTabuleiro(tabuleiro, encontradas);
    const primeira = await escolherPosicao(tabuleiro, encontradas, 1);
    mostrarTabuleiro(tabuleiro, encontradas, [primeira]);
    const segunda = await escolherPosicao(tabuleiro, encontradas, 2, primeira);
    tentativas++;
    mostrarTabuleiro(tabuleiro, encontradas, [primeira, segunda]);

    const carta1 = tabuleiro[primeira.linha][primeira.coluna];
    const carta2 = tabuleiro[segunda.linha][segunda.coluna];
    if (carta1.nome === carta2.nome) {
      encontradas[primeira.linha][primeira.coluna] = true;
      encontradas[segunda.linha][segunda.coluna] = true;
      pares++;
      console.log(`Acertou! Par ${carta1.nome} encontrado.`);
    } else {
      console.log('As cartas não são iguais. Memorize as posições!');
      await perguntar('Pressione ENTER para continuar...');
    }
  }

  mostrarTabuleiro(tabuleiro, encontradas);
  console.log(`Parabéns! Você encontrou os 8 pares em ${tentativas} tentativas.`);
}

jogar()
  .catch((erro) => {
    console.error('Ocorreu um erro durante o jogo:', erro);
    process.exitCode = 1;
  })
  .finally(() => rl.close());
