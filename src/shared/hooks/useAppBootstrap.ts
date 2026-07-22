import { useEffect } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { restoreLanguage } from '@/shared/i18n';

export const useAppBootstrap = () => {
  useEffect(() => {
    restoreLanguage();
    // 클라이언트 ID는 공개 값(토큰 발신/수신자 식별용)이라 코드에 둬도 무방
    GoogleSignin.configure({
      webClientId: '427482527525-a5ukqo10h2828u6uu56j4c4bh2a73tm2.apps.googleusercontent.com',
      iosClientId: '427482527525-nehokat582va5cde93tv0ud7c31k7gnb.apps.googleusercontent.com',
    });
    // TODO: FCM 등 초기화로직들
  }, []);
};
