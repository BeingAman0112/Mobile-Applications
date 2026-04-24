export type Direction = '↑' | '↓' | '←' | '→';

export interface Arrow {
  row: number;
  col: number;
  direction: Direction;
}

export interface Cell {
  arrow: Arrow | null;
}

export type Grid = Cell[][];

export interface Level {
  id: number;
  size: number; // Size of grid (e.g., 5 for 5x5)
  arrows: Arrow[];
}