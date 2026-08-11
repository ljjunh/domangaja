// 완성형 한글만 허용(ㄱ, ㅏ 같은 자모 단독은 불가능), 공백·특수문자 제외
const NICKNAME_PATTERN = /^[가-힣a-zA-Z0-9]+$/;
const MIN_LENGTH = 2;
const MAX_LENGTH = 10;

// macOS·iOS에서 붙여넣은 한글은 자모가 분리된 NFD로 들어와 완성형 범위(가-힣)에
// 걸리지 않음 앞뒤 공백도 붙여넣기에서 흔하므로 검증 전에 함께 정규화
export function normalizeNickname(raw: string): string {
  return raw.normalize('NFC').trim();
}

export function isValidNickname(raw: string): boolean {
  const value = normalizeNickname(raw);
  return value.length >= MIN_LENGTH && value.length <= MAX_LENGTH && NICKNAME_PATTERN.test(value);
}
