/*
  JovemTech - Lógica de Programação
  LISTA DE ATIVIDADES 2: Exercícios Práticos - Laços de Repetição
*/

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query) => {
  return new Promise((resolve) => rl.question(query, resolve));
};

async function executarLista2() {
  console.log("==================================================");
  console.log("   RESOLUÇÃO DA LISTA DE ATIVIDADES 2 - LAÇOS    ");
  console.log("==================================================\n");

  console.log("=== SEÇÃO 1: LAÇO PARA (for) ===\n");

  console.log("--- Questão 1 (PARA): Números pares de 2 até 100 ---");
  const pares = [];
  for (let i = 2; i <= 100; i += 2) {
    pares.push(i);
  }
  console.log(pares.join(", ") + "\n");

  console.log("--- Questão 2 (PARA): Tabuada do 7 ---");
  for (let i = 1; i <= 10; i++) {
    console.log(`7 x ${i} = ${7 * i}`);
  }
  console.log("");

  console.log("--- Questão 3 (PARA): Soma dos números de 1 a 20 ---");
  let soma1a20 = 0;
  for (let i = 1; i <= 20; i++) {
    soma1a20 += i;
  }
  console.log(`A soma dos números de 1 a 20 é: ${soma1a20}\n`);

  console.log("--- Questão 4 (PARA): Números ímpares de 1 a 99 ---");
  const impares = [];
  for (let i = 1; i < 100; i += 2) {
    impares.push(i);
  }
  console.log(impares.join(", ") + "\n");

  console.log("=== SEÇÃO 2: LAÇO ENQUANTO (while) ===\n");

  console.log("--- Questão 1 (ENQUANTO): Ler números enquanto positivo ---");
  let numPositivo = parseFloat(await askQuestion("Digite um número (negativo para parar): "));
  while (numPositivo >= 0) {
    console.log(`Você digitou o número positivo: ${numPositivo}`);
    numPositivo = parseFloat(await askQuestion("Digite outro número (negativo para parar): "));
  }
  console.log("Número negativo digitado. Encerrado!\n");

  console.log("--- Questão 2 (ENQUANTO): Pares menores que N ---");
  const limiteN = parseInt(await askQuestion("Digite um número inteiro: "));
  console.log(`Números pares menores que ${limiteN}:`);
  let contadorPar = 2;
  while (contadorPar < limiteN) {
    console.log(contadorPar);
    contadorPar += 2;
  }
  console.log("");

  console.log("--- Questão 3 (ENQUANTO): Ler valores enquanto soma < 100 ---");
  let somaAcumulada = 0;
  while (somaAcumulada < 100) {
    const valor = parseFloat(await askQuestion(`Soma atual: ${somaAcumulada}. Digite um valor a somar: `));
    somaAcumulada += valor;
  }
  console.log(`Soma atingiu ou ultrapassou 100! Soma final: ${somaAcumulada}\n`);

  console.log("--- Questão 4 (ENQUANTO): Números de 10 até 1 ---");
  let regressivo = 10;
  while (regressivo >= 1) {
    console.log(regressivo);
    regressivo--;
  }
  console.log("");

  console.log("=== SEÇÃO 3: LAÇO REPITA (do...while) ===\n");

  console.log("--- Questão 1 (REPITA): Menu interativo ---");
  let opcaoMenu;
  do {
    console.log("===== MENU =====");
    console.log("1 - Opção A");
    console.log("2 - Opção B");
    console.log("0 - Sair");
    opcaoMenu = await askQuestion("Escolha uma opção: ");

    if (opcaoMenu === '1') {
      console.log("Você escolheu a Opção A!\n");
    } else if (opcaoMenu === '2') {
      console.log("Você escolheu a Opção B!\n");
    } else if (opcaoMenu !== '0') {
      console.log("Opção inválida! Tente novamente.\n");
    }
  } while (opcaoMenu !== '0');
  console.log("Saindo do menu...\n");

  console.log("--- Questão 2 (REPITA): Repetir até múltiplo de 5 ---");
  let numMult5;
  do {
    numMult5 = parseInt(await askQuestion("Digite um número (para se for múltiplo de 5): "));
  } while (numMult5 % 5 !== 0);
  console.log(`O número ${numMult5} é múltiplo de 5! Encerrado.\n`);

  console.log("--- Questão 3 (REPITA): Ler notas até decidir parar ---");
  let continuarNotas;
  const notasAlunos = [];
  do {
    const nota = parseFloat(await askQuestion("Digite a nota do aluno: "));
    notasAlunos.push(nota);
    continuarNotas = await askQuestion("Deseja cadastrar outra nota? (s/n): ");
  } while (continuarNotas.toLowerCase() === 's');
  console.log(`Notas cadastradas: [${notasAlunos.join(', ')}]\n`);

  console.log("--- Questão 4 (REPITA): Ler positivos até digitar 0 ---");
  let numPos;
  do {
    numPos = parseFloat(await askQuestion("Digite um número positivo (ou 0 para parar): "));
    if (numPos > 0) {
      console.log(`Número aceito: ${numPos}`);
    }
  } while (numPos !== 0);
  console.log("Zero digitado! Programa finalizado.\n");

  console.log("==================================================");
  console.log("           FIM DA EXECUÇÃO DA LISTA 2             ");
  console.log("==================================================");

  rl.close();
}

executarLista2();
