import { navigationRef } from '@/shared/navigations';
import type { NotificationType } from '@/domains/notification/types/api';

interface NotificationTarget {
  type: NotificationType;
  /** 푸시는 문자열, 목록 응답은 숫자로 온다 */
  targetId: string | number | null;
}

/**
 * 알림 종류 → 목적지. 푸시 탭과 알림 목록 탭이 같은 곳으로 가야 하므로
 * 이 매핑은 여기 한 곳에만 둔다 (양쪽에 복사하면 반드시 갈라진다)
 */
export function navigateToNotificationTarget({ type, targetId }: NotificationTarget) {
  if (targetId == null) {
    return; // 마케팅처럼 목적지가 없는 알림
  }

  switch (type) {
    // 댓글 좋아요는 대상이 댓글이지만 댓글 단독 화면이 없어 글로 보낸다
    case 'FEED_COMMENT':
    case 'COMMENT_LIKE':
    case 'FEED_BOOKMARK':
      navigationRef.navigate('FeedDetail', { feedId: Number(targetId) });
      break;
    case 'STORY_LIKE':
      navigationRef.navigate('StoryDetail', { storyId: Number(targetId) });
      break;
    case 'QUIETNESS_RISE':
    case 'QUIETNESS_DROP':
      // 스팟은 식별자가 문자열(contentId)이다
      navigationRef.navigate('SpotDetail', { contentId: String(targetId) });
      break;
    case 'MARKETING':
      break; // TODO: 이벤트 랜딩 목적지 기획 확정 시 연결
  }
}
