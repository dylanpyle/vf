export default class Arrow {
  private canvas: SVGElement;
  private el: SVGGElement;

  private x: number;
  private y: number;

  constructor(canvas: SVGElement, x: number, y: number) {
    this.canvas = canvas;
    this.el = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.canvas.appendChild(this.el);

    this.x = x;
    this.y = y;

    this.render({ magnitude: 0, direction: 0 });
  }

  public render({ magnitude, direction }: {
    magnitude: number;
    direction: number;
  }) {
    const { el } = this;

    const originX = this.x - (magnitude / 2);
    const originY = this.y - (magnitude / 2);
    el.setAttribute('transform', `translate(${originX}, ${originY})`);

    const degrees = direction * (180 / Math.PI);

    el.innerHTML = `
      <circle cx='0' cy='0' r='10' fill='green'></circle>
      <g transform='rotate(${degrees})' stroke='red' stroke-width='2'>
        <line x1='0' y1='0' x2='${magnitude}' y2='0'></line>
      </g>
    `;
  }

  public remove() {
    this.canvas.removeChild(this.el);
  }
}
