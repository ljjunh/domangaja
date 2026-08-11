//  HTTP 호출 (axios) React를 모르는 순수 TS
import { apiClient } from '@/shared/api/client';
import type {
  AppleLoginRequest,
  GoogleLoginRequest,
  KakaoLoginRequest,
  SocialLoginResponse,
} from '@/domains/auth/types/api';

export const loginWithKakao = async (params: KakaoLoginRequest): Promise<SocialLoginResponse> => {
  const { data } = await apiClient.post<SocialLoginResponse>('/auth/kakao', params);
  return data;
};

export const loginWithGoogle = async (params: GoogleLoginRequest): Promise<SocialLoginResponse> => {
  const { data } = await apiClient.post<SocialLoginResponse>('/auth/google', params);
  return data;
};

export const loginWithApple = async (params: AppleLoginRequest): Promise<SocialLoginResponse> => {
  const { data } = await apiClient.post<SocialLoginResponse>('/auth/apple', params);
  return data;
};

export const withdraw = async (): Promise<void> => {
  await apiClient.delete('/members/me');
};
