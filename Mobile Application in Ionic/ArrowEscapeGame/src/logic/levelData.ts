import { Level } from '../types/gameTypes';

export const levels: Level[] = [
  // Level 1 (Easy)
  {
    id: 1,
    size: 5,
    arrows: [
      { row: 0, col: 2, direction: '↓' },
      { row: 1, col: 1, direction: '→' },
      { row: 2, col: 0, direction: '↑' },
      { row: 2, col: 4, direction: '←' },
      { row: 3, col: 3, direction: '↓' },
      { row: 4, col: 2, direction: '↑' },
    ]
  },
  
  // Level 2 (Medium)
  {
    id: 2,
    size: 5,
    arrows: [
      { row: 0, col: 0, direction: '→' },
      { row: 0, col: 3, direction: '↓' },
      { row: 1, col: 2, direction: '←' },
      { row: 2, col: 1, direction: '→' },
      { row: 2, col: 4, direction: '↑' },
      { row: 3, col: 0, direction: '↓' },
      { row: 4, col: 2, direction: '←' },
    ]
  },
  
  // Level 3 (Hard)
  {
    id: 3,
    size: 6,  // Bigger grid: 6x6
    arrows: [
      { row: 0, col: 1, direction: '↓' },
      { row: 0, col: 4, direction: '→' },
      { row: 1, col: 3, direction: '↑' },
      { row: 2, col: 0, direction: '→' },
      { row: 2, col: 5, direction: '←' },
      { row: 3, col: 2, direction: '↓' },
      { row: 4, col: 4, direction: '↑' },
      { row: 5, col: 1, direction: '←' },
      { row: 5, col: 3, direction: '↓' },
    ]
  },
  
  // Level 4 (Expert)
  {
    id: 4,
    size: 6,
    arrows: [
      { row: 0, col: 3, direction: '←' },
      { row: 1, col: 1, direction: '→' },
      { row: 1, col: 4, direction: '↓' },
      { row: 2, col: 0, direction: '↓' },
      { row: 2, col: 2, direction: '→' },
      { row: 3, col: 5, direction: '↑' },
      { row: 4, col: 1, direction: '←' },
      { row: 4, col: 3, direction: '→' },
      { row: 5, col: 2, direction: '↑' },
    ]
  },

  {
    id: 5,
    size: 6,
    arrows: [
      { row: 0, col: 1, direction: '↓' },
      { row: 0, col: 4, direction: '→' },
      { row: 1, col: 0, direction: '→' },
      { row: 1, col: 3, direction: '↑' },
      { row: 2, col: 2, direction: '↓' },
      { row: 2, col: 5, direction: '←' },
      { row: 3, col: 1, direction: '→' },
      { row: 3, col: 4, direction: '↑' },
      { row: 4, col: 2, direction: '↓' },
      { row: 5, col: 3, direction: '←' },
      { row: 5, col: 5, direction: '↑' },
    ]
  },
  {
    id: 6,
    size: 7,
    arrows: [
      { row: 0, col: 1, direction: '↓' },    { row: 0, col: 3, direction: '→' },
      { row: 0, col: 5, direction: '↓' },    { row: 1, col: 0, direction: '→' },
      { row: 1, col: 2, direction: '↑' },    { row: 1, col: 4, direction: '↓' },
      { row: 1, col: 6, direction: '←' },    { row: 2, col: 1, direction: '→' },
      { row: 2, col: 3, direction: '↑' },    { row: 2, col: 5, direction: '↓' },
      { row: 3, col: 0, direction: '→' },    { row: 3, col: 2, direction: '←' },
      { row: 3, col: 4, direction: '↓' },    { row: 3, col: 6, direction: '↑' },
      { row: 4, col: 1, direction: '→' },    { row: 4, col: 3, direction: '←' },
      { row: 4, col: 5, direction: '↑' },    { row: 5, col: 0, direction: '↓' },
      { row: 5, col: 2, direction: '→' },    { row: 5, col: 4, direction: '←' },
      { row: 5, col: 6, direction: '↓' },    { row: 6, col: 1, direction: '↑' },
      { row: 6, col: 3, direction: '→' },    { row: 6, col: 5, direction: '←' },
    ]
  }
];

// This calculates total levels automatically
export const totalLevels = levels.length;