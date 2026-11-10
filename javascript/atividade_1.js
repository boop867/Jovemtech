const readline = require('readline/promises');

/*
    JovemTech - Lógica de Programação
    LISTA DE ATIVIDADES 1: Exercícios Práticos
*/

const { stdin: input, stdout: output } = require('process');

async function exercicio1(rl) {
    console.log("\n--- Exercício 1: Cálculo de Idade ---");
    const anoNascimento = parseInt(await rl.question("Informe o ano de nascimento: "));
    const anoAtual = new Date().getFullYear();
    const idade = anoAtual - anoNascimento;
    console.log(`-> Sua idade é: ${idade} anos.`);
}

async function exercicio2(rl) {
    console.log("\n--- Exercício 2: Antecessor e Sucessor ---");
    const numero = parseInt(await rl.question("Informe um número inteiro: "));
    console.log(`-> Número: ${numero} | Antecessor: ${numero - 1} | Sucessor: ${numero + 1}`);
}

async function exercicio3(rl) {
    console.log("\n--- Exercício 3: Cálculo Salarial ---");
    const horasTrabalhadas = parseFloat(await rl.question("Informe o número de horas trabalhadas: "));
    const valorHora = 51.90;
    const salario = horasTrabalhadas * valorHora;
    console.log(`-> O salário total é: R$ ${salario.toFixed(2)}`);
}

async function exercicio4(rl) {
    console.log("\n--- Exercício 4: Desconto de 15% ---");
    const nomeCliente = await rl.question("Informe o nome do cliente: ");
    const valorCompra = parseFloat(await rl.question("Informe o valor total da compra (R$): "));
    const valorComDesconto = valorCompra * 0.85;
    console.log(`-> Cliente: ${nomeCliente}`);
    console.log(`-> Valor total com 15% de desconto: R$ ${valorComDesconto.toFixed(2)}`);
}

async function exercicio5(rl) {
    console.log("\n=== Exercício 5: Média Escolar ===");
    const nota1 = parseFloat(await rl.question("Informe a primeira nota: "));
    const nota2 = parseFloat(await rl.question("Informe a segunda nota: "));
    const nota3 = parseFloat(await rl.question("Informe a terceira nota: "));
    const media = (nota1 + nota2 + nota3) / 3;

    if (media >= 7) {
        console.log(`-> Média: ${media.toFixed(2)} - Aprovado!`);
    } else {
        console.log(`-> Média: ${media.toFixed(2)} - Não aprovado.`);
    }
}

async function exercicio6(rl) {
    console.log("\n--- Exercício 6: Situação por Idade ---");
    const idadePessoa = parseInt(await rl.question("Informe a idade: "));

    if (idadePessoa >= 60) {
        console.log("-> Situação: Aposentado");
    } else {
        console.log("-> Situação: Trabalho Formal");
    }
}

async function exercicio7(rl) {
    console.log("\n--- Exercício 7: Desconto Condicional ---");
    const valorTotal = parseFloat(await rl.question("Informe o valor total da compra (R$): "));
    const cartaoFidelidade = (await rl.question("Possui cartão fidelidade? (SIM/NAO): ")).trim().toUpperCase();

    if (cartaoFidelidade === "SIM" || valorTotal > 500.00) {
        const valorComDesconto = valorTotal * 0.80;
        console.log(`-> Desconto aplicado! Valor final: R$ ${valorComDesconto.toFixed(2)}`);
    } else {
        console.log(`-> Nenhum desconto. Valor final: R$ ${valorTotal.toFixed(2)}`);
    }
}

async function exercicio8(rl) {
    console.log("\n--- Exercício 8: Seleção de Estagiários ---");
    const cursandoEnsinoMedio = (await rl.question("Está cursando o ensino médio? (SIM/NAO): ")).trim().toUpperCase();
    const idadeCandidato = parseInt(await rl.question("Informe a idade do candidato: "));

    if (cursandoEnsinoMedio === "SIM" && idadeCandidato < 18) {
        console.log("-> Status: Aprovado para próxima fase");
    } else {
        console.log("-> Status: Não atende aos critérios");
    }
}

async function main() {
    const rl = require('readline/promises').createInterface({ input, output });
    let rodando = true;

    while (rodando) {
        console.log("\n==================================");
        console.log("        MENU DE EXERCÍCIOS        ");
        console.log("==================================");
        console.log("1. Calcular Idade");
        console.log("2. Antecessor e Sucessor");
        console.log("3. Cálculo Salarial");
        console.log("4. Desconto de 15%");
        console.log("5. Média Escolar");
        console.log("6. Situação por Idade");
        console.log("7. Desconto Promocional");
        console.log("8. Seleção de Estagiários");
        console.log("0. Sair");

        const opcao = await rl.question("\nEscolha uma opção (0-8): ");

        switch (opcao.trim()) {
            case '1': await exercicio1(rl); break;
            case '2': await exercicio2(rl); break;
            case '3': await exercicio3(rl); break;
            case '4': await exercicio4(rl); break;
            case '5': await exercicio5(rl); break;
            case '6': await exercicio6(rl); break;
            case '7': await exercicio7(rl); break;
            case '8': await exercicio8(rl); break;
            case '0':
                console.log("Encerrando o programa. Até logo!");
                rodando = false;
                break;
            default:
                console.log("Opção inválida! Escolha um número entre 0 e 8.");
        }
    }

    rl.close();
}

main();
