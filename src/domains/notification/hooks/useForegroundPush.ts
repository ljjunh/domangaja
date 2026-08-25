import { useEffect } from 'react';
import { showPushToast } from '@/shared/lib/toast';
import { onForegroundPush, type PushMessage } from '@/domains/notification/lib/fcm';
import { invalidateNotificationList } from '@/domains/notification/api/queries';
import { navigateByPush } from '@/domains/notification/hooks/usePushNavigation';
import { parsePushAction } from '@/domains/notification/utils/pushAction';

/**
 * 훅 밖으로 꺼내둔 이유: 개발용 버튼에서 가짜 메시지로 같은 경로를 그대로 태울 수 있다
 * (배너 모양·마케팅 제외·탭 이동을 실제 코드로 확인)
 */
export function handleForegroundPushMessage(message: PushMessage) {
  const action = parsePushAction(message.data);

  // 대상 화면(스팟·피드) 쿼리 무효화는 다른 도메인이라 여기서 하지 않는다(ADR 003)
  invalidateNotificationList();

  // 앱 사용 중인 사람에게 광고 배너를 끼얹지 않는다 — 의도적 무시
  if (action?.type === 'MARKETING') {
    return;
  }
  if (message.title == null && message.body == null) {
    return;
  }

  // action이 null(모르는 종류)이어도 배너는 띄운다 — 내용은 보여주고 이동만 포기한다.
  // navigateByPush가 targetId 없으면 조용히 끝내므로 탭해도 안전하다

  // 목적지 로직은 navigateByPush 한 곳에만 둔다 (OS 알림 탭과 같은 경로)
  showPushToast({
    title: message.title,
    body: message.body,
    onPress: () => navigateByPush(message),
  });
}

export const useForegroundPush = () => {
  useEffect(function subscribeForegroundPush() {
    return onForegroundPush(handleForegroundPushMessage);
  }, []);
};
