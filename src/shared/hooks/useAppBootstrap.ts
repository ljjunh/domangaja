import { useEffect } from 'react';
import { AppState } from 'react-native';
import { focusManager } from '@tanstack/react-query';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { restoreLanguage } from '@/shared/i18n';
import { tokenStorage } from '@/shared/api/tokenStorage';
import { useAuthStore } from '@/shared/store/authStore';

export const useAppBootstrap = () => {
  useEffect(function bootstrapApp() {
    restoreLanguage();
    // 클라이언트 ID는 공개 값(토큰 발신/수신자 식별용)이라 코드에 둬도 무방
    GoogleSignin.configure({
      webClientId: '427482527525-a5ukqo10h2828u6uu56j4c4bh2a73tm2.apps.googleusercontent.com',
      iosClientId: '427482527525-nehokat582va5cde93tv0ud7c31k7gnb.apps.googleusercontent.com',
    });

    tokenStorage.load().then(tokens => {
      if (tokens != null) {
        useAuthStore.getState().login();
      }
    });

    // RN에는 웹의 window focus 이벤트가 없어서, 백그라운드 -> 포그라운드 복귀를
    // TanStack Query에 focus로 알려줘야 refetchOnWindowFocus(복귀 시 stale 쿼리 갱신)가 동작한다
    const appStateSubscription = AppState.addEventListener('change', status => {
      focusManager.setFocused(status === 'active');
    });
    return () => appStateSubscription.remove();
  }, []);
};
