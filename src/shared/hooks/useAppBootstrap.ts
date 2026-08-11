import { useEffect } from 'react';
import { AppState } from 'react-native';
import BootSplash from 'react-native-bootsplash';
import { focusManager } from '@tanstack/react-query';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { restoreLanguage } from '@/shared/i18n';
import { tokenStorage } from '@/shared/api/tokenStorage';
import { useAuthStore } from '@/shared/store/authStore';

export const useAppBootstrap = () => {
  useEffect(function bootstrapApp() {
    // 클라이언트 ID는 공개 값(토큰 발신/수신자 식별용)이라 코드에 둬도 무방
    GoogleSignin.configure({
      webClientId: '427482527525-a5ukqo10h2828u6uu56j4c4bh2a73tm2.apps.googleusercontent.com',
      iosClientId: '427482527525-nehokat582va5cde93tv0ud7c31k7gnb.apps.googleusercontent.com',
    });

    // 언어 복원과 토큰 복원은 서로 무관해서 병렬로 두되, 스플래시는 둘 다 끝난 뒤 걷음
    // 언어 복원이 남은 채로 스플래시가 사라지면 기기 언어 화면이 한 프레임 보인다
    const languageReady = restoreLanguage().catch(() => {});
    const authReady = tokenStorage
      .load()
      .then(tokens => {
        if (tokens != null) useAuthStore.getState().login();
      })
      .catch(() => {});

    Promise.all([languageReady, authReady]).finally(() => BootSplash.hide({ fade: true }));

    // RN에는 웹의 window focus 이벤트가 없어서, 백그라운드 -> 포그라운드 복귀를
    // TanStack Query에 focus로 알려줘야 refetchOnWindowFocus(복귀 시 stale 쿼리 갱신)가 동작한다
    const appStateSubscription = AppState.addEventListener('change', status => {
      focusManager.setFocused(status === 'active');
    });
    return () => appStateSubscription.remove();
  }, []);
};
