import { useState, type ComponentType } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { type SvgProps } from 'react-native-svg';
import { Layout, StackHeader } from '@/shared/components/layout';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { colors } from '@/shared/constants/colors';
import { SettingSection, SettingToggleItem } from './components';
import { HeartOutlineIcon, LocationFillIcon, MessageOutlineIcon } from '@/assets/icons/common';

// TODO: 시스템 권한 막혀있을때 푸쉬 on 하면 시스템 세팅으로 이동하는 바텀시트

// TODO: 서버 연동 시 Notification 설정 쿼리로 교체
const MOCK_SETTINGS = {
  push: true,
  quietness: false,
  like: true,
  comment: true,
};

type SettingKey = keyof typeof MOCK_SETTINGS;

interface NotificationItem {
  key: Exclude<SettingKey, 'push'>;
  icon: ComponentType<SvgProps>;
  iconColor: string;
  badgeColor: string;
}

const NOTIFICATION_ITEMS: NotificationItem[] = [
  {
    key: 'quietness',
    icon: LocationFillIcon,
    iconColor: colors.orange[500],
    badgeColor: colors.orange[50],
  },
  {
    key: 'like',
    icon: HeartOutlineIcon,
    iconColor: colors.red[500],
    badgeColor: colors.red[50],
  },
  {
    key: 'comment',
    icon: MessageOutlineIcon,
    iconColor: colors.purple[500],
    badgeColor: colors.purple[50],
  },
];

export default function NotificationSettingScreen() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState(MOCK_SETTINGS);

  const toggle = (key: SettingKey) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Layout>
      <StackHeader title={t('notificationSetting.title')} />
      <View style={styles.container}>
        <SettingToggleItem
          title={t('notificationSetting.push.title')}
          description={t('notificationSetting.push.description')}
          value={settings.push}
          onValueChange={() => toggle('push')}
        />
        <SettingSection title={t('notificationSetting.section')}>
          {NOTIFICATION_ITEMS.map(item => (
            <SettingToggleItem
              key={item.key}
              icon={item.icon}
              iconColor={item.iconColor}
              badgeColor={item.badgeColor}
              title={t(`notificationSetting.items.${item.key}.title`)}
              description={t(`notificationSetting.items.${item.key}.description`)}
              value={settings[item.key]}
              onValueChange={() => toggle(item.key)}
              disabled={!settings.push}
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
