// src/components/CanvasGameBoard.tsx
import React from 'react';
import { View, Dimensions, PanResponder } from 'react-native';
import Svg, { Line, Polygon, Rect } from 'react-native-svg';
import { Arrow } from '../types/gameTypes';

const CanvasGameBoard: React.FC = ({ grid, onTilePress }) => {
  const screenWidth = Dimensions.get('window').width;
  const cellSize = (screenWidth - 40) / grid.length;
  
  const renderArrow = (arrow: Arrow, row: number, col: number) => {
    const startX = col * cellSize;
    const startY = row * cellSize;
    const endX = arrow.direction === '→' ? startX + cellSize * 4 : startX;
    const endY = arrow.direction === '↓' ? startY + cellSize * 4 : startY;
    
    // Draw thick line for shaft
    return (
      <>
        <Line
          x1={startX + cellSize/2}
          y1={startY + cellSize/2}
          x2={endX + cellSize/2}
          y2={endY + cellSize/2}
          stroke="#4A90E2"
          strokeWidth={cellSize * 0.6}
          strokeLinecap="round"
        />
        {/* Draw arrowhead */}
        <Polygon
          points={getArrowheadPoints(startX, startY, endX, endY, cellSize)}
          fill="#4A90E2"
        />
      </>
    );
  };
  
  return (
    <Svg width={screenWidth - 40} height={screenWidth - 40}>
      {arrows.map(arrow => renderArrow(arrow))}
    </Svg>
  );
};