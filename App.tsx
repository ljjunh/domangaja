import { type ReactNode } from 'react';
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
import { AppErrorBoundary } from '@/shared/components/error';
import { useAppStatusStore } from '@/shared/store/appStatusStore';
import { ForceUpdateScreen, MaintenanceScreen } from '@/screens';
import { useAppBootstrap } from '@/shared/hooks/useAppBootstrap';
import { useDeviceTokenSync } from '@/domains/notification/hooks/useDeviceTokenSync';
import {
  flushPendingPushNavigation,
  usePushNavigation,
} from '@/domains/notification/hooks/usePushNavigation';
import { useForegroundPush } from '@/domains/notification/hooks/useForegroundPush';
import { useNotificationPermissionRequest } from '@/domains/notification/hooks/useNotificationPermissionRequest';

function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <QueryClientProvider client={queryClient}>
          <AppErrorBoundary>
            <AppBootstrap>
              <OverlayProvider>
                <Navigation onReady={flushPendingPushNavigation} />
              </OverlayProvider>
            </AppBootstrap>
          </AppErrorBoundary>
        </QueryClientProvider>
        <Toast config={toastConfig} position="bottom" bottomOffset={80} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

/**
 * 앱 전역 부팅·구독 훅 모음.
 * App 본문이 아니라 경계 안쪽에서 돌려야 여기서 던진 에러를 AppErrorBoundary가 잡음
 */
function AppBootstrap({ children }: { children: ReactNode }) {
  useAppBootstrap();
  useDeviceTokenSync();
  usePushNavigation();
  useForegroundPush();
  useNotificationPermissionRequest();

  const isUnderMaintenance = useAppStatusStore(state => state.isUnderMaintenance);
  const isUpdateRequired = useAppStatusStore(state => state.isUpdateRequired);

  // 네비게이션 자체를 대체한다 — 스택 안에 두면 뒤로가기로 빠져나감
  // 점검이 바깥 조건: 점검 중엔 어떤 버전이든 서비스를 못 쓴다
  if (isUnderMaintenance) {
    return <MaintenanceScreen />;
  }
  if (isUpdateRequired) {
    return <ForceUpdateScreen />;
  }

  return children;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default App;
