import {
  PointConstructorOptions,
  PointElement,
  PointRenderOptions,
  PointType,
} from "../types";

export default class Arrow implements PointElement {
  private ctx: CanvasRenderingContext2D;
  private x: number;
  private y: number;
  private color: string;
  private type: PointType;

  constructor({ ctx, x, y, color, type }: PointConstructorOptions) {
    this.ctx = ctx;

    this.x = x;
    this.y = y;
    this.color = color;
    this.type = type;
  }

  public render({ magnitude, direction }: PointRenderOptions) {
    const { ctx } = this;

    // Line
    const originX = -1 * (magnitude / 2);
    const endX = originX + magnitude;

    ctx.translate(this.x, this.y);
    ctx.rotate(direction);

    ctx.beginPath();

    ctx.lineTo(originX, 0);
    ctx.lineTo(endX, 0);

    if (this.type === "ARROW") {
      // Arrowhead
      ctx.moveTo(endX, 0);
      ctx.lineTo(endX - 7, -3);
      ctx.moveTo(endX, 0);
      ctx.lineTo(endX - 7, 3);
    }

    ctx.closePath();
    ctx.strokeStyle = this.color;
    ctx.stroke();

    // Reset transformation
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}
