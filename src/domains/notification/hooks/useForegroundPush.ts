import { useEffect } from 'react';
import { showToast } from '@/shared/lib/toast';
import { onForegroundPush } from '@/domains/notification/lib/fcm';
import { parsePushAction } from '@/domains/notification/utils/pushAction';

export const useForegroundPush = () => {
  useEffect(function handleForegroundPush() {
    return onForegroundPush(message => {
      const action = parsePushAction(message.data);
      const text = message.body ?? message.title;

      switch (action?.type) {
        case 'QUIETNESS':
          // TODO: 해당 스팟 쿼리 무효화 (spot 쿼리 레이어 생기면)
          // queryClient.invalidateQueries({ queryKey: spotQueryKeys.detail(action.spotId) });
          if (text != null) {
            showToast('info', text);
          }
          break;
        case 'COMMENT':
        case 'LIKE':
          // TODO: 해당 피드 쿼리 무효화 (feed 쿼리 레이어 생기면)
          // queryClient.invalidateQueries({ queryKey: feedQueryKeys.detail(action.feedId) });
          if (text != null) {
            showToast('info', text);
          }
          break;
        case 'MARKETING':
          break; // 앱 사용 중인 사람에게 광고 토스트를 끼얹지 않는다 — 의도적 무시
        default:
          // action이 없거나 모르는 값. 서버가 아직 action을 안 실어 보내므로 일단 표시.
          // TODO: 서버가 action을 싣기 시작하면 '조용히 무시'로 전환
          if (text != null) {
            showToast('info', text);
          }
      }
    });
  }, []);
};
