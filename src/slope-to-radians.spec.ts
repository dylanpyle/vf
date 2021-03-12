import slopeToRadians from "./slope-to-radians.ts";
import { assertEquals } from "./test-deps.ts";

const equalIsh = (a: number, b: number) =>
  assertEquals(a.toFixed(2), b.toFixed(2));

Deno.test("slopeToRadians", function () {
  equalIsh(slopeToRadians(1, 0), 0);
  equalIsh(slopeToRadians(1, 1), Math.PI / 4);
  equalIsh(slopeToRadians(0, 1), Math.PI / 2);
  equalIsh(slopeToRadians(-1, 0), Math.PI);
  equalIsh(slopeToRadians(0, -1), Math.PI * 1.5);
});
