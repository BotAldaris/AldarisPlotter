export function generatePoints(dataX: number[], label: string[], max: number | null = null, min: number | null = null, padx = 0.24, pady = 0.1): [number[], number] {
    if (dataX.length !== label.length) {
        throw new Error("the length of dataX and dataY needs to be the same")
    }
    let [maxAjustado, minAjustado] = generateMaxMin(dataX, max, min)
    const rangeY = (1 - pady) / (label.length - 1)
    const valoresY = []
    const valores = []
    let numero = 0
    const rangeX = (maxAjustado - minAjustado) * (1 + padx)
    const padxAplicado = rangeX * (padx / 2)
    const padyAplicado = pady / (3 / 2)
    for (let _ = 0; _ < label.length; _++) {
        valoresY.push(numero + padyAplicado)
        numero += rangeY
    }
    if (minAjustado < 0) {
        maxAjustado = maxAjustado - minAjustado
    }
    for (let i = 0; i < dataX.length; i++) {
        valores.push(valoresY[i])
        valores.push((dataX[i] - minAjustado) + padxAplicado)
        valores.push(valoresY[i + 1])
        valores.push((dataX[i + 1] - minAjustado) + padxAplicado)
    }
    return [valores, rangeX]
}

export function generateCircle(x: number, y: number, r: number): number[] {
    const points = []
    const angleStep = (2 * Math.PI) / 10;
    for (let i = 0; i <= 10; i++) {
        const angle = i * angleStep;
        points.push(x + 0.01 * Math.cos(angle),
            y + r * Math.sin(angle)
        );
    }
    return points
}
function generateMaxMin(dados: number[], max: number | null = null, min: number | null = null): [number, number] {
    if (!max && !min) {
        return [Math.max(...dados), Math.min(...dados)]
    }
    if (!max) {
        // biome-ignore lint/style/noNonNullAssertion: Como em no if de cima verifica a possibilidade de ser nulo nos 2 caso, entao so existe um nulo, que no caso seria o max se esse if for ativado
        return [Math.max(...dados), min!]
    }
    if (!min) {
        return [max, Math.min(...dados)]
    }
    return [max, min]
}
