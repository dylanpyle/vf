import VFCanvas from "./canvas";

const canvas = document.querySelector(".app-canvas") as HTMLCanvasElement;

if (!canvas) {
  throw new Error("Missing .app-canvas element");
}

const params = new URLSearchParams(window.location.search.slice(1));
const vx = params.get("vx") || "Math.cos((y - mY + 0.78) * 2)";
const vy = params.get("vy") || "Math.sin((x - mX) * 2)";

const lValue = params.get("l");
const arrowSpacing = lValue ? parseInt(lValue, 10) : 40;

new VFCanvas({
  el: canvas,
  vx,
  vy,
  arrowSpacing,
});
