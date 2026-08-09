import { mutationOptions, queryOptions } from '@tanstack/react-query';
import { completeOnboarding, getMe } from '@/domains/user/api/service';
import { queryClient } from '@/shared/api/queryClient';

const all = ['user'] as const;

export const userQueryKeys = {
  all,
  me: [...all, 'me'] as const,
};

export const userQueries = {
  getMe: () =>
    queryOptions({
      queryKey: userQueryKeys.me,
      queryFn: getMe,
    }),
};

export const userMutations = {
  completeOnboarding: () =>
    mutationOptions({
      mutationFn: completeOnboarding,
      onSuccess: data => {
        queryClient.setQueryData(userQueryKeys.me, data);
      },
    }),
};
