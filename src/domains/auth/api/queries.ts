// 쿼리키 + queryOptions/mutationOptions (TanStack Query 정책)
import { mutationOptions } from '@tanstack/react-query';
import { queryClient } from '@/shared/api/queryClient';
import { withdraw } from '@/domains/auth/api/service';

const all = ['auth'] as const;

export const authQueryKeys = { all };

export const authMutations = {
  withdraw: () =>
    mutationOptions({
      mutationFn: withdraw,
      onSuccess: () => queryClient.clear(),
    }),
};
