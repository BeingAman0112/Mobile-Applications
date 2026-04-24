/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import { SafeAreaView, StatusBar} from 'react-native';
import {
} from 'react-native-safe-area-context';
import GameScreen from './src/screens/GameScreen';

function App() {

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <GameScreen />
    </SafeAreaView>
  );
}


export default App;
