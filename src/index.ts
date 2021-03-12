import Arrow from "./arrow";
import slopeToRadians from "./slope-to-radians";

const ARROW_SPACING = 30;

interface Point {
  logicalX: number;
  logicalY: number;
  physicalX: number;
  physicalY: number;
  arrow: Arrow;
}

class VFCanvas {
  private el: SVGElement;
  private points: Point[] = [];

  constructor(el: SVGElement) {
    this.el = el;
    el.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("resize", this.onWindowResize);
    this.setUpArrows();
  }

  private onMouseMove = (event: MouseEvent) => {
    for (const point of this.points) {
      point.arrow.render({
        magnitude: Math.min(event.clientX, ARROW_SPACING),
        direction: event.clientY / 300,
      });
    }
  };

  private onWindowResize = (event: UIEvent) => {
    console.log(event);
    this.setUpArrows();
  };

  // [[minX, minY], [maxX, maxY]]
  private getLogicalBounds(): [[number, number], [number, number]] {
    const { clientWidth, clientHeight } = this.el;

    const aspectRatio = clientWidth / clientHeight;

    return aspectRatio > 1
      ? [[-1, -1 / aspectRatio], [1, 1 / aspectRatio]]
      : [[aspectRatio / -1, -1], [aspectRatio / 1, 1]];
  }

  private setUpArrows() {
    const [
      [lMinX, lMinY],
      [lMaxX, lMaxY],
    ] = this.getLogicalBounds();

    const [pMinX, pMinY] = [0, 0];
    const [pMaxX, pMaxY] = [this.el.clientWidth, this.el.clientHeight];
    const [pMidX, pMidY] = [(pMinX + pMaxX) / 2, (pMinY + pMaxY) / 2];

    /*
    this.el.innerHTML += `
      <line stroke='white' x1='${pMidX}' y1='${pMinY}' x2='${pMidX}' y2='${pMaxY}' />
      <line stroke='white' x1='${pMinX}' y1='${pMidY}' x2='${pMaxX}' y2='${pMidY}' />
    `;
    */

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

    console.log(this.points);
  }
}

const svg = document.querySelector(".app-canvas") as SVGElement;

if (!svg) {
  throw new Error("Missing .app-canvas element");
}

new VFCanvas(svg);
