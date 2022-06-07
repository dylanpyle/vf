import {
  PointConstructorOptions,
  PointElement,
  PointRenderOptions,
} from "../types";

export default class Eye implements PointElement {
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

  public render({ magnitude, direction }: PointRenderOptions) {
    const { ctx } = this;

    const originX = -1 * (magnitude / 2);
    const endX = originX + magnitude;

    ctx.translate(this.x, this.y);
    ctx.strokeStyle = this.color;
    ctx.fillStyle = this.color;

    ctx.beginPath();
    ctx.arc(0, 0, this.spacing / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.rotate(direction);
    ctx.moveTo(endX, 0);
    ctx.arc(0, 0, magnitude, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();

    // Reset transformation
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}
