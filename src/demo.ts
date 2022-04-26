import VFCanvas from "./lib";
import { PointType } from "./types";

const canvas = document.querySelector(".app-canvas") as
  | HTMLCanvasElement
  | null;

if (!canvas) {
  throw new Error("Missing .app-canvas element");
}

const url = new URL(window.location.href);
const params = url.searchParams;

const inputs = {
  vx: params.get("vx") || "(mX - x) * sin((2*t - 1) * PI)",
  vy: params.get("vy") || "(mY - y) * cos((2*t - 1) * PI)",
  bg: params.get("bg") || "#dd5555",
  fg: params.get("fg") || "#fff",
  type: params.get("type") as PointType || "DOT",
  l: params.get("l") || 40,
  clamp: params.get("clamp"),
} as { [key: string]: string };

const clamp = inputs.clamp ? parseFloat(inputs.clamp) : undefined;

const vf = new VFCanvas({
  el: canvas,
  xEquation: inputs.vx,
  yEquation: inputs.vy,
  spacing: parseInt(inputs.l, 10),
  foregroundColor: inputs.fg,
  backgroundColor: inputs.bg,
  type: inputs.type as PointType,
  clamp,
});

vf.start();

const showConfig = window.location.search === "" ||
  params.get("edit") === "true";

if (showConfig) {
  const configForm = document.querySelector(".config-form") as
    | HTMLFormElement
    | null;

  if (!configForm) {
    throw new Error("Missing .config-form element");
  }

  for (const key of Object.keys(inputs)) {
    const value = inputs[key];
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
