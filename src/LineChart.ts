import type Engine from "./Engine";
import { generateCircle, generatePoints } from "./points";

/**
 * Classe responsável por desenhar um gráfico de linhas utilizando um motor de renderização.
 */
export class LineChart {
    private positions: number[];
    private maxValue: number;
    private minValue: number;
    private resolution: number;
    private padx: number;
    private pady: number;
    private linesXY: number[];
    private adicionalValor: number;
    private espacamentos: number;
    private labels: string[];
    /**
     * Construtor da classe LineChart.
     * @param engine - Instância do motor de renderização.
     * @param dados - Dados numéricos para plotar no gráfico.
     * @param labels - Rótulos associados aos dados.
     * @param espacamentos - Número de divisões no eixo vertical.
     * @param padx - Espaçamento horizontal relativo.
     * @param pady - Espaçamento vertical relativo.
     */
    constructor(
        private readonly engine: Engine,
        dados: number[],
        labels: string[],
        espacamentos = 6,
        padx = 0.24,
        pady = 0.1,
    ) {
        // Geração de pontos e resolução baseada nos dados e configurações.
        const [positions, res] = generatePoints(dados, labels, 0, 0, padx, pady);
        // Configuração inicial do motor de renderização.
        this.positions = positions;
        this.engine = engine;
        engine.setResolution(res);
        this.resolution = res;
        this.padx = padx;
        this.pady = pady;
        this.espacamentos = espacamentos;
        // Calcula os valores máximo e mínimo dos dados.
        this.maxValue = Math.max(...dados);
        this.minValue = Math.min(...dados);
        this.linesXY = [
            positions[0],
            positions[1], // Ponto inicial.
            1,
            positions[1], // Linha do eixo X.
            positions[0],
            positions[1], // Ponto inicial.
            positions[0],
            res, // Linha do eixo Y.
        ];
        this.labels = labels;
        // Calcula o incremento entre os valores do eixo vertical.
        this.adicionalValor = (this.maxValue - this.minValue) / espacamentos;
        this.draw();
    }
    public draw() {
        console.time("draw");

        this.engine.clear();
        // Obtém a largura e altura da tela para uso posterior.
        const width = this.engine.getWidth();
        const height = this.engine.getHeight();
        // Desenha linhas verticais de grade no gráfico.
        this.engine.setColor(0.1, 0.1, 0.1, 0.3); // Define a cor da grade.
        for (let i = 0; i < this.positions.length; i += 4) {
            this.engine.drawLine(
                [
                    this.positions[i],
                    height,
                    this.positions[i],
                    (this.resolution * this.padx) / 2,
                ],
                0,
            );
        }
        // Configura o alinhamento de texto.
        this.engine.config_text("middle", "start");
        let valor = this.minValue;

        // Desenha os rótulos e linhas horizontais do eixo Y.
        this.engine.setColor(0.1, 0.1, 0.1, 0.3); // Define a cor das linhas de grade horizontais.
        for (let i = 0; i < this.espacamentos + 1; i++) {
            this.engine.drawText(
                Math.floor(valor).toString(),
                0,
                height - (valor / this.resolution) * height,
            ); // Valores do Rotúlos.
            valor += this.adicionalValor;
            this.engine.drawLine([1, valor, (this.pady * 2) / 3, valor], 0); // Linha horizontal.
        }
        this.engine.drawLine(
            [1, this.resolution, (this.pady * 2) / 3, this.resolution],
            0,
        );
        //  Define a cor da linha principal e a desenha
        this.engine.setColor(1, 0, 0, 1);
        this.engine.drawLine(this.positions, 0);
        // Configura o texto para os rótulos dos eixos.
        this.engine.config_text("top", "center");

        // Desenha círculos nos pontos e os rótulos correspondentes.
        this.engine.setColor(1, 0.5, 0, 1);
        for (let i = 0; i < this.positions.length; i += 4) {
            const x = generateCircle(this.positions[i], this.positions[i + 1], 1);
            this.engine.drawCircle(x);
            this.engine.drawText(
                this.labels[i / 4],
                this.positions[i] * width,
                height - (this.positions[1] / this.resolution) * height,
            ); // Rótulo.
        }

        // Desenha os eixos X e Y.
        this.engine.setColor(0, 0, 0, 1); // Define a cor dos eixos como preto.
        this.engine.drawLine(this.linesXY, 0);
        console.timeEnd("draw");
    }
    public resize() {
        this.engine.resize();
        this.draw();
    }
}
