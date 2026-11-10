/*
  JovemTech - Lógica de Programação
  LISTA DE ATIVIDADES 3: Exercícios Práticos - Vetores
*/

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query) => {
  return new Promise((resolve) => rl.question(query, resolve));
};

async function main() {
  console.log("==================================================");
  console.log("   RESOLUÇÃO DA LISTA DE ATIVIDADES 3 - VETORES   ");
  console.log("==================================================\n");

  console.log("--- Questão 1: Quantidade de Ferraduras ---");
  const qtdCavalosInput = await askQuestion("Digite a quantidade de cavalos comprados: ");
  const qtdCavalos = parseInt(qtdCavalosInput) || 0;
  const totalFerraduras = qtdCavalos * 4;
  console.log(`Para ${qtdCavalos} cavalo(s), serão necessárias ${totalFerraduras} ferraduras.\n`);

  console.log("--- Questão 2: Sexta Parte de um Número ---");
  const numRealInput = await askQuestion("Digite um número real: ");
  const numReal = parseFloat(numRealInput) || 0;
  const sextaParte = numReal / 6;
  console.log(`A sexta parte de ${numReal} é: ${sextaParte.toFixed(4)}\n`);

  console.log("--- Questão 3: Área do Triângulo Retângulo ---");
  const baseInput = await askQuestion("Digite o valor da base (cateto 1): ");
  const alturaInput = await askQuestion("Digite o valor da altura (cateto 2): ");
  const base = parseFloat(baseInput) || 0;
  const altura = parseFloat(alturaInput) || 0;
  const areaTriangulo = (base * altura) / 2;
  console.log(`A área do triângulo retângulo é: ${areaTriangulo.toFixed(2)}\n`);

  console.log("--- Questão 4: Buscar Número no Vetor ---");
  const vetorQ4 = [15, 28, 42, 7, 99, 53, 10, 84, 23, 61];
  console.log(`Vetor cadastrado: [${vetorQ4.join(', ')}]`);
  const numBuscaInput = await askQuestion("Digite um número para buscar no vetor: ");
  const numBusca = parseInt(numBuscaInput);

  const posicoesEncontradasQ4 = [];
  for (let i = 0; i < vetorQ4.length; i++) {
    if (vetorQ4[i] === numBusca) {
      posicoesEncontradasQ4.push(i);
    }
  }

  if (posicoesEncontradasQ4.length > 0) {
    console.log(`O número ${numBusca} foi encontrado no vetor na(s) posição(ões) (índice): ${posicoesEncontradasQ4.join(', ')}\n`);
  } else {
    console.log(`O número ${numBusca} NÃO existe no vetor.\n`);
  }

  console.log("--- Questão 5: Fábrica de Refrigerantes Meia-Cola ---");
  const qtdLataInput = await askQuestion("Digite a quantidade de latas de 350ml: ");
  const qtdGarrafa600Input = await askQuestion("Digite a quantidade de garrafas de 600ml: ");
  const qtdGarrafa2LInput = await askQuestion("Digite a quantidade de garrafas de 2L: ");

  const qtdLata = parseInt(qtdLataInput) || 0;
  const qtdGarrafa600 = parseInt(qtdGarrafa600Input) || 0;
  const qtdGarrafa2L = parseInt(qtdGarrafa2LInput) || 0;

  const totalLitros = (qtdLata * 0.35) + (qtdGarrafa600 * 0.6) + (qtdGarrafa2L * 2.0);
  console.log(`O comerciante comprou um total de ${totalLitros.toFixed(2)} litros de refrigerante.\n`);

  console.log("--- Questão 6: Vetor de 15 Números e Múltiplos de 10 ---");
  const vetorQ6 = [];
  console.log("Digite 15 números inteiros:");
  for (let i = 0; i < 15; i++) {
    const valInput = await askQuestion(`Número ${i + 1}/15: `);
    vetorQ6.push(parseInt(valInput) || 0);
  }

  console.log(`\nVetor completo digitado: [${vetorQ6.join(', ')}]`);
  console.log("Múltiplos de 10 encontrados:");
  let achouMultiplo10 = false;
  for (let i = 0; i < vetorQ6.length; i++) {
    if (vetorQ6[i] % 10 === 0) {
      console.log(` -> Valor ${vetorQ6[i]} digitado na posição (índice) ${i}`);
      achouMultiplo10 = true;
    }
  }
  if (!achouMultiplo10) {
    console.log("Nenhum múltiplo de 10 foi digitado.");
  }
  console.log("");

  console.log("--- Questão 7: Números Pares e Suas Posições ---");
  const vetorQ7 = [];
  console.log("Digite 10 números inteiros:");
  for (let i = 0; i < 10; i++) {
    const valInput = await askQuestion(`Número ${i + 1}/10: `);
    vetorQ7.push(parseInt(valInput) || 0);
  }

  console.log("\nNúmeros pares digitados e suas posições:");
  let achouPar = false;
  for (let i = 0; i < vetorQ7.length; i++) {
    if (vetorQ7[i] % 2 === 0) {
      console.log(` -> Número par ${vetorQ7[i]} na posição (índice) ${i}`);
      achouPar = true;
    }
  }
  if (!achouPar) {
    console.log("Nenhum número par foi digitado.");
  }
  console.log("");

  console.log("--- Questão 8: Análise de Idade de 8 Pessoas ---");
  const idades = [];
  console.log("Digite a idade de 8 pessoas:");
  for (let i = 0; i < 8; i++) {
    const idadeInput = await askQuestion(`Idade da pessoa ${i + 1}/8: `);
    idades.push(parseInt(idadeInput) || 0);
  }

  const somaIdades = idades.reduce((acc, curr) => acc + curr, 0);
  const mediaIdade = somaIdades / idades.length;

  const posicoesMais25 = [];
  for (let i = 0; i < idades.length; i++) {
    if (idades[i] > 25) {
      posicoesMais25.push(i);
    }
  }

  const maiorIdade = Math.max(...idades);

  const posicoesMaiorIdade = [];
  for (let i = 0; i < idades.length; i++) {
    if (idades[i] === maiorIdade) {
      posicoesMaiorIdade.push(i);
    }
  }

  console.log("\n--- RESULTADOS DA QUESTÃO 8 ---");
  console.log(`a) Média de idade das pessoas cadastradas: ${mediaIdade.toFixed(2)} anos`);

  if (posicoesMais25.length > 0) {
    console.log(`b) Pessoas com mais de 25 anos estão nas posições (índices): ${posicoesMais25.join(', ')}`);
  } else {
    console.log("b) Não há pessoas com mais de 25 anos cadastradas.");
  }

  console.log(`c) Maior idade digitada: ${maiorIdade} anos`);
  console.log(`d) Posições onde a maior idade foi digitada (índices): ${posicoesMaiorIdade.join(', ')}\n`);

  console.log("==================================================");
  console.log("           FIM DA EXECUÇÃO DAS QUESTÕES           ");
  console.log("==================================================");

  rl.close();
}

main();
