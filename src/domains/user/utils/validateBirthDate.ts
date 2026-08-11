export type BirthDateError = 'invalidDate' | 'tooYoung';

const BIRTH_DATE_DIGIT_COUNT = 8;
// 개인정보보호법상 만 14세 미만은 법정대리인 동의가 필요하고 앱에 그 절차가 없음
const MIN_AGE = 14;
// 오입력(연도 오타) 걸러내기용 상한
const MAX_AGE = 120;

// 만 나이
function calculateAge(birthDate: Date, today: Date): number {
  const yearDiff = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const isBeforeBirthday =
    monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate());
  return isBeforeBirthday ? yearDiff - 1 : yearDiff;
}

/**
 * YYYYMMDD 8자리 숫자열을 검증
 * today를 인자로 받는 이유: 나이 경계(생일 당일)를 테스트에서 고정할 수 있어야 한다
 */
export function validateBirthDate(
  digits: string,
  today: Date = new Date(),
): { ok: true } | { ok: false; reason: BirthDateError } {
  if (digits.length !== BIRTH_DATE_DIGIT_COUNT) {
    return { ok: false, reason: 'invalidDate' };
  }

  const year = Number(digits.slice(0, 4));
  const month = Number(digits.slice(4, 6));
  const day = Number(digits.slice(6, 8));

  // Date는 실존하지 않는 날짜를 다음 달로 넘김(2월 30일 → 3월 2일, 13월 → 다음 해 1월).
  const birthDate = new Date(year, month - 1, day);
  if (
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== month - 1 ||
    birthDate.getDate() !== day
  ) {
    return { ok: false, reason: 'invalidDate' };
  }

  // 미래 생일은 나이가 음수가 되어 tooYoung으로도 걸리지만,
  // "만 14세 이상만" 안내가 뜨면 유저가 혼란하므로 먼저 오입력으로 분류
  if (birthDate > today) {
    return { ok: false, reason: 'invalidDate' };
  }

  const age = calculateAge(birthDate, today);
  if (age > MAX_AGE) {
    return { ok: false, reason: 'invalidDate' };
  }
  if (age < MIN_AGE) {
    return { ok: false, reason: 'tooYoung' };
  }

  return { ok: true };
}
