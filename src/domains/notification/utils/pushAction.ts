// 푸시 data 계약 — 서버가 보낼 수 있는 알림 종류
// 종류별로 어떻게 반응할지는 소비처(useForegroundPush, usePushNavigation)가 각자 정함
export type PushAction =
  | { type: 'QUIETNESS'; spotId: string } // 즐겨찾는 곳이 한적해짐
  | { type: 'COMMENT'; feedId: string } // 내 글에 댓글
  | { type: 'LIKE'; feedId: string } // 내 글에 좋아요
  | { type: 'MARKETING' }; // 혜택·이벤트

export function parsePushAction(data: Record<string, unknown>): PushAction | null {
  switch (data.action) {
    case 'QUIETNESS':
      return typeof data.spotId === 'string' ? { type: 'QUIETNESS', spotId: data.spotId } : null;
    case 'COMMENT':
    case 'LIKE':
      return typeof data.feedId === 'string' ? { type: data.action, feedId: data.feedId } : null;
    case 'MARKETING':
      return { type: 'MARKETING' };
    default:
      return null;
  }
}
