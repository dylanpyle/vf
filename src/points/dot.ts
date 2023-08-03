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
  private spacing: number;

  constructor({ ctx, x, y, color, spacing }: PointConstructorOptions) {
    this.ctx = ctx;

    this.x = x;
    this.y = y;
    this.color = color;
    this.spacing = spacing;
  }

  public render({ direction }: PointRenderOptions) {
    const { ctx } = this;

    ctx.beginPath();
    ctx.translate(this.x, this.y);

    ctx.rotate(direction);
    ctx.translate(this.spacing / 2, this.spacing / 2);
    ctx.arc(0, 0, 1, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();

    // Reset transformation
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}
