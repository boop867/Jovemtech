const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const perguntar = (texto) => new Promise((resolve) => rl.question(texto, resolve));

async function numeroValido(texto, inteiro = false) {
  while (true) {
    const resposta = (await perguntar(texto)).trim().replace(',', '.');
    const numero = Number(resposta);
    if (resposta !== '' && Number.isFinite(numero) && (!inteiro || Number.isInteger(numero))) return numero;
    console.log(`Entrada inválida. Digite um número ${inteiro ? 'inteiro' : 'válido'}.`);
  }
}

async function executarLista2() {
  console.log('=== Lista de atividades 2: laços de repetição ===\n');

  console.log('--- PARA 1: números pares de 2 a 100 ---');
  const pares = [];
  for (let numero = 2; numero <= 100; numero += 2) pares.push(numero);
  console.log(pares.join(', '));

  console.log('\n--- PARA 2: tabuada do 7 ---');
  for (let numero = 1; numero <= 10; numero++) console.log(`7 x ${numero} = ${7 * numero}`);

  console.log('\n--- PARA 3: soma de 1 a 20 ---');
  let soma = 0;
  for (let numero = 1; numero <= 20; numero++) soma += numero;
  console.log(`Resultado: ${soma}`);

  console.log('\n--- PARA 4: números ímpares de 1 a 99 ---');
  const impares = [];
  for (let numero = 1; numero < 100; numero += 2) impares.push(numero);
  console.log(impares.join(', '));

  console.log('\n--- ENQUANTO 1: ler até digitar um número negativo ---');
  let numero = await numeroValido('Digite um número (negativo para parar): ');
  while (numero >= 0) {
    console.log(`Número informado: ${numero}`);
    numero = await numeroValido('Digite outro número (negativo para parar): ');
  }

  console.log('\n--- ENQUANTO 2: números pares menores que N ---');
  const limite = await numeroValido('Digite um número inteiro: ', true);
  const paresMenores = [];
  for (let par = 2; par < limite; par += 2) paresMenores.push(par);
  console.log(paresMenores.length ? paresMenores.join(', ') : 'Não há pares positivos menores que esse limite.');

  console.log('\n--- ENQUANTO 3: somar valores até atingir 100 ---');
  soma = 0;
  while (soma < 100) {
    soma += await numeroValido(`Soma atual: ${soma}. Digite um valor: `);
  }
  console.log(`Soma final: ${soma}`);

  console.log('\n--- ENQUANTO 4: contagem regressiva ---');
  let contagem = 10;
  while (contagem >= 1) console.log(contagem--);

  console.log('\n--- REPITA 1: menu interativo ---');
  let opcao;
  do {
    console.log('1 - Opção A | 2 - Opção B | 0 - Sair');
    opcao = (await perguntar('Escolha uma opção: ')).trim();
    if (opcao === '1') console.log('Você escolheu a Opção A.');
    else if (opcao === '2') console.log('Você escolheu a Opção B.');
    else if (opcao !== '0') console.log('Opção inválida.');
  } while (opcao !== '0');

  console.log('\n--- REPITA 2: encontrar múltiplo de 5 ---');
  let multiplo;
  do {
    multiplo = await numeroValido('Digite um número inteiro múltiplo de 5: ', true);
    if (multiplo % 5 !== 0) console.log('Esse número não é múltiplo de 5. Tente novamente.');
  } while (multiplo % 5 !== 0);
  console.log(`${multiplo} é múltiplo de 5.`);

  console.log('\n--- REPITA 3: cadastrar notas ---');
  const notas = [];
  let continuar;
  do {
    notas.push(await numeroValido('Digite a nota: '));
    continuar = (await perguntar('Deseja cadastrar outra nota? (s/n): ')).trim().toLowerCase();
  } while (continuar === 's');
  console.log(`Notas cadastradas: ${notas.join(', ')}`);

  console.log('\n--- REPITA 4: ler números até digitar zero ---');
  let valor;
  do {
    valor = await numeroValido('Digite um número positivo (0 para parar): ');
    if (valor > 0) console.log(`Número aceito: ${valor}`);
    else if (valor < 0) console.log('O número deve ser positivo ou zero.');
  } while (valor !== 0);

  console.log('\nFim da lista de atividades 2.');
}

executarLista2()
  .catch((erro) => {
    console.error('Não foi possível executar a lista:', erro);
    process.exitCode = 1;
  })
  .finally(() => rl.close());
