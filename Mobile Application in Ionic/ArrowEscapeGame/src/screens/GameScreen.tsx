import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  Vibration,
} from 'react-native';
import GameBoard from '../components/GameBoard';
import { levels } from '../logic/levelData';
import { populateGrid, canRemoveArrow, isLevelComplete } from '../logic/gameLogic';
import { Grid } from '../types/gameTypes';

const GameScreen: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [grid, setGrid] = useState<Grid>([]);
  const [moves, setMoves] = useState(0);
  const [wrongMoves, setWrongMoves] = useState(0);
  const [lastRemoved, setLastRemoved] = useState<{ row: number; col: number } | null>(null);
  const [history, setHistory] = useState<Grid[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);

  const MAX_WRONG_MOVES = 3;

  // Load level
  useEffect(() => {
    loadLevel(currentLevel);
  }, [currentLevel]);

  const loadLevel = (levelIndex: number) => {
    const level = levels[levelIndex];
    if (level) {
      const newGrid = populateGrid(level.size, level.arrows);
      setGrid(newGrid);
      setMoves(0);
      setWrongMoves(0);
      setHistory([]);
      setLastRemoved(null);
      setGameOver(false);
      setShowGameOverModal(false);
    }
  };

  const handleWrongMove = () => {
    const newWrongMoves = wrongMoves + 1;
    setWrongMoves(newWrongMoves);

    // Vibrate on wrong move (optional)
    Vibration.vibrate(100);

    if (newWrongMoves >= MAX_WRONG_MOVES) {
      // Game over!
      setGameOver(true);
      setShowGameOverModal(true);
    } else {
      // Show warning with remaining attempts
      const remainingAttempts = MAX_WRONG_MOVES - newWrongMoves;
      Alert.alert(
        '❌ Wrong Move!',
        `This arrow is blocked. Clear the path first.\n\n⚠️ ${remainingAttempts} ${remainingAttempts === 1 ? 'attempt' : 'attempts'} remaining before game over!`,
        [{ text: 'Continue', style: 'default' }]
      );
    }
  };

  const handleTilePress = (row: number, col: number) => {
    // Don't allow moves if game is over
    if (gameOver) {
      Alert.alert('Game Over', 'Please restart the level to continue playing.');
      return;
    }

    const cell = grid[row][col];
    if (!cell.arrow) return; // Empty cell

    const isValid = canRemoveArrow(grid, row, col, cell.arrow.direction, grid.length);
    
    if (isValid) {
      // CORRECT MOVE
      // Save to history for undo
      const gridCopy = JSON.parse(JSON.stringify(grid));
      setHistory([...history, gridCopy]);
      
      // Remove arrow
      const newGrid = JSON.parse(JSON.stringify(grid));
      newGrid[row][col].arrow = null;
      setGrid(newGrid);
      setMoves(moves + 1);
      setLastRemoved({ row, col });
      
      // Clear highlight after 0.5 seconds
      setTimeout(() => setLastRemoved(null), 500);
      
      // Check for level complete
      if (isLevelComplete(newGrid)) {
        Alert.alert(
          '🎉 Congratulations! 🎉',
          `You completed level ${currentLevel + 1} in ${moves + 1} moves with ${wrongMoves} wrong attempts!`,
          [
            {
              text: 'Next Level',
              onPress: () => {
                if (currentLevel + 1 < levels.length) {
                  setCurrentLevel(currentLevel + 1);
                } else {
                  Alert.alert('🏆 You Win! 🏆', 'Congratulations! You completed all levels!');
                }
              },
            },
          ]
        );
      }
    } else {
      // WRONG MOVE - Path blocked
      handleWrongMove();
    }
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const previousGrid = history[history.length - 1];
      setGrid(previousGrid);
      setHistory(history.slice(0, -1));
      setMoves(moves - 1);
      // Note: Wrong moves count NOT decreased for undo (intentional)
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Level',
      'Are you sure you want to reset this level? Your wrong move count will also reset.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', onPress: () => loadLevel(currentLevel) },
      ]
    );
  };

  const handleRestartFromGameOver = () => {
    setShowGameOverModal(false);
    loadLevel(currentLevel);
  };

  // Render wrong move indicators (hearts or dots)
  const renderWrongMoveIndicators = () => {
    const remaining = MAX_WRONG_MOVES - wrongMoves;
    return (
      <View style={styles.wrongMovesContainer}>
        <Text style={styles.wrongMovesLabel}>Attempts remaining: </Text>
        <View style={styles.heartsContainer}>
          {Array.from({ length: MAX_WRONG_MOVES }).map((_, index) => (
            <Text
              key={index}
              style={[
                styles.heartIcon,
                index < remaining ? styles.heartActive : styles.heartLost,
              ]}
            >
              {index < remaining ? '❤️' : '🖤'}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Arrow Escape</Text>
        <Text style={styles.level}>Level {currentLevel + 1}</Text>
        <View style={styles.statsContainer}>
          <Text style={styles.moves}>✅ Moves: {moves}</Text>
          {renderWrongMoveIndicators()}
        </View>
      </View>
      
      <GameBoard 
        grid={grid} 
        onTilePress={handleTilePress}
        lastRemovedPosition={lastRemoved}
      />
      
      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={handleUndo}>
          <Text style={styles.buttonText}>↶ Undo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleReset}>
          <Text style={styles.buttonText}>⟳ Reset</Text>
        </TouchableOpacity>
      </View>

      {/* Game Over Modal */}
      <Modal
        visible={showGameOverModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowGameOverModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalEmoji}>💀</Text>
            <Text style={styles.modalTitle}>GAME OVER!</Text>
            <Text style={styles.modalMessage}>
              You made {MAX_WRONG_MOVES} wrong moves!
            </Text>
            <Text style={styles.modalDetails}>
              Level {currentLevel + 1} • {moves} moves made
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleRestartFromGameOver}
            >
              <Text style={styles.modalButtonText}>⟳ Restart Level</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  level: {
    fontSize: 18,
    marginTop: 5,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  moves: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  wrongMovesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wrongMovesLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 5,
  },
  heartsContainer: {
    flexDirection: 'row',
  },
  heartIcon: {
    fontSize: 16,
    marginHorizontal: 2,
  },
  heartActive: {
    opacity: 1,
  },
  heartLost: {
    opacity: 0.3,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalEmoji: {
    fontSize: 64,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E53935',
    marginBottom: 15,
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalDetails: {
    fontSize: 14,
    color: '#999',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
    minWidth: 180,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default GameScreen;