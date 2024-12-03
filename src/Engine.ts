import { createProgramFromScripts, resizeCanvasToDisplaySize } from "./webglUtils";

/**
 * Classe que representa o motor de renderização do aplicativo.
 */
export default class Engine {
    /**
     * Localização da variável de cor no shader.
     */
    private readonly colorUniformLocation: WebGLUniformLocation;

    /**
     * Localização da variável de resolução no shader.
     */
    private readonly resolutionUniformLocation: WebGLUniformLocation;
    /**
     * Contrutor da classe Engine.
     * @param gl Instância do contexto WebGL.
     * @param ctx Instância do contexto Canvas.
     */
    public constructor(
        private readonly gl: WebGLRenderingContext,
        private readonly ctx: CanvasRenderingContext2D,
    ) {
        // Cria o programa de shaders a partir dos arquivos shader
        const program = createProgramFromScripts(this.gl, [
            "vertex-shader-2d",
            "fragment-shader-2d",
        ]);
        this.colorUniformLocation = this.gl.getUniformLocation(program, "u_color")!;

        // Obtem a localização da variável de posição no programa de shaders
        const positionAttributeLocation = this.gl.getAttribLocation(
            program,
            "a_position",
        );

        // Cria um buffer para armazenar as coordenadas de posição
        const positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);

        // Obtem a localização da variável de resolução no programa de shaders
        this.resolutionUniformLocation = this.gl.getUniformLocation(
            program,
            "u_resolution",
        )!;

        // Configura a viewport e limpa a tela
        this.resize()
        this.clear()

        gl.useProgram(program);
        gl.enableVertexAttribArray(positionAttributeLocation);

        // Configura os parâmetros do buffer de posição
        const size = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;

        // Configura a variável de posição para o buffer
        gl.vertexAttribPointer(
            positionAttributeLocation,
            size,
            type,
            normalize,
            stride,
            offset,
        );
    }

    /**
     * Desenhar uma linha ou varias linhas com as coordenadas fornecidas.
     * @param points Coordenadas da(s) linha(s) a ser desenhada(s).
     * @param offset Indice inicial do buffer de posição.
     */
    public drawLine(points: number[], offset: number) {
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(points), this.gl.STATIC_DRAW,);
        this.gl.drawArrays(this.gl.LINES, offset, points.length / 2);
    }

    /**
     * Configura o valor da cor.
     * @param r Valor de vermelho (0-1).
     * @param g Valor de verde (0-1).
     * @param b Valor de azul (0-1).
     * @param a Valor de transparência (0-1).
     */
    public setColor(r: number, g: number, b: number, a: number) {
        this.gl.uniform4f(this.colorUniformLocation, r, g, b, a);
    }

    /**
     * Configura o valor da resolução.
     * @param res Valor de resolução.
     */
    public setResolution(res: number) {
        this.gl.uniform2f(this.resolutionUniformLocation, 1, res);
    }

    /**
     * Desenha o texto com a posição e o tamanho fornecidos.
     * @param text Texto a ser desenhado.
     * @param x Posição x do texto.
     * @param y Posição y do texto.
     * @param maxWidth Tamanho máximo para o texto.
     */
    public drawText(text: string, x: number, y: number, maxWidth?: number) {
        this.ctx.fillText(text, x, y, maxWidth)
    }

    /**
     * Desenha um círculo com as coordenadas fornecidas.
     * @param points Coordenadas do círculo a ser desenhado.
     */
    public drawCircle(points: number[]) {
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(points), this.gl.STATIC_DRAW)
        this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, points.length / 2);
    }

    /**
     * Obtem o tamanho do canvas.
     * @returns Tamanho do canvas (largura x altura).
     */
    public getWidth() {
        return this.ctx.canvas.width
    }

    /**
     * Obtem a altura do canvas.
     * @returns Altura do canvas.
     */
    public getHeight() {
        return this.ctx.canvas.height
    }

    public config_text(textBaseline: CanvasTextBaseline | null, textAlign: CanvasTextAlign | null) {
        if (textBaseline) {
            this.ctx.textBaseline = textBaseline
        }
        if (textAlign) {
            this.ctx.textAlign = textAlign
        }
    }
    public clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }
    public resize() {
        resizeCanvasToDisplaySize(this.gl.canvas as HTMLCanvasElement);
        resizeCanvasToDisplaySize(this.ctx.canvas as HTMLCanvasElement);
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.ctx.font = `${Math.min(this.ctx.canvas.height * 0.1, this.ctx.canvas.width * 0.05)}px Fira Sans`
    }
}