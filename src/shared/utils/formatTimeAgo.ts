const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export interface TimeAgo {
  unit: 'now' | 'minute' | 'hour' | 'day';
  value: number;
}

/**
 * 지난 시간을 화면 문구용 조각으로 나눈다.
 * "n분 전" 같은 표현은 언어마다 어순·복수형이 달라서 로케일 문구가 조립하고, 여기선 값만 만든다
 */
export function formatTimeAgo(iso: string, now: number = Date.now()): TimeAgo | null {
  const target = new Date(iso).getTime();
  if (Number.isNaN(target)) {
    return null;
  }

  const elapsed = Math.max(0, now - target);

  if (elapsed < MINUTE) {
    return { unit: 'now', value: 0 };
  }
  if (elapsed < HOUR) {
    return { unit: 'minute', value: Math.floor(elapsed / MINUTE) };
  }
  if (elapsed < DAY) {
    return { unit: 'hour', value: Math.floor(elapsed / HOUR) };
  }
  return { unit: 'day', value: Math.floor(elapsed / DAY) };
}
