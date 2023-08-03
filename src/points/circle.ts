import {
  PointConstructorOptions,
  PointElement,
  PointRenderOptions,
  PointType,
} from "../types";

export default class Circle implements PointElement {
  private ctx: CanvasRenderingContext2D;
  private x: number;
  private y: number;
  private type: PointType;
  private color: string;

  constructor({ ctx, x, y, type, color }: PointConstructorOptions) {
    this.ctx = ctx;

    this.x = x;
    this.y = y;
    this.color = color;
    this.type = type;
  }

  public render({ magnitude }: PointRenderOptions) {
    const { ctx } = this;

    ctx.beginPath();
    ctx.translate(this.x, this.y);
    ctx.arc(0, 0, magnitude / 2, 0, Math.PI * 2);
    ctx.closePath();

    switch (this.type) {
      case "FILLED_CIRCLE": {
        ctx.fillStyle = this.color;
        ctx.fill();
        break;
      }

      case "OUTLINED_CIRCLE": {
        ctx.strokeStyle = this.color;
        ctx.stroke();
        break;
      }
    }

    // Reset transformation
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}
