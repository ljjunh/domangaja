import { apiClient } from '@/shared/api/client';
import type {
  CompleteOnboardingRequest,
  CompleteOnboardingResponse,
  GetMeResponse,
  NicknameAvailabilityResponse,
} from '@/domains/user/types/api';
import { LanguageCode } from '@/shared/i18n/languages';
import { toServerLocale } from '@/domains/user/utils/serverLocale';

export const getMe = async (): Promise<GetMeResponse> => {
  const { data } = await apiClient.get<GetMeResponse>('/members/me');
  return data;
};

export const completeOnboarding = async (
  params: CompleteOnboardingRequest,
): Promise<CompleteOnboardingResponse> => {
  const { data } = await apiClient.put<CompleteOnboardingResponse>(
    '/members/me/onboarding',
    params,
  );
  return data;
};

export const updateLocale = async (code: LanguageCode): Promise<void> => {
  await apiClient.put('/members/me/locale', { locale: toServerLocale(code) });
};

export const getNicknameAvailability = async (
  nickname: string,
  accessToken?: string,
): Promise<NicknameAvailabilityResponse> => {
  const { data } = await apiClient.get<NicknameAvailabilityResponse>(
    '/members/nickname/availability',
    {
      params: { nickname },
      headers: accessToken == null ? undefined : { Authorization: `Bearer ${accessToken}` },
    },
  );
  console.log(data);
  return data;
};
