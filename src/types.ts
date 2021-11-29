export type Type = "ARROW" | "LINE" | "DOT" | "DEBUG";

export interface PointConstructorOptions {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  color: string;
  type: Type;
}

export interface PointRenderOptions {
  magnitude: number; // pixels
  direction: number; // radians 0-2π
}

export abstract class PointElement {
  constructor(_options: PointConstructorOptions) {}
  abstract render(properties: PointRenderOptions): void;
}
