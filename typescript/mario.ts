interface PowerUp {
  readonly nome: string;
  readonly duracaoSegundos: number;
  ativar(jogador: Mario): void;
}

abstract class Personagem {
  protected vidas: number;
  pontos = 0;

  constructor(public readonly nome: string, vidas = 3) {
    this.vidas = Math.max(0, vidas);
  }

  mover(): void {
    console.log(`${this.nome} está se movendo pelo cenário...`);
  }

  pular(): void {
    console.log(`${this.nome} pulou! Woo-hoo!`);
  }

  getVida(): number {
    return this.vidas;
  }

  tomarDano(): void {
    if (this.vidas === 0) {
      console.log(`${this.nome} não tem mais vidas.`);
      return;
    }
    this.vidas--;
    console.log(`${this.nome} tomou dano! Vidas restantes: ${this.vidas}`);
  }

  abstract atacar(): void;
}

class Mario extends Personagem {
  crescer(): void {
    console.log(`${this.nome} cresceu e ficou grande!`);
  }

  ficarInvencivel(tempo: number): void {
    console.log(`${this.nome} está invencível por ${tempo} segundos!`);
  }

  atacar(): void {
    console.log(`${this.nome} pula sobre os inimigos e derruba blocos!`);
  }

  usarFogo(): void {
    console.log(`${this.nome} lança uma bola de fogo!`);
  }
}

class Luigi extends Personagem {
  atacar(): void {
    console.log(`${this.nome} pula mais alto e usa seu aspirador!`);
  }
}

class Goomba extends Personagem {
  constructor() { super('Goomba', 1); }
  atacar(): void { console.log('Goomba caminha em linha reta e bate!'); }
}

class Koopa extends Personagem {
  constructor() { super('Koopa', 1); }
  atacar(): void { console.log('Koopa se encolhe na carapaça e vira um projétil!'); }
}

class Bowser extends Personagem {
  constructor() { super('Bowser', 5); }
  atacar(): void { console.log('Bowser cospe fogo como chefão final!'); }
}

class Cogumelo implements PowerUp {
  readonly nome = 'Super Mushroom';
  readonly duracaoSegundos = 0;

  ativar(jogador: Mario): void {
    jogador.crescer();
    console.log(`Power-up ativado: ${this.nome}`);
  }
}

class EstrelaInvencivel implements PowerUp {
  readonly nome = 'Star';
  readonly duracaoSegundos = 10;

  ativar(jogador: Mario): void {
    jogador.ficarInvencivel(this.duracaoSegundos);
    console.log(`Power-up ativado: ${this.nome}`);
  }
}

console.log('=== Criando personagens ===');
const mario = new Mario('Mario');
const luigi = new Luigi('Luigi');
mario.pular();
luigi.pular();

console.log('\n=== Encapsulamento ===');
console.log(`Vidas iniciais do Mario: ${mario.getVida()}`);
mario.tomarDano();

console.log('\n=== Polimorfismo ===');
const personagens: Personagem[] = [mario, luigi, new Goomba(), new Koopa(), new Bowser()];
for (const personagem of personagens) personagem.atacar();

console.log('\n=== Interfaces e power-ups ===');
const powerUps: PowerUp[] = [new Cogumelo(), new EstrelaInvencivel()];
for (const powerUp of powerUps) powerUp.ativar(mario);
