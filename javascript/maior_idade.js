// Demonstração de notas, médias, arrays e condicionais.
const aluno = 'Davi';
const notas = [8, 6, 7];
const media = notas.reduce((soma, nota) => soma + nota, 0) / notas.length;

console.log(`Aluno: ${aluno}`);
console.log(`Notas: ${notas.join(', ')}`);
console.log(`Média: ${media.toFixed(1)}`);

if (media >= 7) {
  console.log('Aluno aprovado!');
} else if (media >= 5) {
  console.log('Aluno em recuperação!');
} else {
  console.log('Aluno reprovado!');
}

const alunos = ['Davi', 'Maria', 'Pedro'];
console.log(`Lista de alunos: ${alunos.join(' - ')}`);
