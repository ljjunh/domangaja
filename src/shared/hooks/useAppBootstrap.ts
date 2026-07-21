import { useEffect } from 'react';
import { restoreLanguage } from '@/shared/i18n';

export const useAppBootstrap = () => {
  useEffect(() => {
    restoreLanguage();
    // TODO: FCM, 구글 키 등 초기화로직들
  }, []);
};
