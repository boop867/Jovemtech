import * as readline from 'readline';

const ALTURA = 15;
const LARGURA = 30;
const POSICAO_PASSARO = Math.floor(LARGURA / 4);
const INTERVALO_MS = 80;

class Passaro {
  velocidade = 0;
  constructor(public y: number, private readonly gravidade = 0.1, private readonly forcaPulo = -0.8) {}

  atualizar(): void {
    this.y += this.velocidade + this.gravidade / 2;
    this.velocidade += this.gravidade;
  }

  pular(): void {
    this.velocidade = this.forcaPulo;
  }
}

class Cano {
  readonly tamanhoAbertura = 4;
  aberturaTopo: number;

  constructor(public x: number) {
    this.aberturaTopo = this.sortearAbertura();
  }

  private sortearAbertura(): number {
    return Math.floor(Math.random() * (ALTURA - this.tamanhoAbertura - 2)) + 1;
  }

  atualizar(): void {
    this.x--;
    if (this.x < 0) {
      this.x = LARGURA - 1;
      this.aberturaTopo = this.sortearAbertura();
    }
  }
}

class Jogo {
  private passaro = new Passaro(Math.floor(ALTURA / 2));
  private cano = new Cano(LARGURA - 5);
  private pontos = 0;
  private encerrado = false;
  private intervalo: ReturnType<typeof setInterval> | undefined;
  private readonly aoPressionarTecla = (_texto: string, tecla: readline.Key) => {
    if (this.encerrado && tecla.name === 'r') this.reiniciar();
    else if (!this.encerrado && tecla.name === 'space') this.passaro.pular();
    else if (tecla.ctrl && tecla.name === 'c') this.sair();
  };

  iniciar(): void {
    console.log('O jogo começa em 5 segundos. Prepare-se!');
    setTimeout(() => {
      this.prepararTeclado();
      this.iniciarLoop();
    }, 5000);
  }

  private prepararTeclado(): void {
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) process.stdin.setRawMode(true);
    process.stdin.on('keypress', this.aoPressionarTecla);
    process.once('SIGINT', () => this.sair());
  }

  private iniciarLoop(): void {
    this.intervalo = setInterval(() => {
      if (this.encerrado) {
        this.pararLoop();
        this.mostrarFim();
        return;
      }
      this.atualizar();
      this.desenhar();
    }, INTERVALO_MS);
  }

  private reiniciar(): void {
    this.pararLoop();
    this.passaro = new Passaro(Math.floor(ALTURA / 2));
    this.cano = new Cano(LARGURA - 5);
    this.pontos = 0;
    this.encerrado = false;
    this.iniciarLoop();
  }

  private pararLoop(): void {
    if (this.intervalo !== undefined) clearInterval(this.intervalo);
    this.intervalo = undefined;
  }

  private sair(): void {
    this.pararLoop();
    if (process.stdin.isTTY) process.stdin.setRawMode(false);
    process.stdin.removeListener('keypress', this.aoPressionarTecla);
    process.exit(0);
  }

  private atualizar(): void {
    this.passaro.atualizar();
    this.cano.atualizar();

    if (this.cano.x === POSICAO_PASSARO) this.pontos++;
    const yPassaro = Math.floor(this.passaro.y);
    if (yPassaro <= 0 || yPassaro >= ALTURA - 1) this.encerrado = true;

    if (this.cano.x === POSICAO_PASSARO &&
        (yPassaro < this.cano.aberturaTopo || yPassaro >= this.cano.aberturaTopo + this.cano.tamanhoAbertura)) {
      this.encerrado = true;
    }
  }

  private desenhar(): void {
    console.clear();
    const linhas = Array.from({ length: ALTURA }, (_, y) =>
      Array.from({ length: LARGURA }, (_, x) => {
        if (x === POSICAO_PASSARO && y === Math.floor(this.passaro.y)) return '@';
        if (x === this.cano.x && (y < this.cano.aberturaTopo || y >= this.cano.aberturaTopo + this.cano.tamanhoAbertura)) return '#';
        return ' ';
      }).join('')
    );
    console.log(`${linhas.join('\n')}\n${'='.repeat(LARGURA)}`);
    console.log(`Pontos: ${this.pontos} | Espaço: pular | Ctrl+C: sair`);
  }

  private mostrarFim(): void {
    console.clear();
    console.log(`GAME OVER — pontuação: ${this.pontos}`);
    console.log('Pressione R para reiniciar ou Ctrl+C para sair.');
  }
}

new Jogo().iniciar();
