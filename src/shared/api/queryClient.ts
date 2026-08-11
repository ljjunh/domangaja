import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: true,
      // 복귀 시 stale 쿼리 refetch (기본값 true) — RN에서는 useAppBootstrap의
      // AppState -> focusManager 배선이 있어야 발동
    },
    mutations: {
      retry: false,
    },
  },
});
