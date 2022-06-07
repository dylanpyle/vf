import {
  PointConstructorOptions,
  PointElement,
  PointRenderOptions,
  PointType,
} from "../types";

export default class Dot implements PointElement {
  private ctx: CanvasRenderingContext2D;
  private x: number;
  private y: number;
  private type: PointType;

  constructor({ ctx, x, y, type }: PointConstructorOptions) {
    this.ctx = ctx;

    this.x = x;
    this.y = y;
    this.type = type;
  }

  public render({ magnitude, direction }: PointRenderOptions) {
    const { ctx } = this;

    ctx.beginPath();
    ctx.translate(this.x, this.y);

    ctx.arc(0, 0, magnitude / 2, 0, Math.PI * 2);

    ctx.closePath();

    switch (this.type) {
      case "DOT": {
        ctx.fillStyle = `HSL(${direction}rad, 70%, 60%)`;
        ctx.fill();
        break;
      }

      case "CIRCLE": {
        ctx.strokeStyle = `HSL(${direction}rad, 70%, 60%)`;
        ctx.stroke();
        break;
      }
    }

    // Reset transformation
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}
