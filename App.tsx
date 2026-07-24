import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, StyleSheet } from 'react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { toastConfig } from '@/shared/lib/toastConfig';
import '@/shared/i18n';
import { Navigation } from '@/shared/navigations/index';
import { queryClient } from '@/shared/api/queryClient';
import { OverlayProvider } from '@/shared/overlay';
import { useAppBootstrap } from '@/shared/hooks/useAppBootstrap';

function App() {
  useAppBootstrap();

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <QueryClientProvider client={queryClient}>
          <OverlayProvider>
            <Navigation />
          </OverlayProvider>
        </QueryClientProvider>
        <Toast config={toastConfig} position="bottom" bottomOffset={80} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default App;
