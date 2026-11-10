import * as readline from 'readline';

// Define a altura e a largura do tabuleiro desenhado no terminal.
const HEIGHT = 15;
const WIDTH = 30;

// Representa o personagem principal e controla seu movimento vertical.
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

// Representa uma coluna: ela se move para a esquerda e tem uma abertura segura.
class Pipe {
    public x: number;
    public gapTop: number;
    public gapSize: number;

    constructor(x: number) {
        this.x = x;
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
}

class Game {
    private bird: Bird;
    private pipe: Pipe;
    private score: number;
    private gameOver: boolean;
    private gameInterval: ReturnType<typeof setInterval> | undefined;

    constructor() {
        this.bird = new Bird(Math.floor(HEIGHT / 2));
        this.pipe = new Pipe(WIDTH - 5);
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
        this.score = 0;
        this.gameOver = false;
        this.startGameLoop();
    }

    private update(): void {
        this.bird.update();
        this.pipe.update();

        if (this.pipe.x === Math.floor(WIDTH / 4)) {
            this.score++;
        }

        if (this.bird.y <= 0 || this.bird.y >= HEIGHT - 1) {
            this.gameOver = true;
        }

        const birdX = Math.floor(WIDTH / 4);
        if (Math.floor(this.pipe.x) === birdX) {
            const birdY = Math.floor(this.bird.y);
            if (birdY < this.pipe.gapTop || birdY >= this.pipe.gapTop + this.pipe.gapSize) {
                this.gameOver = true;
            }
        }
    }

    private render(showPipe = true, countdownSeconds = 0): void {
        console.clear();
        let screen = '';

        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                const birdY = Math.floor(this.bird.y);
                const birdX = Math.floor(WIDTH / 4);

                if (x === birdX && y === birdY) {
                    screen += '🐦';
                } else if (showPipe && x === this.pipe.x) {
                    if (y < this.pipe.gapTop || y >= this.pipe.gapTop + this.pipe.gapSize) {
                        screen += '█';
                    } else {
                        screen += ' ';
                    }
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
            screen += ` Pontuação: ${this.score} | Pressione ESPAÇO para pular | Ctrl+C para sair\n`;
        }

        process.stdout.write(screen);
    }

    private renderGameOver(): void {
        console.clear();
        console.log('====================================');
        console.log('             GAME OVER              ');
        console.log(`         Pontuação final: ${this.score}       `);
        console.log('       Pressione R para reiniciar    ');
        console.log('====================================\n');
    }
}

const game = new Game();
game.start();
