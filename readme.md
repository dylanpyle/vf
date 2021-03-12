# vf

A vector field renderer.

## Demo

https://dylanpyle.github.io/vf/

Provide equations (Vx, Vy) as query parameters.

Equations are evaluated as JavaScript (i.e. use `Math` functions as needed) [1] with
access to the following variables:
- `x`, `y` - The arrow's logical position (-1 to 1)
- `mX`, `mY` - The current logical position of the cursor (-1 to 1)

e.g.: https://dylanpyle.github.io/vf?vx=mX-x&vy=mY-y

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
