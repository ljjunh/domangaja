import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/shared/store/authStore';
import { showToast } from '@/shared/lib/toast';
import { socialAuth } from '@/domains/auth/lib/socialAuth';
import type { SocialProvider } from '@/domains/auth/constants/socialProviders';

export const useSocialLogin = () => {
  const { t } = useTranslation();
  const login = useAuthStore(state => state.login);
  const [loadingProvider, setLoadingProvider] = useState<SocialProvider | null>(null);

  const signIn = async (provider: SocialProvider) => {
    if (loadingProvider) {
      return; // 진행 중 중복 탭 방지
    }
    setLoadingProvider(provider);
    try {
      const result = await socialAuth[provider]();
      if (result.status === 'cancelled') {
        return; // 사용자 의도 — 조용히 복귀
      }
      if (result.status === 'failed') {
        showToast('error', t('login.errorNetwork'));
        return;
      }
      console.log(`[${provider}] token:`, result.token);
      // TODO: 서버에 토큰 전달 → 우리 토큰 수신/저장으로 교체
      login(); // 임시: 서버 생기기 전까지 토큰 획득 성공 = 로그인 처리
    } finally {
      setLoadingProvider(null);
    }
  };

  return { signIn, loadingProvider };
};
