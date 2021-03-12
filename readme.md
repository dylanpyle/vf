![](https://i.imgur.com/NXF0bPL.png)

# vf

A vector field playground.

## Usage

https://vector.demo.camp

Supports the following query parameters:

- `vx` - An equation for the X component of each vector
- `vy` - An equation for the Y component of each vector
- `l` - The spacing betweeen each arrow, in pixels

`vx` and `vy` should generally return values in the 0-1 range.

`l` can be any number, but it's best to stay above ~40px to achieve adequate
performnace.

Equations are evaluated as JavaScript (i.e. use `Math` functions as needed) [1] with
access to the following variables:
- `x`, `y` - The arrow's logical position (-1 to 1)
- `mX`, `mY` - The current logical position of the cursor (-1 to 1)
- `t` - A unit of time, which grows from 0-1 every 10 seconds

## Examples

- https://vector.demo.camp/?l=100&vx=t/(mX-x)&vy=t/(mY-y)
- https://vector.demo.camp/?vx=Math.pow(x%2C2)-Math.pow(y%2C2)&vy=5*x*y
- https://vector.demo.camp/?vx=Math.pow(x%2C2)-Math.pow(y%2C2)*4%2BmY&vy=2*x%2By%2BmX

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
