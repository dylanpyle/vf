import {
  PointConstructorOptions,
  PointElement,
  PointRenderOptions,
} from "../types";

export default class Debug implements PointElement {
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

    ctx.font = "10px sans-serif";
    ctx.fillStyle = this.color;
    ctx.fillText(
      `(${this.x}, ${this.y})\nm:${magnitude.toFixed(2)} d:${
        direction.toFixed(2)
      }`,
      this.x,
      this.y,
    );
    // Reset transformation
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}
