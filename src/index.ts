import VFCanvas from "./canvas";
import { Type } from "./types";

const canvas = document.querySelector(".app-canvas") as
  | HTMLCanvasElement
  | null;

if (!canvas) {
  throw new Error("Missing .app-canvas element");
}

const url = new URL(window.location.href);
const params = url.searchParams;
const vx = params.get("vx") || "Math.cos((y - mY + 0.78) * 2)";
const vy = params.get("vy") || "Math.sin((x - mX) * 2)";

const backgroundColor = params.get("bg") || "#000";
const foregroundColor = params.get("fg") || "#fff";
const type = params.get("type") as Type || "ARROW";

const lValue = params.get("l");
const spacing = lValue ? parseInt(lValue, 10) : 40;

const clamp = params.get("clamp") === "true";

new VFCanvas({
  el: canvas,
  vx,
  vy,
  spacing,
  foregroundColor,
  backgroundColor,
  type,
  clamp,
});

const showConfig = window.location.search === "" ||
  params.get("edit") === "true";

if (showConfig) {
  const configForm = document.querySelector(".config-form") as
    | HTMLFormElement
    | null;

  if (!configForm) {
    throw new Error("Missing .config-form element");
  }

  for (const [key, value] of params) {
    const formElement = configForm.elements.namedItem(key) as
      | HTMLInputElement
      | HTMLSelectElement
      | null;

    if (formElement) {
      formElement.value = value;
    }
  }

  configForm.style.display = "block";
}
