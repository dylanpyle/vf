export type PointType =
  | "ARROW"
  | "LINE"
  | "SPACETIME"
  | "DOT"
  | "CIRCLE"
  | "EYE"
  | "DEBUG";

export interface Point {
  logicalX: number;
  logicalY: number;
  physicalX: number;
  physicalY: number;
  element: PointElement;
}

export interface PointConstructorOptions {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  color: string;
  type: PointType;
  spacing: number;
  pointsArray: Point[];
  pointsArrayIndex: number;
}

export interface PointRenderOptions {
  magnitude: number; // pixels
  direction: number; // radians 0-2π
}

export abstract class PointElement {
  constructor(_options: PointConstructorOptions) {}
  abstract render(properties: PointRenderOptions): void;
}
