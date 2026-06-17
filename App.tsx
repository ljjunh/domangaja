import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import '@/shared/i18n';
import { Navigation } from '@/shared/navigations/index';
import { queryClient } from '@/shared/apis/queryClient';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <QueryClientProvider client={queryClient}>
        <Navigation />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

export default App;
