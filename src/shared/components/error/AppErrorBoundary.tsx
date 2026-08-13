import { type ReactNode } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { isNetworkError } from '@/shared/api/errors';
import { reportError } from '@/shared/lib/crashlytics';
import NetworkError from './NetworkError';
import CommonError from './CommonError';

interface AppErrorBoundaryProps {
  children: ReactNode;
}

/**
 * 렌더 중 던져진 에러를 잡는다 — 렌더 버그와 useSuspenseQuery 실패가 여기로 옴
 * 이벤트 핸들러·뮤테이션·비동기 콜백의 에러는 여기 오지 않고 각자 처리
 */
export default function AppErrorBoundary({ children }: AppErrorBoundaryProps) {
  return (
    // 다시 시도 시 실패한 쿼리의 에러 상태까지 지지움
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} onError={handleError} FallbackComponent={ErrorFallback}>
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

// 경계가 잡으면 앱이 죽지 않아서 Crashlytics 자동 수집에도 안 걸린다.
// 여기서 기록하지 않으면 유저는 에러 화면을 보는데 개발자는 영영 모른다
function handleError(error: unknown) {
  reportError(error, 'errorBoundary');
}

// 경계는 하나지만 에러 종류를 보고 화면을 고른다
function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return isNetworkError(error) ? (
    <NetworkError onRetry={resetErrorBoundary} />
  ) : (
    <CommonError onRetry={resetErrorBoundary} />
  );
}
