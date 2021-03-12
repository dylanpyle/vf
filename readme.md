# vf

A vector field renderer.

## Demo

https://vector.demo.camp

Provide equations (Vx, Vy) as query parameters.

Equations are evaluated as JavaScript (i.e. use `Math` functions as needed) [1] with
access to the following variables:
- `x`, `y` - The arrow's logical position (-1 to 1)
- `mX`, `mY` - The current logical position of the cursor (-1 to 1)

e.g.: https://vector.demo.camp/?vx=Math.pow(x%2C2)-Math.pow(y%2C2)*4%2BmY&vy=2*x%2By%2BmX

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
