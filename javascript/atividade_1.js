const readline = require('readline/promises');
const { stdin, stdout } = require('process');

// Lê números com validação para evitar resultados inesperados com entradas inválidas.
async function perguntarNumero(rl, mensagem, { inteiro = false } = {}) {
  while (true) {
    const resposta = (await rl.question(mensagem)).trim().replace(',', '.');
    const numero = inteiro ? Number(resposta) : Number(resposta);

    if (resposta !== '' && Number.isFinite(numero) && (!inteiro || Number.isInteger(numero))) {
      return numero;
    }

    console.log(`Digite um número ${inteiro ? 'inteiro' : 'válido'}.`);
  }
}

async function exercicio1(rl) {
  console.log('\n--- Exercício 1: Cálculo de idade ---');
  const ano = await perguntarNumero(rl, 'Informe o ano de nascimento: ', { inteiro: true });
  const anoAtual = new Date().getFullYear();
  console.log(`Idade aproximada: ${anoAtual - ano} anos.`);
}

async function exercicio2(rl) {
  console.log('\n--- Exercício 2: Antecessor e sucessor ---');
  const numero = await perguntarNumero(rl, 'Informe um número inteiro: ', { inteiro: true });
  console.log(`Número: ${numero} | Antecessor: ${numero - 1} | Sucessor: ${numero + 1}`);
}

async function exercicio3(rl) {
  console.log('\n--- Exercício 3: Cálculo salarial ---');
  const horas = await perguntarNumero(rl, 'Informe as horas trabalhadas: ');
  const valorHora = 51.90;
  console.log(`Salário total: R$ ${(horas * valorHora).toFixed(2)}`);
}

async function exercicio4(rl) {
  console.log('\n--- Exercício 4: Desconto de 15% ---');
  const nome = (await rl.question('Informe o nome do cliente: ')).trim();
  const compra = await perguntarNumero(rl, 'Informe o valor da compra (R$): ');
  console.log(`Cliente: ${nome || '(não informado)'}`);
  console.log(`Total com desconto: R$ ${(compra * 0.85).toFixed(2)}`);
}

async function exercicio5(rl) {
  console.log('\n--- Exercício 5: Média escolar ---');
  const notas = [];
  for (let i = 1; i <= 3; i++) {
    notas.push(await perguntarNumero(rl, `Informe a nota ${i}: `));
  }
  const media = notas.reduce((soma, nota) => soma + nota, 0) / notas.length;
  console.log(`Média: ${media.toFixed(2)} — ${media >= 7 ? 'Aprovado!' : 'Não aprovado.'}`);
}

async function exercicio6(rl) {
  console.log('\n--- Exercício 6: Situação por idade ---');
  const idade = await perguntarNumero(rl, 'Informe a idade: ', { inteiro: true });
  console.log(idade >= 60 ? 'Situação: Aposentado' : 'Situação: Trabalho formal');
}

async function exercicio7(rl) {
  console.log('\n--- Exercício 7: Desconto condicional ---');
  const total = await perguntarNumero(rl, 'Informe o valor da compra (R$): ');
  const temCartao = (await rl.question('Possui cartão fidelidade? (SIM/NAO): ')).trim().toUpperCase();
  const desconto = temCartao === 'SIM' || total > 500;
  console.log(desconto
    ? `Desconto aplicado. Valor final: R$ ${(total * 0.8).toFixed(2)}`
    : `Sem desconto. Valor final: R$ ${total.toFixed(2)}`);
}

async function exercicio8(rl) {
  console.log('\n--- Exercício 8: Seleção de estagiários ---');
  const cursando = (await rl.question('Está cursando o ensino médio? (SIM/NAO): ')).trim().toUpperCase();
  const idade = await perguntarNumero(rl, 'Informe a idade do candidato: ', { inteiro: true });
  console.log(cursando === 'SIM' && idade < 18
    ? 'Aprovado para a próxima fase.'
    : 'Não atende aos critérios.');
}

const exercicios = {
  '1': exercicio1, '2': exercicio2, '3': exercicio3, '4': exercicio4,
  '5': exercicio5, '6': exercicio6, '7': exercicio7, '8': exercicio8
};

async function main() {
  const rl = readline.createInterface({ input: stdin, output: stdout });
  try {
    while (true) {
      console.log('\n=== MENU DE EXERCÍCIOS ===');
      console.log('1. Calcular idade\n2. Antecessor e sucessor\n3. Cálculo salarial\n4. Desconto de 15%');
      console.log('5. Média escolar\n6. Situação por idade\n7. Desconto promocional\n8. Seleção de estagiários\n0. Sair');
      const opcao = (await rl.question('Escolha uma opção (0-8): ')).trim();
      if (opcao === '0') break;
      if (exercicios[opcao]) await exercicios[opcao](rl);
      else console.log('Opção inválida. Escolha um número de 0 a 8.');
    }
    console.log('Programa encerrado. Até logo!');
  } finally {
    rl.close();
  }
}

main().catch((erro) => {
  console.error('Não foi possível executar a lista:', erro);
  process.exitCode = 1;
});
