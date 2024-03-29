import Arrow from "./points/arrow";
import Circle from "./points/circle";
import Dot from "./points/dot";
import Spacetime from "./points/spacetime";
import Debug from "./points/debug";
import ThickLine from "./points/thick-line";

import {
  Point,
  PointConstructorOptions,
  PointElement,
  PointRenderOptions,
  PointType,
} from "./types";

interface Options {
  // The <canvas> element to render the point field in
  el: HTMLCanvasElement;

  // JavaScript equations to be evaluated to calculate the X and Y components of
  // the vector. Should generally return values in the range (-1,1).
  //
  // Several variables are provided in scope:
  // - `x`, `y` — the vector's X and Y position in the field (-1 to 1)
  // - `mX`, `mY` — the logical position of the mouse in the field (-1 to 1)
  // - `t` — A continuous value growing from 0 to 1 over `timerPeriodMs`
  // — and all `Math` functions.
  xEquation: string;
  yEquation: string;

  // Pixel distance between points in the field.
  spacing: number;

  // HTML color strings
  backgroundColor: string;
  foregroundColor: string;

  // See valid values
  type: PointType;

  // Restrict the absolute magnitude of the vector, e.g. to `1` to prevent
  // vectors exceeding their allowed space.
  clamp?: number;

  // Period over which the `t` variable grows from 0 to 1.
  timerPeriodMs?: number;

  // In pixels
  horizontalPadding: number;
  verticalPadding: number;
}

// Converts X,Y slope to radians, in the format expected by
// CanvasRenderingContext2D.rotate (starting at x=0)
const slopeToRotation = (x: number, y: number): number =>
  ((Math.PI * 2) + Math.atan2(-1 * y, x)) % (Math.PI * 2);

function getPointConstructor(
  pointType: PointType,
): new (options: PointConstructorOptions) => PointElement {
  switch (pointType) {
    case "ARROW":
    case "LINE":
      return Arrow;
    case "THICKLINE":
      return ThickLine;
    case "DOT":
      return Dot;
    case "FILLED_CIRCLE":
    case "OUTLINED_CIRCLE":
      return Circle;
    case "SPACETIME":
      return Spacetime;
    case "DEBUG":
      return Debug;
  }
}

const DEFAULT_TIMER_PERIOD_MS = 30000;

export default class VFCanvas extends EventTarget {
  private options: Options;
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private pageOffsetX: number;
  private pageOffsetY: number;
  private animationLoop: number | null = null;

  private points: Point[] = [];

  private logicalMouseX: number = 0;
  private logicalMouseY: number = 0;

  constructor(options: Options) {
    super();
    this.options = options;
    const ctx = options.el.getContext("2d");

    if (!ctx) {
      throw new Error("Could not get canvas context");
    }

    this.ctx = ctx;

    this.pageOffsetX = 0;
    this.pageOffsetY = 0;
    this.width = 1;
    this.height = 1;
  }

  public start(): void {
    this.setUpScene();
    this.render();

    this.options.el.addEventListener("mousemove", this.onMouseMove);
    this.options.el.addEventListener("touchmove", this.onTouchMove);
    window.addEventListener("resize", this.onWindowResize);
  }

  public stop(): void {
    this.options.el.removeEventListener("mousemove", this.onMouseMove);
    this.options.el.removeEventListener("touchmove", this.onTouchMove);
    window.removeEventListener("resize", this.onWindowResize);

    if (this.animationLoop) {
      cancelAnimationFrame(this.animationLoop);
    }
  }

  private onMouseMove = (event: MouseEvent) => {
    this.updateWithMousePosition(event.offsetX, event.offsetY);
  };

  private onTouchMove = (event: TouchEvent) => {
    event.preventDefault();
    this.updateWithMousePosition(
      event.touches[0].pageX - this.pageOffsetX,
      event.touches[0].pageY - this.pageOffsetY,
    );
  };

  private getPointElementProperties(
    point: Point,
  ): PointRenderOptions {
    const evaluate = (equation: string): number => {
      const timerPeriodMs = this.options.timerPeriodMs ||
        DEFAULT_TIMER_PERIOD_MS;
      const time = (Date.now() / timerPeriodMs) % 1;

      const f = new Function(
        "x",
        "y",
        "mX",
        "mY",
        "t",
        `with (Math) { return ${equation}; }`,
      );
      return f(
        point.logicalX,
        point.logicalY,
        this.logicalMouseX,
        this.logicalMouseY,
        time,
      );
    };

    const x = evaluate(this.options.xEquation);
    const y = evaluate(this.options.yEquation);
    let logicalMagnitude = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

    if (this.options.clamp !== undefined) {
      logicalMagnitude = Math.min(logicalMagnitude, this.options.clamp);
    }

    const physicalMagintude = logicalMagnitude * this.options.spacing;

    return {
      magnitude: physicalMagintude,
      direction: slopeToRotation(x, y),
    };
  }

