import Arrow from './arrow';

class VFCanvas {
  private el: SVGElement;
  private arrows: Arrow[][] = [];

  constructor(el: SVGElement) {
    this.el = el;
    el.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('resize', this.onWindowResize)
    this.setUpArrows();
  }

  private onMouseMove = (event: MouseEvent) => {
    for (let x = 0; x < this.arrows.length; x++) {
      for (let y = 0; y < this.arrows[x].length; y++) {
        this.arrows[x][y].render({
          magnitude: event.clientX,
          direction: event.clientY / 300
        });
      }
    }
  }

  private onWindowResize = (event: UIEvent) => {
    console.log(event);
    this.setUpArrows();
  }

  private setUpArrows() {
    for (let x = 0; x < this.arrows.length; x++) {
      for (let y = 0; y < this.arrows[x].length; y++) {
        this.arrows[x][y].remove();
      }
    }

    this.arrows = [];

    for (let x = 0; x < 10; x++) {
      this.arrows[x] = [];

      for (let y = 0; y < 10; y++) {
        const a = new Arrow(this.el, 50*x, 50*y);
        a.render({ magnitude: 10, direction: Math.PI/4 });
        this.arrows[x][y] = a;
      }
    }
  }

  private render() {

  }
}

const svg = document.querySelector('.app-canvas') as SVGElement;

if (!svg) {
  throw new Error('Missing .app-canvas element');
}

new VFCanvas(svg);
