import { useEffect } from 'react';
import { useAuthStore } from '@/shared/store/authStore';
import { getFcmToken, onFcmTokenRefresh } from '@/domains/notification/lib/fcm';
import { registerDeviceToken } from '@/domains/notification/api/service';
import { IS_IOS } from '@/shared/constants/platform';

const registerCurrentDevice = async () => {
  const token = await getFcmToken();
  if (token == null) {
    return;
  }
  try {
    await registerDeviceToken({ token, platform: IS_IOS ? 'IOS' : 'ANDROID' });
  } catch {}
};

// 로그인 상태가 되면 현재 기기의 FCM토큰은 서버에 등록
export const useDeviceTokenSync = () => {
  const isLogin = useAuthStore(state => state.isLogin);

  useEffect(
    function syncDeviceTokenOnLogin() {
      if (!isLogin) return;
      registerCurrentDevice();
      // 앱 실행 중 FCM 토큰을 교체하는 경우
      return onFcmTokenRefresh(() => {
        registerCurrentDevice();
      });
    },
    [isLogin],
  );
};
