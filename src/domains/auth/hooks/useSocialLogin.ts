import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '@/shared/store/authStore';
import { showToast } from '@/shared/lib/toast';
import { tokenStorage } from '@/shared/api/tokenStorage';
import { socialAuth } from '@/domains/auth/lib/socialAuth';
import { loginWithKakao } from '@/domains/auth/api/service';
import type { SocialProvider } from '@/domains/auth/constants/socialProviders';

export const useSocialLogin = () => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
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
      // TODO: 서버 완성 전까지 카카오를 제외한 애플, 구글은 그냥 로그인 시키기
      if (provider !== 'kakao') {
        login();
        return;
      }

      const response = await loginWithKakao({ kakaoAccessToken: result.token });

      await tokenStorage.save({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });
      if (response.newMember) {
        navigate('Onboarding');
        return;
      }
      login();
    } finally {
      setLoadingProvider(null);
    }
  };

  return { signIn, loadingProvider };
};
