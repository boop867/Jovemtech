import * as readline from 'readline';

const HEIGHT = 15;
const WIDTH = 30;

// ==========================================
// 1. CLASSE PAI (Abstrata) - Base para os Elementos do Cenário
// ==========================================
abstract class ElementoJogo {
    public x: number;
    
    constructor(x: number) {
        this.x = x;
    }

    // Métodos abstratos que as classes filhas são obrigadas a implementar
    public abstract update(): void;
    public abstract desenhar(y: number, xAtual: number, gapTop: number, gapSize: number): string;
}

// ==========================================
// 2. CLASSE FILHA 1: Cano normal (extends ElementoJogo)
// ==========================================
class Pipe extends ElementoJogo {
    public gapTop: number;
    public gapSize: number;

    constructor(x: number) {
        super(x);
        this.gapSize = 4;
        this.gapTop = Math.floor(Math.random() * (HEIGHT - this.gapSize - 2)) + 1;
    }

    public update(): void {
        this.x -= 1;
        if (this.x < 0) {
            this.x = WIDTH - 1;
            this.gapTop = Math.floor(Math.random() * (HEIGHT - this.gapSize - 2)) + 1;
        }
    }

    public desenhar(y: number, xAtual: number, gapTop: number, gapSize: number): string {
        if (xAtual === this.x) {
            if (y < gapTop || y >= gapTop + gapSize) {
                return '█'; // Desenha o corpo do cano
            }
        }
        return ' ';
    }
}

// ==========================================
// 3. CLASSE FILHA 2: Inimigo sobre o cano (extends ElementoJogo)
// Inspirado na Planta Carnívora do Mario (surge e se movimenta)
// ==========================================
class InimigoCano extends ElementoJogo {
    private subindo: boolean = true;
    public offsetInimigoY: number = 0;
    private timerMovimento: number = 0;

    constructor(x: number) {
        super(x);
    }

    public update(): void {
        // Acompanha o deslocamento horizontal do cano
        this.x -= 1;
        if (this.x < 0) {
            this.x = WIDTH - 1;
        }

        // Lógica de animação: o inimigo sobe e desce verticalmente
        this.timerMovimento++;
        if (this.timerMovimento % 4 === 0) {
            if (this.subindo) {
                this.offsetInimigoY++;
                if (this.offsetInimigoY >= 2) this.subindo = false;
            } else {
                this.offsetInimigoY--;
                if (this.offsetInimigoY <= 0) this.subindo = true;
            }
        }
    }

    public desenhar(y: number, xAtual: number, pipeX: number, pipeGapTop: number): string {
        if (xAtual === pipeX) {
            // Posiciona o inimigo logo na base inferior do vão do cano
            const posicaoInimigoY = pipeGapTop + 4 - this.offsetInimigoY; 
            if (y === posicaoInimigoY) {
                return '👾'; // Representa o Inimigo (Planta Carnívora)
            }
        }
        return ' ';
    }
}

// Classe do Pássaro Jogador
class Bird {
    public y: number;
    public velocity: number;
    private gravity: number;
    private jumpForce: number;

    constructor(initialY: number) {
        this.y = initialY;
        this.velocity = 0;
        this.gravity = 0.10;
        this.jumpForce = -0.8;
    }

    public update(): void {
        this.y += this.velocity + this.gravity / 2;
        this.velocity += this.gravity;
    }

    public jump(): void {
        this.velocity = this.jumpForce;
    }
}

// ==========================================
// 4. CLASSE PRINCIPAL DO JOGO
// ==========================================
class Game {
    private bird: Bird;
    private pipe: Pipe;
    private inimigo: InimigoCano; // Instância da classe filha de inimigo
    private score: number;
    private gameOver: boolean;
    private gameInterval: ReturnType<typeof setInterval> | undefined;

    constructor() {
        this.bird = new Bird(Math.floor(HEIGHT / 2));
        this.pipe = new Pipe(WIDTH - 5);
        this.inimigo = new InimigoCano(this.pipe.x);
        this.score = 0;
        this.gameOver = false;
    }

