import axios, { type AxiosResponse, type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/shared/store/authStore';
import { useAppStatusStore } from '@/shared/store/appStatusStore';
import { tokenStorage } from '@/shared/api/tokenStorage';
import { queryClient } from '@/shared/api/queryClient';
import { reportError } from '@/shared/lib/crashlytics';

/**
 * Request Interceptor — 요청이 서버로 전송되기 전 실행
 * 역할: Authorization 헤더에 액세스 토큰 부착 (비로그인이면 그대로 통과 — 공개 API용)
 */
export function requestInterceptor(config: InternalAxiosRequestConfig) {
  const tokens = tokenStorage.get();
  if (tokens != null) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  return config;
}

/**
 * Response Interceptor — 성공 케이스(2xx) 공통 처리
 */
export const responseInterceptor = (response: AxiosResponse) => {
  // 공통 처리 할 부분 있으면 추가
  return response;
};

// 서버 규약: 미인증/토큰 만료는 401이 아니라 "403 + 빈 바디"
// (바디 있는 403은 소유권 위반 - 세션 만료로 처리하면 안 됨)
function isAuthExpired(error: AxiosError) {
  return error.response?.status === 403 && !error.response.data;
}

// 동시에 만료를 만난 요청들이 하나의 갱신을 공유
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(baseURL: string): Promise<string> {
  const tokens = tokenStorage.get();
  if (tokens == null) {
    throw new Error('저장된 refresh 토큰이 없습니다');
  }
  // 리프레시는 apiClient가 아니라 기본 axios
  const { data } = await axios.post<{ accessToken: string; refreshToken: string }>(
    `${baseURL}/auth/refresh`,
    { refreshToken: tokens.refreshToken },
  );
  await tokenStorage.save(data);
  return data.accessToken;
}

type RetriableConfig = InternalAxiosRequestConfig & { retried?: boolean };

const MAINTENANCE_CODE = 'MAINTENANCE';

interface MaintenanceBody {
  code?: unknown;
  until?: unknown;
}

function toMaintenanceBody(errorData: unknown): MaintenanceBody | null {
  return typeof errorData === 'object' && errorData !== null
    ? (errorData as MaintenanceBody)
    : null;
}

function isMaintenanceResponse(errorData: unknown): boolean {
  return toMaintenanceBody(errorData)?.code === MAINTENANCE_CODE;
}

// 종료 예정 시각은 있으면 화면에 쓰고, 없으면 안내 박스만 숨김
function readMaintenanceUntil(errorData: unknown): string | null {
  const until = toMaintenanceBody(errorData)?.until;
  return typeof until === 'string' ? until : null;
}

/**
 * Reject Interceptor — 에러 응답(네트워크/4xx/5xx) 공통 처리
 * 1) 세션 만료(403+빈바디) → 토큰 갱신 후 1회 재시도
 * 2) 그 외 → 상태코드별 공통 처리 후 원본 에러 그대로 전달
 */
export async function rejectInterceptor(error: AxiosError) {
  const config = error.config as RetriableConfig | undefined;

  // 1. 세션 만료 → 갱신 후 재시도 (성공하면 여기서 return — 아래 공통 처리 안 탐)
  if (config != null && !config.retried && isAuthExpired(error)) {
    try {
      refreshPromise = refreshPromise ?? refreshAccessToken(config.baseURL ?? '');
      const accessToken = await refreshPromise;
      config.retried = true;
      config.headers.Authorization = `Bearer ${accessToken}`;
      return await axios(config);
    } catch {
      await tokenStorage.clear();
      // 다음에 로그인하는 계정 화면에 이전 사용자 기준 캐시(좋아요/북마크 등)가 남지 않게 한다
      queryClient.clear();
      useAuthStore.getState().logout();
      throw error;
    } finally {
      refreshPromise = null;
    }
  }

  // 2. 공통 에러 처리
  if (error.response == null) {
    console.error('[Network] 서버에 연결할 수 없습니다');
    throw error;
  }

  const status = error.response.status;
  const errorData = error.response.data;

  switch (status) {
    case 400:
      console.error('[400] 잘못된 요청: ', errorData);
      break;
    case 403:
      // 여기로 오는 403은 "바디가 있는" 소유권 위반 (빈 바디 403은 위에서 refresh가 처리)
      console.error('[403] 권한 없음: ', errorData);
      break;
    case 404:
      console.error('[404] 리소스 없음: ', errorData);
      break;
    case 409:
      // 중복 스크랩/즐겨찾기 — 화면이 "이미 저장됨" UX로 처리
      console.error('[409] 중복 요청: ', errorData);
      break;
    case 500:
      console.error('[500] 서버에 문제가 발생했습니다: ', errorData);
      break;
    case 502:
      console.error('[502] 게이트웨이 오류: ', errorData);
      break;
    case 503:
      console.error('[503] 서비스를 사용할 수 없습니다: ', errorData);
      // 사용 중에 점검이 시작된 경우 — 시작 시 조회만으로는 못 잡음
      // 과부하 503으로 점검 화면에 갇히지 않도록 code로 구분한다
      if (isMaintenanceResponse(errorData)) {
        useAppStatusStore.getState().enterMaintenance(readMaintenanceUntil(errorData));
      }
      break;
    default:
      console.error(`[${status}] 알 수 없는 오류: `, errorData);
  }

  // 5xx는 서버 장애 — 유저가 문의하지 않아도 발생 사실과 빈도를 알아야 한다.
  // 4xx는 대부분 화면이 UX로 처리하는 예상된 실패라 기록하지 않는다(노이즈)
  if (status >= 500) {
    reportError(error, `api/${status} ${error.config?.url ?? ''}`);
  }

  throw error;
}
