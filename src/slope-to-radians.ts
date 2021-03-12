// Quick geometry refresher:
//
//                B
//             /|
//      c    // |
//         //   |
//       //     |  a
//     //       |
//    /_________|
//  A      b      C
//
//  a² + b² = c²
//  sin A = a / c
//
// In this scenario, (b) is X, (a) is Y
export default function slopeToRadians(x: number, y: number): number {
  const b = Math.abs(x);
  const a = Math.abs(y);
  const c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
  const angle = Math.asin(a / c);

  if (x >= 0 && y >= 0) return angle; // I
  else if (x < 0 && y > 0) return angle + (Math.PI * 0.5); // II
  else if (x < 0 && y <= 0) return angle + Math.PI; // III
  else if (x >= 0 && y < 0) return angle + (Math.PI * 1.5); // IV
  else {
    throw new Error(`bad quadrant ${x},${y}`);
  }
}
