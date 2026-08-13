import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/shared/store/authStore';
import { userMutations, userQueries } from '@/domains/user/api/queries';
import type { LanguageCode } from '@/shared/i18n/languages';
import { toServerLocale } from '@/domains/user/utils/serverLocale';
import { identifyUser } from '@/shared/lib/crashlytics';

export const useLocaleSync = () => {
  const isLogin = useAuthStore(state => state.isLogin);
  const { i18n } = useTranslation();
  const { data: me } = useQuery({ ...userQueries.getMe(), enabled: isLogin });
  const { mutate } = useMutation(userMutations.updateLocale());

  useEffect(
    function correctServerLocaleOnMismatch() {
      if (me == null) return;
      if (me.locale === toServerLocale(i18n.language)) return;
      mutate(i18n.language as LanguageCode);
    },
    [me?.locale, i18n.language, me, mutate],
  );

  // 크래시 리포트를 특정 유저와 연결 — 문의가 들어왔을 때 추적할 단서
  useEffect(
    function identifyUserForCrashReport() {
      if (me == null) return;
      identifyUser(me.id);
    },
    [me?.id, me],
  );
};
