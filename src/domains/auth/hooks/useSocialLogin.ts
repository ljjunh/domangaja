import { useState } from 'react';
import { useAuthStore } from '@/shared/store/authStore';
import { socialAuth } from '../lib/socialAuth';
import type { SocialProvider } from '../constants/socialProviders';

export const useSocialLogin = () => {
  const login = useAuthStore(state => state.login);
  const [loadingProvider, setLoadingProvider] = useState<SocialProvider | null>(null);

  const signIn = async (provider: SocialProvider) => {
    if (loadingProvider) {
      return; // 진행 중 중복 탭 방지
    }
    setLoadingProvider(provider);
    try {
      const token = await socialAuth[provider]();
      if (!token) {
        return; // 취소 또는 미구현 프로바이더
      }
      console.log(`[${provider}] token:`, token);
      // TODO: 서버에 토큰 전달 → 우리 토큰 수신/저장으로 교체
      login(); // 임시: 서버 생기기 전까지 토큰 획득 성공 = 로그인 처리
    } finally {
      setLoadingProvider(null);
    }
  };

  return { signIn, loadingProvider };
};
