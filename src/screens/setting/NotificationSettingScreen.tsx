import { type ComponentType } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { type SvgProps } from 'react-native-svg';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Layout, StackHeader } from '@/shared/components/layout';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { colors } from '@/shared/constants/colors';
import { notificationQueries, notificationMutations } from '@/domains/notification/api/queries';
import type { NotificationSettings } from '@/domains/notification/types/api';
import { SettingSection, SettingToggleItem } from './components';
import { GiftFillIcon, LocationFillIcon, MessageOutlineIcon } from '@/assets/icons/common';

// TODO: 시스템 권한 막혀있을때 푸쉬 on 하면 시스템 세팅으로 이동하는 로직 & UI

interface NotificationItem {
  key: keyof NotificationSettings;
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

  const { data: settings } = useQuery(notificationQueries.getNotificationSetting());
  const { mutate: saveSettings } = useMutation(notificationMutations.updateNotificationSettings());

  // 마스터 토글 표시값: 알림이 하나라도 켜져 있으면 켜짐
  const isPushEnabled = settings != null && Object.values(settings).some(Boolean);

  // 마스터: 모든 알림을 한꺼번에 켜거나 끈다
  const handleToggleAllAlerts = () => {
    if (settings == null) {
      return;
    }
    const next = !isPushEnabled;
    saveSettings({ congestionAlert: next, communityAlert: next, marketingAlert: next });
  };

  // 개별: 해당 알림 하나만 뒤집는다 (3필드 필수 PUT이라 통째로 전송)
  const handleToggleAlert = (key: keyof NotificationSettings) => {
    if (settings == null) {
      return;
    }
    saveSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <Layout>
      <StackHeader title={t('notificationSetting.title')} />
      <View style={styles.container}>
        <SettingToggleItem
          title={t('notificationSetting.push.title')}
          description={t('notificationSetting.push.description')}
          value={isPushEnabled}
          onValueChange={handleToggleAllAlerts}
          disabled={settings == null}
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
              disabled={!isPushEnabled || settings == null}
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
