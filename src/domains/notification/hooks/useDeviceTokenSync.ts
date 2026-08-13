import { useEffect } from 'react';
import { useAuthStore } from '@/shared/store/authStore';
import { getFcmToken, onFcmTokenRefresh } from '@/domains/notification/lib/fcm';
import { registerDeviceToken } from '@/domains/notification/api/service';
import { IS_IOS } from '@/shared/constants/platform';
import { reportError } from '@/shared/lib/crashlytics';

const registerCurrentDevice = async () => {
  const token = await getFcmToken();
  if (token == null) {
    return;
  }
  try {
    await registerDeviceToken({ token, platform: IS_IOS ? 'IOS' : 'ANDROID' });
  } catch (error) {
    // 등록 실패는 화면에 아무 영향이 없어서 조용히 넘어가고 기록만 남김
    reportError(error, 'notification/registerDeviceToken');
  }
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
