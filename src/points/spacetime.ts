import {
  Point,
  PointConstructorOptions,
  PointElement,
  PointRenderOptions,
} from "../types";

export default class Dot implements PointElement {
  private ctx: CanvasRenderingContext2D;
  private x: number;
  private y: number;
  private spacing: number;
  private pointsArray: Point[];
  private pointsArrayIndex: number;

  constructor(
    { ctx, x, y, spacing, pointsArray, pointsArrayIndex }:
      PointConstructorOptions,
  ) {
    this.ctx = ctx;

    this.x = x;
    this.y = y;
    this.spacing = spacing;
    this.pointsArray = pointsArray;
    this.pointsArrayIndex = pointsArrayIndex;
  }

  public render({ magnitude, direction }: PointRenderOptions) {
    const { ctx } = this;

    ctx.beginPath();
    ctx.translate(this.x, this.y);

    ctx.rotate(direction);
    ctx.translate(this.spacing / 2, this.spacing / 2);

    ctx.arc(0, 0, magnitude / 2, 0, Math.PI * 2);

    ctx.closePath();

    ctx.fillStyle = `HSL(${direction}rad, 70%, 60%)`;
    ctx.fill();

    // Reset transformation
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}
