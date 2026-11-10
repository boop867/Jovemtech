const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const perguntar = (texto) => new Promise((resolve) => rl.question(texto, resolve));

async function numeroValido(texto, { inteiro = false, minimo = -Infinity } = {}) {
  while (true) {
    const resposta = (await perguntar(texto)).trim().replace(',', '.');
    const numero = Number(resposta);
    if (resposta !== '' && Number.isFinite(numero) && (!inteiro || Number.isInteger(numero)) && numero >= minimo) {
      return numero;
    }
    console.log(`Entrada inválida. Informe um número ${inteiro ? 'inteiro' : 'válido'}${minimo >= 0 ? ' não negativo' : ''}.`);
  }
}

async function lerVetor(tamanho, rotulo) {
  const valores = [];
  console.log(`Digite ${tamanho} ${rotulo}:`);
  for (let i = 0; i < tamanho; i++) {
    valores.push(await numeroValido(`${i + 1}/${tamanho}: `, { inteiro: true }));
  }
  return valores;
}

async function main() {
  console.log('=== Lista de atividades 3: vetores e cálculos ===\n');

  console.log('--- Questão 1: ferraduras ---');
  const cavalos = await numeroValido('Quantidade de cavalos: ', { inteiro: true, minimo: 0 });
  console.log(`São necessárias ${cavalos * 4} ferraduras.\n`);

  console.log('--- Questão 2: sexta parte ---');
  const numeroReal = await numeroValido('Digite um número real: ');
  console.log(`A sexta parte é ${(numeroReal / 6).toFixed(4)}.\n`);

  console.log('--- Questão 3: área de triângulo retângulo ---');
  const base = await numeroValido('Base: ', { minimo: 0 });
  const altura = await numeroValido('Altura: ', { minimo: 0 });
  console.log(`Área: ${((base * altura) / 2).toFixed(2)}.\n`);

  console.log('--- Questão 4: busca no vetor ---');
  const vetorBusca = [15, 28, 42, 7, 99, 53, 10, 84, 23, 61];
  console.log(`Vetor: [${vetorBusca.join(', ')}]`);
  const procurado = await numeroValido('Número inteiro a buscar: ', { inteiro: true });
  const indices = vetorBusca.flatMap((valor, indice) => valor === procurado ? [indice] : []);
  console.log(indices.length ? `Encontrado no(s) índice(s): ${indices.join(', ')}.` : 'Número não encontrado.');

  console.log('\n--- Questão 5: volume de refrigerante ---');
  const latas = await numeroValido('Latas de 350 ml: ', { inteiro: true, minimo: 0 });
  const garrafas600 = await numeroValido('Garrafas de 600 ml: ', { inteiro: true, minimo: 0 });
  const garrafas2L = await numeroValido('Garrafas de 2 L: ', { inteiro: true, minimo: 0 });
  const litros = latas * 0.35 + garrafas600 * 0.6 + garrafas2L * 2;
  console.log(`Volume total: ${litros.toFixed(2)} L.`);

  console.log('\n--- Questão 6: múltiplos de 10 ---');
  const vetor15 = await lerVetor(15, 'números inteiros');
  const multiplos10 = vetor15.flatMap((valor, indice) => valor % 10 === 0 ? [`${valor} (índice ${indice})`] : []);
  console.log(multiplos10.length ? multiplos10.join('\n') : 'Nenhum múltiplo de 10 foi informado.');

  console.log('\n--- Questão 7: números pares ---');
  const vetor10 = await lerVetor(10, 'números inteiros');
  const pares = vetor10.flatMap((valor, indice) => valor % 2 === 0 ? [`${valor} (índice ${indice})`] : []);
  console.log(pares.length ? pares.join('\n') : 'Nenhum número par foi informado.');

  console.log('\n--- Questão 8: análise de idades ---');
  const idades = await lerVetor(8, 'idades inteiras não negativas');
  const media = idades.reduce((soma, idade) => soma + idade, 0) / idades.length;
  const maiores25 = idades.flatMap((idade, indice) => idade > 25 ? [indice] : []);
  const maiorIdade = Math.max(...idades);
  const indicesMaior = idades.flatMap((idade, indice) => idade === maiorIdade ? [indice] : []);
  console.log(`Média de idade: ${media.toFixed(2)} anos.`);
  console.log(maiores25.length ? `Índices com idade acima de 25: ${maiores25.join(', ')}.` : 'Ninguém tem mais de 25 anos.');
  console.log(`Maior idade: ${maiorIdade} anos; índice(s): ${indicesMaior.join(', ')}.`);
}

main()
  .catch((erro) => {
    console.error('Não foi possível executar a lista:', erro);
    process.exitCode = 1;
  })
  .finally(() => rl.close());
