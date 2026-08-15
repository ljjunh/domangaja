import { useEffect, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '@/shared/components/base';
import { Layout } from '@/shared/components/layout';
import { Button } from '@/shared/components/ui';
import { colors } from '@/shared/constants/colors';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { fetchAppStatus } from '@/shared/api/appConfig';
import { useAppStatusStore } from '@/shared/store/appStatusStore';
import { formatUntil } from '@/shared/utils/formatUntil';
import { AppIcon } from '@/assets/icons/logo';

const LOGO_SIZE = 100;

export default function MaintenanceScreen() {
  const { t, i18n } = useTranslation();
  const maintenanceUntil = useAppStatusStore(state => state.maintenanceUntil);
  const enterMaintenance = useAppStatusStore(state => state.enterMaintenance);
  const leaveMaintenance = useAppStatusStore(state => state.leaveMaintenance);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(function blockHardwareBack() {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => subscription.remove();
  }, []);

  // 점검이 끝났는지 앱이 알 방법이 없음 — 유저가 눌러서 다시 확인
  const refresh = async () => {
    setIsRefreshing(true);
    try {
      const status = await fetchAppStatus();
      if (status.isUnderMaintenance) {
        enterMaintenance(status.maintenanceUntil);
        return;
      }
      leaveMaintenance();
    } catch {
      // 여전히 서버에 닿지 않으면 점검 화면을 유지
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.content}>
          <AppIcon width={LOGO_SIZE} height={LOGO_SIZE} />
          <Text typography="t3" weight="bold" textAlign="center">
            {t('maintenance.title')}
          </Text>
          <Text typography="t5" weight="medium" color={colors.grey[600]} textAlign="center">
            {t('maintenance.description')}
          </Text>
        </View>

        <UntilBox untilIso={maintenanceUntil} language={i18n.language} />

        <Button size="large" display="block" loading={isRefreshing} onPress={refresh}>
          {t('maintenance.refresh')}
        </Button>
      </View>
    </Layout>
  );
}

// 종료 예정 시각을 서버가 안 줄 수도 있어 없으면 박스째 감춘다
function UntilBox({ untilIso, language }: { untilIso: string | null; language: string }) {
  const { t } = useTranslation();

  if (untilIso == null) {
    return null;
  }
  const until = formatUntil(untilIso, language);
  if (until == null) {
    return null;
  }

  const untilText =
    until.dayDiff === 0
      ? t('maintenance.untilToday', { time: until.time })
      : until.dayDiff === 1
      ? t('maintenance.untilTomorrow', { time: until.time })
      : t('maintenance.untilDate', { date: until.date, time: until.time });

  return (
    <View style={styles.untilBox}>
      <Text typography="t5" weight="semiBold" color={colors.blue[500]} textAlign="center">
        {t('maintenance.untilLabel')}
      </Text>
      <Text typography="t4" weight="bold" color={colors.blue[500]} textAlign="center">
        {untilText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL + 30,
    gap: 20,
  },
  content: {
    alignItems: 'center',
    gap: 10,
  },
  untilBox: {
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.blue[50],
  },
});
