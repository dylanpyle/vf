import VFCanvas from "./canvas";

const svg = document.querySelector(".app-canvas") as SVGElement;

if (!svg) {
  throw new Error("Missing .app-canvas element");
}

const params = new URLSearchParams(window.location.search.slice(1));
const vx = params.get("vx") || "Math.cos((y - mY + 0.78) * 2)";
const vy = params.get("vy") || "Math.sin((x - mX) * 2)";

new VFCanvas(svg, vx, vy);
