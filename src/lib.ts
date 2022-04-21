import Arrow from "./points/arrow";
import Line from "./points/line";
import Dot from "./points/dot";
import Circle from "./points/circle";
import Debug from "./points/debug";
import {
  PointConstructorOptions,
  PointElement,
  PointRenderOptions,
  Type,
} from "./types";

interface Point {
  logicalX: number;
  logicalY: number;
  physicalX: number;
  physicalY: number;
  element: PointElement;
}

interface Options {
  el: HTMLCanvasElement;
  xEquation: string;
  yEquation: string;
  spacing: number;
  backgroundColor: string;
  foregroundColor: string;
  type: Type;
  clamp: boolean;
}

// Converts X,Y slope to radians, in the format expected by
// CanvasRenderingContext2D.rotate (starting at x=0)
const slopeToRotation = (x: number, y: number): number =>
  ((Math.PI * 2) + Math.atan2(-1 * y, x)) % (Math.PI * 2);

function getPointConstructor(
  pointType: Type,
): new (options: PointConstructorOptions) => PointElement {
  switch (pointType) {
    case "ARROW":
      return Arrow;
    case "LINE":
      return Line;
    case "DOT":
      return Dot;
    case "CIRCLE":
      return Circle;
    case "DEBUG":
      return Debug;
  }
}

export default class VFCanvas {
  private options: Options;
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private pageOffsetX: number;
  private pageOffsetY: number;

  private points: Point[] = [];

  private logicalMouseX: number = 0;
  private logicalMouseY: number = 0;

  constructor(options: Options) {
    const { el } = options;
    this.options = options;
    const ctx = options.el.getContext("2d");

    if (!ctx) {
      throw new Error("Could not get canvas context");
    }

    this.ctx = ctx;

    // These values are definitively set in `setUpScene`, there's just no way to
    // tell the compiler that AFAIK.
    this.pageOffsetX = 0;
    this.pageOffsetY = 0;
    this.width = 1;
    this.height = 1;

    el.addEventListener("mousemove", this.onMouseMove);
    el.addEventListener("touchmove", this.onTouchMove);
    window.addEventListener("resize", this.onWindowResize);

    this.setUpScene();
    this.render();
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
      const time = (Date.now() / 10000) % 1;
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

    if (this.options.clamp) {
      logicalMagnitude = Math.min(logicalMagnitude, 1);
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

    requestAnimationFrame(this.render);
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

    const widthWhitespace = (this.width % this.options.spacing) / 2;

    const [pMinX, pMinY] = [halfPoint + widthWhitespace, halfPoint];

    // Unclear why this is off by 1 but it is. Sorry!
    const [pMaxX, pMaxY] = [
      this.width - halfPoint + 1,
      this.height - halfPoint,
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
