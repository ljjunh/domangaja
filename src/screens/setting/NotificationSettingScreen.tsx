import { type ComponentType } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { type SvgProps } from 'react-native-svg';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Layout, StackHeader } from '@/shared/components/layout';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { colors } from '@/shared/constants/colors';
import { notificationQueries, notificationMutations } from '@/domains/notification/api/queries';
import { NotificationPermissionBanner } from '@/domains/notification/components';
import type { NotificationSettings } from '@/domains/notification/types/api';
import { SettingSection, SettingToggleItem } from './components';
import { GiftFillIcon, LocationFillIcon, MessageOutlineIcon } from '@/assets/icons/common';
import { useNotificationPermission } from '@/domains/notification/hooks/useNotificationPermission';

type AlertKey = Exclude<keyof NotificationSettings, 'pushEnabled'>;

interface NotificationItem {
  key: AlertKey;
  i18nKey: 'quietness' | 'community' | 'marketing';
  icon: ComponentType<SvgProps>;
  iconColor: string;
  badgeColor: string;
}

const NOTIFICATION_ITEMS: NotificationItem[] = [
  {
    key: 'congestionAlert',
    i18nKey: 'quietness',
    icon: LocationFillIcon,
    iconColor: colors.blue[500],
    badgeColor: colors.blue[50],
  },
  {
    key: 'communityAlert',
    i18nKey: 'community',
    icon: MessageOutlineIcon,
    iconColor: colors.red[300],
    badgeColor: colors.red[50],
  },
  {
    key: 'marketingAlert',
    i18nKey: 'marketing',
    icon: GiftFillIcon,
    iconColor: colors.orange[500],
    badgeColor: colors.orange[50],
  },
];

export default function NotificationSettingScreen() {
  const { t } = useTranslation();
  const { isPermissionGranted } = useNotificationPermission();

  const { data: settings } = useQuery(notificationQueries.getNotificationSetting());
  const { mutate: saveSettings } = useMutation(notificationMutations.updateNotificationSettings());

  const isPushEnabled = settings?.pushEnabled ?? false;

  // 마스터: pushEnabled만 뒤집는다 — 개별 알림 설정은 보존돼서 다시 켜면 그대로 복원
  const handleTogglePush = () => {
    if (settings == null) {
      return;
    }
    saveSettings({ ...settings, pushEnabled: !settings.pushEnabled });
  };

  // 개별: 해당 알림 하나만 뒤집는다 (4필드 필수 PUT이라 통째로 전송)
  const handleToggleAlert = (key: AlertKey) => {
    if (settings == null) {
      return;
    }
    saveSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <Layout>
      <StackHeader title={t('notificationSetting.title')} />
      {!isPermissionGranted && <NotificationPermissionBanner />}
      <View style={styles.container}>
        <SettingToggleItem
          title={t('notificationSetting.push.title')}
          description={t('notificationSetting.push.description')}
          value={isPushEnabled}
          onValueChange={handleTogglePush}
          disabled={settings == null || !isPermissionGranted}
        />
        <SettingSection title={t('notificationSetting.section')}>
          {NOTIFICATION_ITEMS.map(item => (
            <SettingToggleItem
              key={item.key}
              icon={item.icon}
              iconColor={item.iconColor}
              badgeColor={item.badgeColor}
              title={t(`notificationSetting.items.${item.i18nKey}.title`)}
              description={t(`notificationSetting.items.${item.i18nKey}.description`)}
              value={settings?.[item.key] ?? false}
              onValueChange={() => handleToggleAlert(item.key)}
              disabled={settings == null || !isPermissionGranted || !isPushEnabled}
            />
          ))}
        </SettingSection>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
    gap: 12,
  },
});
