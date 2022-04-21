import {
  PointConstructorOptions,
  PointElement,
  PointRenderOptions,
} from "../types";

export default class Circle implements PointElement {
  private ctx: CanvasRenderingContext2D;
  private x: number;
  private y: number;

  constructor({ ctx, x, y }: PointConstructorOptions) {
    this.ctx = ctx;

    this.x = x;
    this.y = y;
  }

  public render({ magnitude, direction }: PointRenderOptions) {
    const { ctx } = this;

    ctx.beginPath();

    ctx.arc(this.x, this.y, magnitude / 2, 0, Math.PI * 2);

    ctx.closePath();
    ctx.strokeStyle = `HSL(${direction}rad, 70%, 60%)`;
    ctx.stroke();

    // Reset transformation
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}
