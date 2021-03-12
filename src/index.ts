import VFCanvas from "./canvas";

const svg = document.querySelector(".app-canvas") as SVGElement;

if (!svg) {
  throw new Error("Missing .app-canvas element");
}

new VFCanvas(svg);
