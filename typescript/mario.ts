export {};

// ==========================================
// 1. ABSTRAÇÃO E INTERFACES (Power-Ups)
// ==========================================
interface PowerUp {
    nome: string;
    duracaoSegundos: number;
    ativar(jogador: Personagem): void;
}

// ==========================================
// 2. CLASSE PAI (ABSTRATA) E HERANÇA
// ==========================================
abstract class Personagem {
    nome: string;
    protected vidas: number; // Encapsulamento protegido
    pontos: number;

    constructor(nome: string, vidas: number = 3) {
        this.nome = nome;
        this.vidas = vidas;
        this.pontos = 0;
    }

    // Método comum herdado por todos
    mover(): void {
        console.log(`${this.nome} está se movendo pelo cenário...`);
    }

    pular(): void {
        console.log(`${this.nome} pulou! 🍄 Woo-hoo!`);
    }

    // Getter para leitura segura da vida (Encapsulamento)
    getVida(): number {
        return this.vidas;
    }

    // Método com validação (Encapsulamento)
    tomarDano(): void {
        if (this.vidas > 0) {
            this.vidas--;
            console.log(`${this.nome} tomou dano! Vidas restantes: ${this.vidas}`);
        }
    }

    // Método abstrato que força as classes filhas a implementarem (Polimorfismo)
    abstract atacar(): void;
}

// ==========================================
// 3. CLASSES FILHAS (Herança)
// ==========================================
class Mario extends Personagem {
    crescer(): void {
        console.log(`${this.nome} cresceu e ficou grande!`);
    }

    ficarInvencivel(tempo: number): void {
        console.log(`${this.nome} está invencível por ${tempo} segundos! ⭐`);
    }

    // Sobrescrita do método atacar (Polimorfismo)
    atacar(): void {
        console.log(`${this.nome} pula sobre os inimigos e derruba blocos!`);
    }

    usarFogoDe(): void {
        console.log(`${this.nome} lança uma bola de fogo! 🔥`);
    }
}

class Luigi extends Personagem {
    atacar(): void {
        console.log(`${this.nome} pula mais alto e usa seu aspirador!`);
    }
}

// ==========================================
// 4. CLASSES DE INIMIGOS (Polimorfismo)
// ==========================================
class Goomba extends Personagem {
    constructor() {
        super("Goomba", 1);
    }

    atacar(): void {
        console.log(`🍄 Goomba: caminha em linha reta e bate!`);
    }
}

class Koopa extends Personagem {
    constructor() {
        super("Koopa", 1);
    }

    atacar(): void {
        console.log(`🐢 Koopa: encolhe na carapaça e vira um projétil!`);
    }
}

class Bowser extends Personagem {
    constructor() {
        super("Bowser", 5);
    }

    atacar(): void {
        console.log(`🔥 Bowser: cospe fogo no chefão final épico!`);
    }
}

// ==========================================
// 5. IMPLEMENTAÇÃO DE POWER-UPS (Interfaces)
// ==========================================
class Cogumelo implements PowerUp {
    nome = "Super Mushroom";
    duracaoSegundos = 0;

    ativar(jogador: Mario): void {
        jogador.crescer();
        console.log(`Power-Up ativado: ${this.nome}`);
    }
}

class EstrelaInvencivel implements PowerUp {
    nome = "Star";
    duracaoSegundos = 10;

    ativar(jogador: Mario): void {
        jogador.ficarInvencivel(this.duracaoSegundos);
        console.log(`Power-Up ativado: ${this.nome}`);
    }
}

// ==========================================
// 6. TESTANDO O CÓDIGO (Execução)
// ==========================================
console.log("=== CRIANDO PERSONAGENS ===");
const mario = new Mario("Mario");
const luigi = new Luigi("Luigi");

mario.pular();
luigi.pular();

console.log("\n=== TESTANDO ENCAPSULAMENTO ===");
console.log(`Vidas iniciais do Mario: ${mario.getVida()}`);
mario.tomarDano();

console.log("\n=== TESTANDO POLIMORFISMO DE INIMIGOS ===");
const inimigos: Personagem[] = [
    new Goomba(),
    new Koopa(),
    new Bowser()
];

inimigos.forEach(inimigo => {
    inimigo.atacar();
});

console.log("\n=== TESTANDO POWER-UPS (INTERFACES) ===");
const superCogumelo: PowerUp = new Cogumelo();
superCogumelo.ativar(mario);

const estrela: PowerUp = new EstrelaInvencivel();
estrela.ativar(mario);
