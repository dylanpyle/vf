![](https://i.imgur.com/NXF0bPL.png)

# vf

A vector field and visual effect playground.

## Demo

https://vector.demo.camp

## Usage

(Though we do host a copy, you can too - hotlink at your own risk)

```
<script src='https://vector.demo.camp/lib.js'></script>

<script>
  new VFCanvas({
    el: canvas,
    xEquation: "mX - x",
    yEquation: "(mY - y) + Math.cos((2*t - 1) * Math.PI)",

    backgroundColor: '#fff',
    foregroundColor: '#000',

    type: 'DOT',
    clamp: true,
    spacing: 40
  });
</script>
```
Supports the following required options:
- `el` — a `HTMLCanvasElement`
- `xEquation` — An equation for the X component of each vector
  - e.g. `vx=Math.pow(x,2)-mX`
  - Should generally return values in the 0-1 range.
- `yEquation` — An equation for the Y component of each vector
  - e.g. `vx=Math.pow(Y,2)-mY`
  - Should generally return values in the 0-1 range.
- `backgroundColor` — The background color (e.g. `#000` or `magenta`)
- `foregroundColor` — The foreground color
- `type` — The type of stroke to draw (`ARROW` or `LINE`)
  - See the demo above for different examples
- `clamp` — Whether or not to restrict equation outputs to values of 0-1.
- `spacing` — The spacing betweeen each arrow, in pixels
  - Can be any number, but it's best to stay above ~30px to achieve adequate performnace.

## Writing Equations

Equations are evaluated as JavaScript (i.e. use `Math` functions as needed) [^1] with
access to the following variables:

- `x`, `y` - The arrow's logical position (-1 to 1)
- `mX`, `mY` - The current logical position of the cursor (-1 to 1)
- `t` - A unit of time, which grows from 0-1 every 10 seconds

## Examples

- https://vector.demo.camp/?l=100&vx=t/(mX-x)&vy=t/(mY-y)
- https://vector.demo.camp/?vx=Math.pow(x%2C2)-Math.pow(y%2C2)&vy=5*x*y
- https://vector.demo.camp/?vx=Math.pow(x%2C2)-Math.pow(y%2C2)*4%2BmY&vy=2*x%2By%2BmX
- https://vector.demo.camp/?fg=magenta&type=LINE

## Local Development

### Prerequisites

- [yarn](https://classic.yarnpkg.com/en/) (for esbuild)
- [deno](https://deno.land/) (for tooling)
- [fswatch](https://github.com/emcrisostomo/fswatch#getting-fswatch) (for dev server)

### Usage

```
./x dev
```

## License

MIT

## Footnotes

[^1]: No built-in XSS protections are in place, so careful when passing user
  input, or clicking unfamiliar links on the demo domain.
