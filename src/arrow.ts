export default class Arrow {
  private ctx: CanvasRenderingContext2D;

  private x: number;
  private y: number;

  constructor(ctx: CanvasRenderingContext2D, x: number, y: number) {
    this.ctx = ctx;

    this.x = x;
    this.y = y;
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

    ctx.moveTo(originX, 0);
    ctx.lineTo(endX, 0);

    ctx.lineTo(endX - 7, -3);
    ctx.moveTo(endX, 0);
    ctx.lineTo(endX - 7, 3);

    ctx.closePath();
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();

    // Reset transformation
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  public remove() {
    // noop
  }
}
