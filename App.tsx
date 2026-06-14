import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Navigation } from '@/shared/navigations/index';

function App() {
  return (
    <SafeAreaProvider>
      <Navigation />
    </SafeAreaProvider>
  );
}

export default App;
