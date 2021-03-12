import Arrow from "./arrow";

const ARROW_SPACING = 60;

const slopeToRadians = (x: number, y: number): number => Math.atan2(y, x);

interface Point {
  logicalX: number;
  logicalY: number;
  physicalX: number;
  physicalY: number;
  arrow: Arrow;
}

export default class VFCanvas {
  private el: SVGElement;
  private points: Point[] = [];
  private elWidth: number = 0;
  private elHeight: number = 0;

  private logicalMouseX: number = 0;
  private logicalMouseY: number = 0;

  private xEquation: string;
  private yEquation: string;

  constructor(el: SVGElement, vx: string, vy: string) {
    this.el = el;
    this.xEquation = vx;
    this.yEquation = vy;
    el.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("resize", this.onWindowResize);
    this.setUpArrows();
  }

  private onMouseMove = (event: MouseEvent) => {
    requestAnimationFrame(
      this.updateWithMousePosition.bind(this, event.clientX, event.clientY),
    );
  };

  private getArrowProperties(
    point: Point,
  ): { magnitude: number; direction: number } {
    const evaluate = (equation: string): number =>
      eval(`
      (function() {
        const x = ${point.logicalX};
        const y = ${point.logicalY};
        const mX = ${this.logicalMouseX};
        const mY = ${this.logicalMouseY};
        return ${equation};
      })();
    `);

    const x = evaluate(this.xEquation);
    const y = evaluate(this.yEquation);
    const magnitude = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) *
      ARROW_SPACING;

    return {
      magnitude,
      direction: slopeToRadians(x, y),
    };
  }

  private renderArrows() {
    for (const point of this.points) {
      point.arrow.render(this.getArrowProperties(point));
    }
  }

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
    this.renderArrows();
  };

  private onWindowResize = () => {
    this.setUpArrows();
  };

  // [[minX, minY], [maxX, maxY]]
  private getLogicalBounds(): [[number, number], [number, number]] {
    const aspectRatio = this.elWidth / this.elHeight;

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

    const [pMaxX, pMaxY] = [this.elWidth, this.elHeight];

    const percentX = physicalX / pMaxX;
    const percentY = physicalY / pMaxY;

    const logicalX = lMinX + ((lMaxX - lMinX) * percentX);
    const logicalY = lMinY + ((lMaxY - lMinY) * percentY);
    return [logicalX, logicalY];
  }

  private setUpArrows() {
    this.elWidth = this.el.clientWidth;
    this.elHeight = this.el.clientHeight;

    for (const point of this.points) {
      point.arrow.remove();
    }

    this.points = [];

    const [pMinX, pMinY] = [0, 0];
    const [pMaxX, pMaxY] = [this.elWidth, this.elHeight];

    for (let physicalX = pMinX; physicalX < pMaxX; physicalX += ARROW_SPACING) {
      for (
        let physicalY = pMinY;
        physicalY < pMaxY;
        physicalY += ARROW_SPACING
      ) {
        const arrow = new Arrow(this.el, physicalX, physicalY);
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

    this.renderArrows();
  }
}
