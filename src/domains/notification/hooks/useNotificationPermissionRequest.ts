import { useEffect } from 'react';
import { useAuthStore } from '@/shared/store/authStore';
import { requestNotificationPermission } from '@/domains/notification/lib/permission';

export const useNotificationPermissionRequest = () => {
  const isLogin = useAuthStore(state => state.isLogin);

  useEffect(
    function requestPermissionOnLogin() {
      if (isLogin) {
        requestNotificationPermission();
      }
    },
    [isLogin],
  );
};
