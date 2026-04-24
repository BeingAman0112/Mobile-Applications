import { Grid, Direction, Arrow } from '../types/gameTypes';

// Create empty grid
export const createEmptyGrid = (size: number): Grid => {
  return Array(size).fill(null).map(() => 
    Array(size).fill(null).map(() => ({ arrow: null }))
  );
};

// Populate grid with arrows
export const populateGrid = (size: number, arrows: Arrow[]): Grid => {
  const grid = createEmptyGrid(size);
  arrows.forEach(arrow => {
    if (arrow.row < size && arrow.col < size) {
      grid[arrow.row][arrow.col].arrow = arrow;
    }
  });
  return grid;
};

// Check if arrow can be removed (path is clear)
export const canRemoveArrow = (grid: Grid, row: number, col: number, direction: Direction, size: number): boolean => {
  switch(direction) {
    case '↑': // Up
      for (let r = row - 1; r >= 0; r--) {
        if (grid[r][col].arrow !== null) return false;
      }
      break;
    case '↓': // Down
      for (let r = row + 1; r < size; r++) {
        if (grid[r][col].arrow !== null) return false;
      }
      break;
    case '←': // Left
      for (let c = col - 1; c >= 0; c--) {
        if (grid[row][c].arrow !== null) return false;
      }
      break;
    case '→': // Right
      for (let c = col + 1; c < size; c++) {
        if (grid[row][c].arrow !== null) return false;
      }
      break;
  }
  return true;
};

// Check if level is complete
export const isLevelComplete = (grid: Grid): boolean => {
  for (let row of grid) {
    for (let cell of row) {
      if (cell.arrow !== null) return false;
    }
  }
  return true;
};