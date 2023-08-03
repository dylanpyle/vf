import {
  PointConstructorOptions,
  PointElement,
  PointRenderOptions,
} from "../types";

export default class ThickLine implements PointElement {
  private ctx: CanvasRenderingContext2D;
  private x: number;
  private y: number;
  private color: string;

  constructor({ ctx, x, y, color }: PointConstructorOptions) {
    this.ctx = ctx;

    this.x = x;
    this.y = y;
    this.color = color;
  }

  public render({ magnitude, direction }: PointRenderOptions) {
    const { ctx } = this;

    const originX = -8;
    const endX = 8;

    ctx.translate(this.x, this.y);
    ctx.rotate(direction);

    ctx.beginPath();

    ctx.lineTo(originX, 0);
    ctx.lineTo(endX, 0);

    ctx.closePath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = magnitude;
    ctx.stroke();

    // Reset transformation
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}
