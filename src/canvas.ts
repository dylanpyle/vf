import Arrow from "./arrow";

const ARROW_SPACING = 30;

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

  constructor(el: SVGElement) {
    this.el = el;
    el.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("resize", this.onWindowResize);
    this.setUpArrows();
  }

  private onMouseMove = (event: MouseEvent) => {
    requestAnimationFrame(
      this.updateWithMousePosition.bind(this, event.clientX, event.clientY),
    );
  };

  private updateWithMousePosition = (mouseX: number, mouseY: number) => {
    for (const point of this.points) {
      const distance = Math.sqrt(
        Math.pow(mouseX - point.physicalX, 2) +
          Math.pow(mouseY - point.physicalY, 2),
      );

      point.arrow.render({
        magnitude: (distance / this.elWidth) * ARROW_SPACING,
        direction: slopeToRadians(
          mouseX - point.physicalX,
          mouseY - point.physicalY,
        ),
      });
    }
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

  private setUpArrows() {
    this.elWidth = this.el.clientWidth;
    this.elHeight = this.el.clientHeight;

    const [
      [lMinX, lMinY],
      [lMaxX, lMaxY],
    ] = this.getLogicalBounds();

    const [pMinX, pMinY] = [0, 0];
    const [pMaxX, pMaxY] = [this.elWidth, this.elHeight];

    for (const point of this.points) {
      point.arrow.remove();
    }

    this.points = [];

    for (let physicalX = pMinX; physicalX < pMaxX; physicalX += ARROW_SPACING) {
      for (
        let physicalY = pMinY;
        physicalY < pMaxY;
        physicalY += ARROW_SPACING
      ) {
        const arrow = new Arrow(this.el, physicalX, physicalY);
        const percentX = physicalX / pMaxX;
        const percentY = physicalY / pMaxY;

        const logicalX = lMinX + ((lMaxX - lMinX) * percentX);
        const logicalY = lMinY + ((lMaxY - lMinY) * percentY);

        arrow.render({
          magnitude: ARROW_SPACING,
          direction: slopeToRadians(logicalX, logicalY),
        });

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
