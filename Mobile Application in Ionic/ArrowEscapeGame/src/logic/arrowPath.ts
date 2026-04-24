import { Direction } from '../types/gameTypes';

export interface ArrowPath {
  startRow: number;
  startCol: number;
  direction: Direction;
  cells: { row: number; col: number }[]; // All cells this arrow occupies
}

export const calculateArrowPath = (
  row: number,
  col: number,
  direction: Direction,
  gridSize: number
): ArrowPath => {
  const cells: { row: number; col: number }[] = [{ row, col }];
  
  switch (direction) {
    case '↑':
      for (let r = row - 1; r >= 0; r--) {
        cells.push({ row: r, col });
      }
      break;
    case '↓':
      for (let r = row + 1; r < gridSize; r++) {
        cells.push({ row: r, col });
      }
      break;
    case '←':
      for (let c = col - 1; c >= 0; c--) {
        cells.push({ row, col: c });
      }
      break;
    case '→':
      for (let c = col + 1; c < gridSize; c++) {
        cells.push({ row, col: c });
      }
      break;
  }
  
  return { startRow: row, startCol: col, direction, cells };
};