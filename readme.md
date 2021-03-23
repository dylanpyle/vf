![](https://i.imgur.com/NXF0bPL.png)

# vf

A vector field playground.

## Usage

https://vector.demo.camp

Supports the following optional query parameters:

- `vx` — An equation for the X component of each vector
  - e.g. `vx=Math.pow(x,2)-mX`
  - Should generally return values in the 0-1 range.
- `vy` — An equation for the Y component of each vector
  - e.g. `vx=Math.pow(Y,2)-mY`
  - Should generally return values in the 0-1 range.
- `l` — The spacing betweeen each arrow, in pixels
  - default: `40`
  - e.g. `l=50`
  - Can be any number, but it's best to stay above ~30px to achieve adequate performnace.
- `fg` — The foreground color
  - default: `#fff`
  - e.g. `fg=%23ff00ff`, or `fg=magenta`
- `bg` — The foreground color
  - default: `#000`
  - e.g. `bg=%2300ffff`, or `bg=cyan`
- `style` — The type of stroke to draw (`ARROW` or `LINE`)
  - default: `ARROW`

Equations are evaluated as JavaScript (i.e. use `Math` functions as needed) [1] with
access to the following variables:
- `x`, `y` - The arrow's logical position (-1 to 1)
- `mX`, `mY` - The current logical position of the cursor (-1 to 1)
- `t` - A unit of time, which grows from 0-1 every 10 seconds

## Examples

- https://vector.demo.camp/?l=100&vx=t/(mX-x)&vy=t/(mY-y)
- https://vector.demo.camp/?vx=Math.pow(x%2C2)-Math.pow(y%2C2)&vy=5*x*y
- https://vector.demo.camp/?vx=Math.pow(x%2C2)-Math.pow(y%2C2)*4%2BmY&vy=2*x%2By%2BmX
- https://vector.demo.camp/?fg=magenta&style=LINE

## Embedding in other documents

— works exactly like you'd hope.

```html
<iframe src='https://vector.demo.camp/?l=20&vx=x&vy=y' height='500' width='500' />
```

## Local Development

### Prerequisites

deno, yarn

### Usage

```
./x dev
```

## License

MIT

## Footnotes

[1]: No XSS protections currently in place, so careful when clicking unfamiliar links.
