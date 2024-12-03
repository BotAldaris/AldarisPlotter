import Engine from "./Engine";
import { LineChart } from "./LineChart";
import "./style.css";

function main() {
  const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
  const gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }
  // look up the text canvas.
  const textCanvas = document.querySelector("#text") as HTMLCanvasElement;
  if (!textCanvas) {
    return
  }
  // make a 2D context for it
  const ctx = textCanvas.getContext("2d");
  if (!ctx) {
    return
  }
  // three 2d points
  const dados = [10, 20, 30, 80, 30];
  const labels = ["Jan", "Fev", "Mar", "Maio", "Jul"]
  const engine = new Engine(gl, ctx)
  const lineChart = new LineChart(engine, dados, labels)
  window.addEventListener("resize", () => lineChart.resize())
}
main();
