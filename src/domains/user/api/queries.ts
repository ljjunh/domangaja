import { mutationOptions, queryOptions } from '@tanstack/react-query';
import { queryClient } from '@/shared/api/queryClient';
import { completeOnboarding, getMe, updateLocale } from '@/domains/user/api/service';
import { changeAppLanguages } from '@/shared/i18n';
import type { GetMeResponse } from '@/domains/user/types/api';
import { toServerLocale } from '@/domains/user/utils/serverLocale';

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

  updateLocale: () =>
    mutationOptions({
      mutationFn: updateLocale,
      onSuccess: (_data, code) => {
        changeAppLanguages(code);
        queryClient.setQueryData<GetMeResponse>(userQueryKeys.me, prev =>
          prev == null ? prev : { ...prev, locale: toServerLocale(code) },
        );
      },
    }),
};
