import Arrow from "./arrow";

const ARROW_SPACING = 50;

class VFCanvas {
  private el: SVGElement;
  private arrows: Arrow[][] = [];

  constructor(el: SVGElement) {
    this.el = el;
    el.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("resize", this.onWindowResize);
    this.setUpArrows();
  }

  private onMouseMove = (event: MouseEvent) => {
    for (let x = 0; x < this.arrows.length; x++) {
      for (let y = 0; y < this.arrows[x].length; y++) {
        this.arrows[x][y].render({
          magnitude: Math.min(event.clientX, ARROW_SPACING),
          direction: event.clientY / 300,
        });
      }
    }
  };

  private onWindowResize = (event: UIEvent) => {
    console.log(event);
    this.setUpArrows();
  };

  private setUpArrows() {
    this.el.innerHTML += `
      <line stroke='black' x1='250' y1='0' x2='250' y2='500' stroke-width='3' />
      <line stroke='black' x1='0' y1='250' x2='500' y2='250' stroke-width='3' />
    `;

    for (let x = 0; x < this.arrows.length; x++) {
      for (let y = 0; y < this.arrows[x].length; y++) {
        this.arrows[x][y].remove();
      }
    }

    this.arrows = [];

    for (let x = 0; x < 10; x++) {
      this.arrows[x] = [];

      for (let y = 0; y < 10; y++) {
        const a = new Arrow(this.el, ARROW_SPACING * x, ARROW_SPACING * y);
        a.render({ magnitude: 10, direction: Math.PI / 4 });
        this.arrows[x][y] = a;
      }
    }
  }

  private render() {
  }
}

const svg = document.querySelector(".app-canvas") as SVGElement;

if (!svg) {
  throw new Error("Missing .app-canvas element");
}

new VFCanvas(svg);
