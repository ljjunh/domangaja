import { useEffect } from 'react';
import { Linking } from 'react-native';
import { navigationRef } from '@/shared/navigations';
import { useAuthStore } from '@/shared/store/authStore';

interface PendingSpotDetail {
  contentId: string;
}

const SPOT_DETAIL_LINK_PATTERN = /^domangaja:\/\/spots\/([^/?#]+)/;

// 관광지 상세 공유 링크만 관리중
let pendingSpotDetail: PendingSpotDetail | null = null;

const canNavigate = () => navigationRef.isReady() && useAuthStore.getState().isLogin;

function parseSpotDetailLink(url: string): PendingSpotDetail | null {
  const contentId = url.match(SPOT_DETAIL_LINK_PATTERN)?.[1];
  if (!contentId) return null;

  try {
    return { contentId: decodeURIComponent(contentId) };
  } catch {
    return null;
  }
}

function navigateOrPend(url: string) {
  const destination = parseSpotDetailLink(url);
  if (!destination) return;

  if (canNavigate()) {
    navigationRef.navigate('SpotDetail', destination);
    return;
  }

  // 로그인 복원 전에는 SignedIn 화면이 없으므로 목적지를 보관
  pendingSpotDetail = destination;
}

export function flushPendingDeepLinkNavigation() {
  if (pendingSpotDetail == null || !canNavigate()) return;

  const destination = pendingSpotDetail;
  pendingSpotDetail = null;
  navigationRef.navigate('SpotDetail', destination);
}

export function useDeepLinkNavigation() {
  const isLogin = useAuthStore(state => state.isLogin);

  useEffect(function subscribeDeepLink() {
    // 종료 상태에서 실행된 링크와 실행 중 수신한 링크를 모두 처리
    Linking.getInitialURL()
      .then(url => {
        if (url) navigateOrPend(url);
      })
      .catch(() => undefined);

    const subscription = Linking.addEventListener('url', event => navigateOrPend(event.url));
    return () => subscription.remove();
  }, []);

  useEffect(
    function flushAfterLogin() {
      if (isLogin) flushPendingDeepLinkNavigation();
    },
    [isLogin],
  );
}
