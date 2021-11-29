import {
  PointConstructorOptions,
  PointElement,
  PointRenderOptions,
} from "../types";

export default class Dot implements PointElement {
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

    ctx.beginPath();

    ctx.arc(this.x, this.y, magnitude / 2, 0, Math.PI * 2);

    ctx.closePath();
    ctx.fillStyle = `HSL(${direction}rad, 70%, 60%)`;
    ctx.fill();

    // Reset transformation
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}
