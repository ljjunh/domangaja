const MS_PER_DAY = 24 * 60 * 60 * 1000;

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

export interface FormattedUntil {
  /** 0=오늘, 1=내일, 그 외는 날짜로 표기 */
  dayDiff: number;
  time: string;
  date: string;
}

/**
 * 점검 종료 예정 시각을 화면 문구용 조각으로 나눈다.
 * "오늘/내일" 같은 표현은 언어마다 달라서 로케일 문구가 조립하고, 여기선 값만 만든다
 */
export function formatUntil(iso: string, language: string): FormattedUntil | null {
  const target = new Date(iso);
  if (Number.isNaN(target.getTime())) {
    return null;
  }

  const dayDiff = Math.round((startOfDay(target) - startOfDay(new Date())) / MS_PER_DAY);

  return {
    dayDiff,
    time: safeFormat(
      () => target.toLocaleTimeString(language, { hour: 'numeric', minute: '2-digit' }),
      () => `${pad(target.getHours())}:${pad(target.getMinutes())}`,
    ),
    date: safeFormat(
      () => target.toLocaleDateString(language, { month: 'long', day: 'numeric' }),
      () => `${target.getMonth() + 1}/${target.getDate()}`,
    ),
  };
}

// 런타임에 Intl이 없거나 로케일을 모르면 예외가 날 수 있어 단순 표기로 떨어뜨린다
function safeFormat(format: () => string, fallback: () => string): string {
  try {
    return format();
  } catch {
    return fallback();
  }
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}
