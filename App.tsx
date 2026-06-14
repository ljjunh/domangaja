import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Navigation } from './src/shared/navigations';

function App() {
  return (
    <SafeAreaProvider>
      <Navigation />
    </SafeAreaProvider>
  );
}

export default App;
