import VFCanvas, { Type } from "./canvas";

const canvas = document.querySelector(".app-canvas") as
  | HTMLCanvasElement
  | null;

if (!canvas) {
  throw new Error("Missing .app-canvas element");
}

function getParam(paramName: string): string | undefined {
  const value = params.get(paramName);
  return value || undefined;
}

function getNumericParam(paramName: string): number | undefined {
  const value = getParam(paramName);

  if (value === undefined) {
    return value;
  }

  const numeric = Number(value);

  if (isNaN(numeric)) {
    return undefined;
  }

  return numeric;
}

const url = new URL(window.location.href);
const params = url.searchParams;

try {
  new VFCanvas(canvas, {
    xEquation: getParam('vx'),
    yEquation: getParam('vy'),
    arrowSpacing: getNumericParam('l'),
    foregroundColor: getParam('fg'),
    backgroundColor: getParam('bg'),
    type: getParam('type') as Type | undefined,
    viewBox: [[30,30],[70, 70]],
    arrowStroke: 1.2
  });
} catch (err) {
  alert(err.message);
  console.log(err);
}

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
