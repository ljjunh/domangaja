//  HTTP 호출 (axios) React를 모르는 순수 TS
import { apiClient } from '@/shared/api/client';
import type { KakaoLoginRequest, KakaoLoginResponse } from '@/domains/auth/types/api';

export const loginWithKakao = async (params: KakaoLoginRequest): Promise<KakaoLoginResponse> => {
  const { data } = await apiClient.post<KakaoLoginResponse>('/api/v1/auth/kakao', params);
  return data;
};

export const withdraw = async (): Promise<void> => {
  await apiClient.delete('/api/v1/members/me');
};
