import { mutationOptions, queryOptions } from '@tanstack/react-query';
import { queryClient } from '@/shared/api/queryClient';
import {
  completeOnboarding,
  getMe,
  getNicknameAvailability,
  updateLocale,
} from '@/domains/user/api/service';
import { changeAppLanguages } from '@/shared/i18n';
import type { GetMeResponse } from '@/domains/user/types/api';
import { toServerLocale } from '@/domains/user/utils/serverLocale';

const all = ['user'] as const;

export const userQueryKeys = {
  all,
  me: [...all, 'me'] as const,
  nicknameAvailability: (nickname: string) => [...all, 'nicknameAvailability', nickname] as const,
};

export const userQueries = {
  getMe: () =>
    queryOptions({
      queryKey: userQueryKeys.me,
      queryFn: getMe,
    }),

  // accessToken은 쿼리키에 넣지 않는다 — 갱신될 때마다 캐시가 갈려 같은 닉네임을 다시 조회한다
  nicknameAvailability: (nickname: string, accessToken?: string) =>
    queryOptions({
      queryKey: userQueryKeys.nicknameAvailability(nickname),
      queryFn: () => getNicknameAvailability(nickname, accessToken),
      staleTime: 0,
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
