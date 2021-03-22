import Arrow from "./arrow";

const slopeToRadians = (x: number, y: number): number =>
  (Math.PI * 2) - Math.atan2(y, x);

interface Point {
  logicalX: number;
  logicalY: number;
  physicalX: number;
  physicalY: number;
  arrow: Arrow;
}

interface Options {
  el: HTMLCanvasElement;
  vx: string;
  vy: string;
  arrowSpacing: number;
}

export default class VFCanvas {
  private el: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private points: Point[] = [];
  private arrowSpacing: number;

  private logicalMouseX: number = 0;
  private logicalMouseY: number = 0;

  private xEquation: string;
  private yEquation: string;

  constructor({ el, vx, vy, arrowSpacing }: Options) {
    this.el = el;
    const ctx = el.getContext("2d");

    if (!ctx) {
      throw new Error("Could not get canvas context");
    }

    this.ctx = ctx;
    this.xEquation = vx;
    this.yEquation = vy;
    this.arrowSpacing = arrowSpacing;
    el.addEventListener("mousemove", this.onMouseMove);
    el.addEventListener("touchmove", this.onTouchMove);
    window.addEventListener("resize", this.onWindowResize);
    this.setUpArrows();
    this.renderArrows();
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

    const x = evaluate(this.xEquation);
    const y = evaluate(this.yEquation);
    const magnitude = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) *
      this.arrowSpacing;

    return {
      magnitude,
      direction: slopeToRadians(x, y),
    };
  }

  private renderArrows = () => {
    this.ctx.clearRect(0, 0, this.el.width, this.el.height);

    for (const point of this.points) {
      point.arrow.render(this.getArrowProperties(point));
    }

    requestAnimationFrame(this.renderArrows);
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
    this.setUpArrows();
  };

  // [[minX, minY], [maxX, maxY]]
  private getLogicalBounds(): [[number, number], [number, number]] {
    const aspectRatio = this.el.width / this.el.height;

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

    const [pMaxX, pMaxY] = [this.el.width, this.el.height];

    const percentX = physicalX / pMaxX;
    const percentY = 1 - (physicalY / pMaxY);

    const logicalX = lMinX + ((lMaxX - lMinX) * percentX);
    const logicalY = lMinY + ((lMaxY - lMinY) * percentY);
    return [logicalX, logicalY];
  }

  private setUpArrows() {
    this.el.width = this.el.clientWidth * window.devicePixelRatio;
    this.el.height = this.el.clientHeight * window.devicePixelRatio;

    for (const point of this.points) {
      point.arrow.remove();
    }

    this.points = [];

    const [pMinX, pMinY] = [0, 0];
    const [pMaxX, pMaxY] = [this.el.width, this.el.height];

    for (
      let physicalX = pMinX;
      physicalX < pMaxX;
      physicalX += this.arrowSpacing
    ) {
      for (
        let physicalY = pMinY;
        physicalY < pMaxY;
        physicalY += this.arrowSpacing
      ) {
        const arrow = new Arrow(this.ctx, physicalX, physicalY);
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
