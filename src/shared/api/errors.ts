import { isAxiosError } from 'axios';

/**
 * 응답이 없으면 서버에 닿지 못한 것 — 오프라인, DNS 실패, 타임아웃
 * 상태코드가 있는 실패(4xx/5xx)는 서버에는 닿은 것이라 네트워크 문제가 아님
 */
export function isNetworkError(error: unknown): boolean {
  return isAxiosError(error) && error.response == null;
}
