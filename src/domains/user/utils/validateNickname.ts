// 완성형 한글만 허용(ㄱ, ㅏ 같은 자모 단독은 불가능)
const NICKNAME_PATTERN = /^[가-힣a-zA-Z0-9_]+$/;

export function isValidNickname(nickname: string): boolean {
  return NICKNAME_PATTERN.test(nickname);
}
