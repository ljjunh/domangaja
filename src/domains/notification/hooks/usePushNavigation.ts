import { useEffect } from 'react';
import { navigationRef } from '@/shared/navigations';
import { useAuthStore } from '@/shared/store/authStore';
import { onPushOpened, type PushMessage } from '@/domains/notification/lib/fcm';
import { parsePushAction } from '@/domains/notification/utils/pushAction';

// 콜드 스타트: 알림 탭으로 앱이 켜지면 네비게이션 준비, 자동로그인 복원보다
// getInitialNotification이 먼저 도착 -> 보류해뒀다가 준비되면 진행
let pendingPush: PushMessage | null = null;

const canNavigate = () => navigationRef.isReady() && useAuthStore.getState().isLogin;

// 알림 탭 → 목적지 결정은 전부 이 함수 한 곳에.
// (현재 소비자는 OS 알림 탭뿐. 나중에 "포그라운드 토스트 탭 시 이동" 요구가 생기면
//  useForegroundPush에서 토스트 onPress에 이 함수를 연결 — 목적지 로직 중복 금지)
const navigateByPush = (message: PushMessage) => {
  const action = parsePushAction(message.data);

  if (__DEV__) {
    console.log('[push] 탭으로 진입, action:', action, 'data:', message.data);
  }

  switch (action?.type) {
    case 'QUIETNESS':
      // TODO: 목적지 기획 확정 시 — 해당 스팟 상세로
      // navigationRef.navigate('Main', { screen: 'Map', params: { spotId: action.spotId } });
      break;
    case 'COMMENT':
    case 'LIKE':
      // TODO: FeedDetail에 파라미터 생기면 연결
      // navigationRef.navigate('FeedDetail', { feedId: action.feedId });
      break;
    case 'MARKETING':
      // TODO: 이벤트 랜딩 목적지 기획 필요
      break;
    default:
      break; // 모르는 action — 그냥 앱만 열린다 (기본 동작)
  }
};

export const flushPendingPushNavigation = () => {
  if (pendingPush == null || !canNavigate()) {
    return;
  }
  const message = pendingPush;
  pendingPush = null;
  navigateByPush(message);
};

export const usePushNavigation = () => {
  const isLogin = useAuthStore(state => state.isLogin);

  useEffect(function subscribePushOpened() {
    return onPushOpened(message => {
      if (canNavigate()) {
        navigateByPush(message);
        return;
      }
      pendingPush = message;
    });
  }, []);

  // 자동로그인 복원이 네비게이션 준비보다 늦는 경우
  useEffect(
    function flushAfterLoginRestore() {
      if (isLogin) {
        flushPendingPushNavigation();
      }
    },
    [isLogin],
  );
};
