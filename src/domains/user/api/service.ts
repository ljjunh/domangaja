import { apiClient } from '@/shared/api/client';
import type {
  CompleteOnboardingRequest,
  CompleteOnboardingResponse,
  GetMeResponse,
} from '@/domains/user/types/api';

export const getMe = async (): Promise<GetMeResponse> => {
  const { data } = await apiClient.get<GetMeResponse>('/api/v1/members/me');
  return data;
};

export const completeOnboarding = async (
  params: CompleteOnboardingRequest,
): Promise<CompleteOnboardingResponse> => {
  const { data } = await apiClient.put<CompleteOnboardingResponse>(
    '/api/v1/members/me/onboarding',
    params,
  );
  return data;
};
