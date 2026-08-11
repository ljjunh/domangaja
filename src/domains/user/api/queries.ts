import { mutationOptions, queryOptions } from '@tanstack/react-query';
import { queryClient } from '@/shared/api/queryClient';
import {
  completeOnboarding,
  getMe,
  getNicknameAvailability,
  updateLocale,
  updateProfile,
} from '@/domains/user/api/service';
import { uploadImage, type UploadFile } from '@/shared/api/service';
import type { UpdateProfileRequest } from '@/domains/user/types/api';
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

// 요청 바디가 아니라 saveProfile 절차의 입력 — 그래서 types/api.ts가 아니라 여기 둔다
interface SaveProfileInput {
  patch: UpdateProfileRequest;
  // 새로 고른 이미지. null이면 이미지는 그대로 두고 patch만 보냄
  image: UploadFile | null;
}

export const userMutations = {
  completeOnboarding: () =>
    mutationOptions({
      mutationFn: completeOnboarding,
      onSuccess: data => {
        queryClient.setQueryData(userQueryKeys.me, data);
      },
    }),

  // 이미지를 먼저 업로드해 받은 경로를 PATCH에 실어 보낸다.
  // profileImageUrl이 업로드 응답에 의존하므로 두 요청의 순서가 고정된다
  saveProfile: () =>
    mutationOptions({
      mutationFn: async ({ patch, image }: SaveProfileInput) => {
        const profileImageUrl = image == null ? undefined : await uploadImage(image);
        return updateProfile({ ...patch, profileImageUrl });
      },
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
