import { useEffect } from 'react';
import { navigationRef } from '@/shared/navigations';
import { useAuthStore } from '@/shared/store/authStore';
import { onPushOpened, type PushMessage } from '@/domains/notification/lib/fcm';
import { markPushNotificationRead } from '@/domains/notification/api/queries';
import { parsePushAction } from '@/domains/notification/utils/pushAction';

// 콜드 스타트: 알림 탭으로 앱이 켜지면 네비게이션 준비, 자동로그인 복원보다
// getInitialNotification이 먼저 도착 -> 보류해뒀다가 준비되면 진행
let pendingPush: PushMessage | null = null;

const canNavigate = () => navigationRef.isReady() && useAuthStore.getState().isLogin;

// 알림 탭 → 목적지 결정은 전부 이 함수 한 곳에.
// (현재 소비자는 OS 알림 탭뿐. 나중에 "포그라운드 토스트 탭 시 이동" 요구가 생기면
//  useForegroundPush에서 토스트 onPress에 이 함수를 연결 — 목적지 로직 중복 금지)
export const navigateByPush = (message: PushMessage) => {
  const action = parsePushAction(message.data);

  if (__DEV__) {
    console.log('[push] 탭으로 진입, action:', action, 'data:', message.data);
  }

  // 탭했다는 건 읽었다는 뜻 — 읽음 처리와 목록 갱신은 종류·이동 여부와 무관하게 먼저 한다
  // (마케팅이나 모르는 종류도 탭했으면 읽은 것으로 본다)
  markPushNotificationRead(action?.notificationId ?? null);

  // 마케팅은 이동 목적지가 없다. targetId가 없어서 아래에서 걸러지긴 하지만,
  // 서버가 나중에 이벤트 랜딩 id를 실어 보내면 그 필터가 뚫리므로 여기서 명시한다
  if (action?.type === 'MARKETING') {
    return; // TODO: 이벤트 랜딩 목적지 기획 확정 시 연결
  }
  if (action?.targetId == null) {
    return; // 목적지를 알 수 없으면 앱만 열린다 (기본 동작)
  }

  switch (action.type) {
    case 'FEED_COMMENT':
    case 'COMMENT_LIKE':
    case 'FEED_BOOKMARK':
      navigationRef.navigate('FeedDetail', { feedId: Number(action.targetId) });
      break;
    case 'STORY_LIKE':
      navigationRef.navigate('StoryDetail', { storyId: Number(action.targetId) });
      break;
    case 'QUIETNESS_RISE':
      navigationRef.navigate('SpotDetail', { contentId: action.targetId });
      break;
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
