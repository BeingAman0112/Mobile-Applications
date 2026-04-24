import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import ArrowTile from './ArrowTile';
import { Grid, Arrow } from '../types/gameTypes';
import { calculateArrowPath } from '../logic/arrowPath';

interface GameBoardProps {
  grid: Grid;
  onTilePress: (row: number, col: number) => void;
  lastRemovedPosition?: { row: number; col: number } | null;
}

const GameBoard: React.FC<GameBoardProps> = ({ grid, onTilePress, lastRemovedPosition }) => {
  const screenWidth = Dimensions.get('window').width;
  const boardSize = grid.length;
  const tileSize = (screenWidth - 40) / boardSize;

  // Calculate which cells are part of arrow paths
  const arrowPaths = useMemo(() => {
    const paths = new Map<string, { isHead: boolean; direction: any }>();
    
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        const cell = grid[row][col];
        if (cell.arrow) {
          const path = calculateArrowPath(row, col, cell.arrow.direction, boardSize);
          path.cells.forEach((cell, index) => {
            const key = `${cell.row},${cell.col}`;
            paths.set(key, {
              isHead: index === 0,
              direction: cell.row?.direction,
            });
          });
        }
      }
    }
    return paths;
  }, [grid, boardSize]);

  const getCellDisplay = (row: number, col: number) => {
    const cell = grid[row][col];
    const pathInfo = arrowPaths.get(`${row},${col}`);
    
    if (cell.arrow) {
      // This is an arrow head
      return {
        type: 'head' as const,
        direction: cell.arrow.direction,
        isActive: lastRemovedPosition?.row === row && lastRemovedPosition?.col === col,
      };
    } else if (pathInfo && !pathInfo.isHead) {
      // This is part of an arrow's body
      return {
        type: 'body' as const,
        direction: pathInfo.direction,
        isActive: false,
      };
    } else {
      // Empty cell
      return {
        type: 'empty' as const,
        direction: null,
        isActive: false,
      };
    }
  };

  return (
    <View style={styles.container}>
      {grid.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((_, colIndex) => {
            const display = getCellDisplay(rowIndex, colIndex);
            
            return (
              <ArrowTile
                key={`${rowIndex}-${colIndex}`}
                direction={display.type === 'head' ? display.direction : null}
                isArrowHead={display.type === 'head'}
                isArrowBody={display.type === 'body'}
                arrowDirection={display.type === 'body' ? display.direction : undefined}
                onPress={() => onTilePress(rowIndex, colIndex)}
                isActive={display.isActive}
                style={{ width: tileSize, height: tileSize }}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  row: {
    flexDirection: 'row',
  },
});

export default GameBoard;