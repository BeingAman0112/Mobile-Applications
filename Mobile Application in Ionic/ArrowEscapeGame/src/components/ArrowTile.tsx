import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Direction } from '../types/gameTypes';

interface ArrowTileProps {
  direction: Direction | null;
  isArrowHead?: boolean;
  isArrowBody?: boolean;
  arrowDirection?: Direction;
  onPress: () => void;
  isActive: boolean;
}

const ArrowTile: React.FC<ArrowTileProps> = ({
  direction,
  isArrowHead = false,
  isArrowBody = false,
  arrowDirection,
  onPress,
  isActive,
}) => {
  
  if (!direction && !isArrowBody) {
    return <View style={[styles.emptyTile, isActive && styles.activeTile]} />;
  }
  
  if (isArrowBody) {
    return (
      <View style={[styles.bodyTile, isActive && styles.activeTile]}>
        <View style={[
          styles.shaft,
          arrowDirection === '←' || arrowDirection === '→' ? styles.shaftHorizontal : styles.shaftVertical
        ]} />
      </View>
    );
  }
  
  // Arrow head
  return (
    <TouchableOpacity 
      style={[styles.headTile, isActive && styles.activeTile]} 
      onPress={onPress}
    >
      <View style={[styles.arrowContainer, getRotation(direction)]}>
        <View style={styles.arrowHead} />
      </View>
    </TouchableOpacity>
  );
};

const getRotation = (direction: Direction) => {
  switch(direction) {
    case '→': return styles.rotate0;
    case '↓': return styles.rotate90;
    case '←': return styles.rotate180;
    case '↑': return styles.rotate270;
    default: return styles.rotate0;
  }
};

const styles = StyleSheet.create({
  emptyTile: {
    flex: 1,
    margin: 2,
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
    aspectRatio: 1,
  },
  bodyTile: {
    flex: 1,
    margin: 2,
    backgroundColor: '#E3F2FD',
    borderRadius: 6,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headTile: {
    flex: 1,
    margin: 2,
    backgroundColor: '#4A90E2',
    borderRadius: 6,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // 3D Shadow effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  activeTile: {
    backgroundColor: '#50C878',
    transform: [{ scale: 0.95 }],
  },
  arrowContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowHead: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 12,
    borderBottomWidth: 12,
    borderLeftWidth: 20,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'white',
  },
  shaft: {
    backgroundColor: '#4A90E2',
    borderRadius: 3,
  },
  shaftHorizontal: {
    width: '70%',
    height: 8,
  },
  shaftVertical: {
    width: 8,
    height: '70%',
  },
  rotate0: { transform: [{ rotate: '0deg' }] },
  rotate90: { transform: [{ rotate: '90deg' }] },
  rotate180: { transform: [{ rotate: '180deg' }] },
  rotate270: { transform: [{ rotate: '270deg' }] },
});

export default ArrowTile;