import { getCrashlytics, log, recordError, setUserId } from '@react-native-firebase/crashlytics';

/**
 * 크래시로 이어지지 않은 실패 기록
 * catch로 삼키는 자리에 붙여야 "기능이 조용히 안 되는" 상황을 발견할 수 있음
 */
export function reportError(error: unknown, context: string): void {
  const crashlytics = getCrashlytics();
  log(crashlytics, context);
  recordError(crashlytics, toError(error), context);
}

/** 특정 유저의 문의와 리포트를 연결하기 위한 식별자 */
export function identifyUser(userId: number): void {
  setUserId(getCrashlytics(), String(userId));
}

// recordError는 Error만 받는다 — 문자열이나 객체가 던져진 경우를 감싼다
function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}
