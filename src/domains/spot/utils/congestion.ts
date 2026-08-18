import type { GetCongestionResponse } from '@/domains/spot/types/api';

// "YYYY-MM" — availableFrom/To와 문자열끼리 비교하려고 같은 모양으로 만든다
function toMonthKey(month: Date): string {
  return `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
}

/**
 * 응답을 캘린더가 쓰는 "날짜 → 한적도" 표로 바꾼다.
 * year+month로 요청하면 그 달의 일자만 담겨 오므로 여기서 달을 걸러낼 필요는 없다
 */
export function toDailyQuietness(response?: GetCongestionResponse): Record<number, number> {
  // touristSpot으로 좁혀 부르므로 spots는 0개(측정 대상 아님) 또는 1개다
  const daily = response?.spots[0]?.daily ?? [];

  return daily.reduce<Record<number, number>>((table, { date, quietnessScore }) => {
    table[Number(date.slice(-2))] = quietnessScore;
    return table;
  }, {});
}

/**
 * 이전/다음 달로 이동할 수 있는지. 예측 구간(availableFrom~To) 밖으로는 나가지 않는다.
 * 응답 전(구간을 모를 때)에는 막지 않는다 — 잠깐 눌렸다가 빈 달을 보는 편이
 * 화살표가 깜빡이며 잠기는 것보다 덜 이상하다
 */
export function canGoPrevMonth(visibleMonth: Date, response?: GetCongestionResponse): boolean {
  if (response == null) {
    return true;
  }
  return toMonthKey(visibleMonth) > response.availableFrom.slice(0, 7);
}

export function canGoNextMonth(visibleMonth: Date, response?: GetCongestionResponse): boolean {
  if (response == null) {
    return true;
  }
  return toMonthKey(visibleMonth) < response.availableTo.slice(0, 7);
}
