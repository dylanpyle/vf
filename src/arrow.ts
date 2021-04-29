interface Options {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  color: string;
  showArrow: boolean;
  strokeWidth: number;
}

export default class Arrow {
  private ctx: CanvasRenderingContext2D;
  private x: number;
  private y: number;
  private color: string;
  private showArrow: boolean;
  private strokeWidth: number;

  constructor({ ctx, x, y, color, showArrow, strokeWidth }: Options) {
    this.ctx = ctx;

    this.x = x;
    this.y = y;
    this.color = color;
    this.showArrow = showArrow;
    this.strokeWidth = strokeWidth;
  }

  public render({ magnitude, direction }: {
    magnitude: number;
    direction: number; // radians
  }) {
    const { ctx } = this;

    const originX = -1 * (magnitude / 2);
    const endX = originX + magnitude;

    ctx.translate(this.x, this.y);
    ctx.rotate(direction);

    ctx.beginPath();

    ctx.lineTo(originX, 0);
    ctx.lineTo(endX, 0);

    if (this.showArrow) {
      ctx.moveTo(endX, 0);
      ctx.lineTo(endX - 7, -3);
      ctx.moveTo(endX, 0);
      ctx.lineTo(endX - 7, 3);
    }

    ctx.closePath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.strokeWidth;
    ctx.stroke();

    // Reset transformation
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }
}
