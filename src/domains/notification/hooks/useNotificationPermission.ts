import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { isNotificationPermissionGranted } from '@/domains/notification/lib/permission';

export const useNotificationPermission = () => {
  const [isGranted, setIsGranted] = useState<boolean>(true); // 권한 확인 전엔 배너를 안 띄움

  useEffect(function syncPermissionOnForeground() {
    const check = () => {
      isNotificationPermissionGranted().then(setIsGranted);
    };
    check();
    const subscription = AppState.addEventListener('change', status => {
      if (status === 'active') {
        check();
      }
    });
    return () => subscription.remove();
  }, []);

  return { isPermissionGranted: isGranted };
};