  private render = () => {
    this.ctx.fillStyle = this.options.backgroundColor;
    this.ctx.fillRect(0, 0, this.width, this.height);

    for (const point of this.points) {
      point.element.render(this.getPointElementProperties(point));
      this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    this.animationLoop = requestAnimationFrame(this.render);
  };

  private updateWithMousePosition = (
    physicalMouseX: number,
    physicalMouseY: number,
  ) => {
    const [logicalMouseX, logicalMouseY] = this.physicalToLogical(
      physicalMouseX,
      physicalMouseY,
    );
    this.logicalMouseX = logicalMouseX;
    this.logicalMouseY = logicalMouseY;
  };

  private onWindowResize = () => {
    this.setUpScene();
  };

  // [[minX, minY], [maxX, maxY]]
  private getLogicalBounds(): [[number, number], [number, number]] {
    const aspectRatio = this.width / this.height;

    return aspectRatio > 1
      ? [[-1, -1 / aspectRatio], [1, 1 / aspectRatio]]
      : [[aspectRatio / -1, -1], [aspectRatio / 1, 1]];
  }

  private physicalToLogical(
    physicalX: number,
    physicalY: number,
  ): [number, number] {
    const [
      [lMinX, lMinY],
      [lMaxX, lMaxY],
    ] = this.getLogicalBounds();

    const [pMaxX, pMaxY] = [this.width, this.height];

    const percentX = physicalX / pMaxX;
    const percentY = 1 - (physicalY / pMaxY);

    const logicalX = lMinX + ((lMaxX - lMinX) * percentX);
    const logicalY = lMinY + ((lMaxY - lMinY) * percentY);
    return [logicalX, logicalY];
  }

  private setUpScene() {
    const { el } = this.options;
    const parentNode = el.parentNode;

    if (!parentNode || !(parentNode instanceof HTMLElement)) {
      throw new Error("Parent element must be a HTMLElement");
    }

    const parentSize = parentNode.getBoundingClientRect();

    this.width = parentSize.width;
    this.height = parentSize.height;
    this.pageOffsetX = parentSize.x;
    this.pageOffsetY = parentSize.y;

    const scale = window.devicePixelRatio;

    el.width = this.width * scale;
    el.height = this.height * scale;

    this.ctx.scale(scale, scale);

    this.points = [];

    const halfPoint = this.options.spacing / 2;

    const { horizontalPadding, verticalPadding } = this.options;

    const additionalCenteringPadding =
      ((this.width - (horizontalPadding * 2)) % this.options.spacing) / 2;
    const totalHorizontalPadding = horizontalPadding +
      additionalCenteringPadding;

    const sizeChangedEvent = new CustomEvent("sizeChanged", {
      detail: { horizontalPadding: totalHorizontalPadding },
    });
    this.dispatchEvent(sizeChangedEvent);

    const [pMinX, pMinY] = [
      halfPoint + totalHorizontalPadding,
      halfPoint + verticalPadding,
    ];

    // Unclear why this is off by 1 but it is. Sorry!
    const [pMaxX, pMaxY] = [
      this.width - halfPoint - totalHorizontalPadding + 1,
      this.height - halfPoint - verticalPadding,
    ];

    for (
      let physicalX = pMinX;
      physicalX < pMaxX;
      physicalX += this.options.spacing
    ) {
      for (
        let physicalY = pMinY;
        physicalY < pMaxY;
        physicalY += this.options.spacing
      ) {
        const ctr = getPointConstructor(this.options.type);

        const element = new ctr({
          ctx: this.ctx,
          x: physicalX,
          y: physicalY,
          color: this.options.foregroundColor,
          type: this.options.type,
          spacing: this.options.spacing,
          pointsArray: this.points,
          pointsArrayIndex: this.points.length,
        });

        const [logicalX, logicalY] = this.physicalToLogical(
          physicalX,
          physicalY,
        );

        this.points.push({
          element,
          logicalX,
          logicalY,
          physicalX,
          physicalY,
        });
      }
    }
  }
}

(window as any).VFCanvas = VFCanvas;
