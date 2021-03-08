export default class Arrow {
  private canvas: SVGElement;
  private el: SVGGElement;

  private x: number;
  private y: number;

  constructor(canvas: SVGElement, x: number, y: number) {
    this.canvas = canvas;
    this.el = document.createElementNS("http://www.w3.org/2000/svg", "g");
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

    const degrees = direction * (180 / Math.PI);

    const originX = this.x - (magnitude / 2);
    el.setAttribute("stroke", "red");
    el.setAttribute("stroke-width", "2");
    el.setAttribute(
      "transform",
      `translate(${originX}, ${this.y}) rotate(${degrees} ${magnitude / 2} 0)`,
    );

    el.innerHTML = `
      <line x1='0' y1='0' x2='${magnitude}' y2='0'></line>
      <line x1='${magnitude}' y1='0' x2='${magnitude - 7}' y2='-5'></line>
      <line x1='${magnitude}' y1='0' x2='${magnitude - 7}' y2='5'></line>
    `;
  }

  public remove() {
    this.canvas.removeChild(this.el);
  }
}
