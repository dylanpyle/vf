import Arrow from "./arrow";

function slopeToRadians (x: number, y: number): number {
  return (Math.PI * 2) - Math.atan2(y, x);
}

function compact<T = {}> (obj: T): Partial<T> {
  const result: Partial<T> = {};
  for (const key in obj) {
    const value = obj[key];
    if (value !== undefined) {
      result[key] = value;
    }
  }

  return result;
}

interface Point {
  logicalX: number;
  logicalY: number;
  physicalX: number;
  physicalY: number;
  arrow: Arrow;
}

export type Type = "ARROW" | "LINE";

interface Options {
  xEquation: string;
  yEquation: string;
  arrowSpacing: number;
  backgroundColor: string;
  foregroundColor: string;
  type: Type;

  // [[X%, Y%], [X%, Y%]]
  viewBox: [[number, number], [number, number]];
}

const defaultOptions: Options = {
  xEquation: "Math.cos((y - mY + 0.78) * 2)",
  yEquation: "Math.sin((x - mX) * 2)",
  backgroundColor: "#000",
  foregroundColor: "#fff",
  type: "ARROW",
  arrowSpacing: 40,
  viewBox: [[0, 0], [100, 100]]
};

export default class VFCanvas {
  private el: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;

  private points: Point[] = [];

  private logicalMouseX: number = 0;
  private logicalMouseY: number = 0;

  private options: Options;

  constructor(
    el: HTMLCanvasElement,
    options: Partial<Options>
  ) {
    this.el = el;
    this.width = this.el.clientWidth;
    this.height = this.el.clientHeight;

    this.options = {
      ...compact(options),
      ...defaultOptions
    };

    const ctx = el.getContext("2d");
    if (!ctx) {
      throw new Error("Could not get canvas context");
    }

    this.ctx = ctx;

    el.addEventListener("mousemove", this.onMouseMove);
    el.addEventListener("touchmove", this.onTouchMove);
    window.addEventListener("resize", this.onWindowResize);

    this.setUpScene();
    this.render();
  }

  private onMouseMove = (event: MouseEvent) => {
    this.updateWithMousePosition(event.clientX, event.clientY);
  };

  private onTouchMove = (event: TouchEvent) => {
    event.preventDefault();
    this.updateWithMousePosition(
      event.touches[0].clientX,
      event.touches[0].clientY,
    );
  };

  private getArrowProperties(
    point: Point,
  ): { magnitude: number; direction: number } {
    const evaluate = (equation: string): number => {
      const time = (Date.now() / 10000) % 1;
      const f = new Function("x", "y", "mX", "mY", "t", `return ${equation};`);
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
    const magnitude = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) *
      this.options.arrowSpacing;

    return {
      magnitude,
      direction: slopeToRadians(x, y),
    };
  }

  private render = () => {
    this.ctx.fillStyle = this.options.backgroundColor;
    this.ctx.fillRect(0, 0, this.width, this.height);

    for (const point of this.points) {
      point.arrow.render(this.getArrowProperties(point));
    }

    //requestAnimationFrame(this.render);
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
    this.width = this.el.clientWidth;
    this.height = this.el.clientHeight;

    const scale = window.devicePixelRatio;

    this.el.width = this.width * scale;
    this.el.height = this.height * scale;

    this.ctx.scale(scale, scale);

    this.points = [];

    const { viewBox, arrowSpacing, foregroundColor, type } = this.options;
    const [[minXPercent, minYPercent], [maxXPercent, maxYPercent]] = viewBox;

    const [pMinX, pMinY] = [minXPercent * this.width, minYPercent * this.height];
    const [pMaxX, pMaxY] = [maxXPercent * this.width, maxYPercent * this.height];

    for (
      let physicalX = pMinX;
      physicalX < pMaxX;
      physicalX += arrowSpacing
    ) {
      for (
        let physicalY = pMinY;
        physicalY < pMaxY;
        physicalY += arrowSpacing
      ) {
        const arrow = new Arrow({
          ctx: this.ctx,
          x: physicalX,
          y: physicalY,
          color: foregroundColor,
          showArrow: type === "ARROW",
        });
        const [logicalX, logicalY] = this.physicalToLogical(
          physicalX,
          physicalY,
        );

        this.points.push({
          arrow,
          logicalX,
          logicalY,
          physicalX,
          physicalY,
        });
      }
    }
  }
}