    public start(): void {
        const countdownEndsAt = Date.now() + 5000;

        const countdownInterval = setInterval(() => {
            const countdownMs = countdownEndsAt - Date.now();
            if (countdownMs > 0) {
                this.render(false, Math.ceil(countdownMs / 1000));
                return;
            }

            clearInterval(countdownInterval);
            this.setupInput();
            this.startGameLoop();
        }, 80);
    }

    private startGameLoop(): void {
        const interval = setInterval(() => {
            if (this.gameOver) {
                clearInterval(interval);
                this.gameInterval = undefined;
                this.renderGameOver();
                return;
            }
            this.update();
            this.render();
        }, 80);
        this.gameInterval = interval;
    }

    private setupInput(): void {
        readline.emitKeypressEvents(process.stdin);
        if (process.stdin.isTTY) {
            process.stdin.setRawMode(true);
        }

        process.stdin.on('keypress', (_str, key) => {
            if (this.gameOver && key.name === 'r') {
                this.restart();
                return;
            }
            if (key.name === 'space') {
                this.bird.jump();
            }
            if (key.ctrl && key.name === 'c') {
                process.exit();
            }
        });
    }

    private restart(): void {
        if (this.gameInterval !== undefined) {
            clearInterval(this.gameInterval);
        }
        this.bird = new Bird(Math.floor(HEIGHT / 2));
        this.pipe = new Pipe(WIDTH - 5);
        this.inimigo = new InimigoCano(this.pipe.x);
        this.score = 0;
        this.gameOver = false;
        this.startGameLoop();
    }

    private update(): void {
        this.bird.update();
        this.pipe.update();
        
        // Sincroniza a posição do inimigo com o cano e atualiza sua animação
        this.inimigo.x = this.pipe.x;
        this.inimigo.update();

        // Checar pontuação
        if (this.pipe.x === Math.floor(WIDTH / 4)) {
            this.score++;
        }

        // Colisão com teto ou chão
        if (this.bird.y <= 0 || this.bird.y >= HEIGHT - 1) {
            this.gameOver = true;
        }

        const birdX = Math.floor(WIDTH / 4);

        // Colisão com o cano estrutural
        if (Math.floor(this.pipe.x) === birdX) {
            const birdY = Math.floor(this.bird.y);
            if (birdY < this.pipe.gapTop || birdY >= this.pipe.gapTop + this.pipe.gapSize) {
                this.gameOver = true;
            }
        }

        // Nova colisão: Colisão com o Inimigo (Planta Carnívora)
        if (Math.floor(this.pipe.x) === birdX) {
            const birdY = Math.floor(this.bird.y);
            const posicaoInimigoY = this.pipe.gapTop + 4 - this.inimigo.offsetInimigoY;
            if (birdY === posicaoInimigoY) {
                this.gameOver = true; // Bateu no inimigo!
            }
        }
    }

    private render(showElements = true, countdownSeconds = 0): void {
        console.clear();
        let screen = '';

        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                const birdY = Math.floor(this.bird.y);
                const birdX = Math.floor(WIDTH / 4);

                if (x === birdX && y === birdY) {
                    screen += '🐦'; // Pássaro
                } else if (showElements) {
                    // Desenha o cano usando a classe Pipe
                    let charDesenhado = this.pipe.desenhar(y, x, this.pipe.gapTop, this.pipe.gapSize);
                    
                    // Desenha o inimigo por cima do cano usando a classe InimigoCano
                    let charInimigo = this.inimigo.desenhar(y, x, this.pipe.x, this.pipe.gapTop);
                    if (charInimigo !== ' ') {
                        charDesenhado = charInimigo;
                    }

                    screen += charDesenhado;
                } else {
                    screen += ' ';
                }
            }
            screen += '\n';
        }

        screen += '='.repeat(WIDTH) + '\n';
        if (countdownSeconds > 0) {
            screen += ` O jogo começa em ${countdownSeconds}s...\n`;
        } else {
            screen += ` Pontuação: ${this.score} | 👾 Inimigo Ativo | Pressione ESPAÇO para pular\n`;
        }

        process.stdout.write(screen);
    }

    private renderGameOver(): void {
        console.clear();
        console.log('====================================');
        console.log('            GAME OVER               ');
        console.log(`        Pontuação final: ${this.score}       `);
        console.log('      Pressione R para reiniciar    ');
        console.log('====================================\n');
    }
}

// Inicialização da partida
const game = new Game();
game.start();
