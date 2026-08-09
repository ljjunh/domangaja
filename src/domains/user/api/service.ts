import { apiClient } from '@/shared/api/client';
import type {
  GetMeResponse,
  UpdateMyProfileRequest,
  UpdateMyProfileResponse,
} from '@/domains/user/types/api';

export const getMe = async (): Promise<GetMeResponse> => {
  const { data } = await apiClient.get<GetMeResponse>('/api/v1/members/me');
  return data;
};

export const updateMyProfile = async (
  params: UpdateMyProfileRequest,
): Promise<UpdateMyProfileResponse> => {
  const { data } = await apiClient.put<UpdateMyProfileResponse>(
    '/api/v1/members/me/onboarding',
    params,
  );
  return data;
};
