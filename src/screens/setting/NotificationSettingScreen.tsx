import { useState, type ComponentType } from 'react';
import { StyleSheet, View } from 'react-native';
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
  title: string;
  description: string;
}

const NOTIFICATION_ITEMS: NotificationItem[] = [
  {
    key: 'quietness',
    icon: LocationFillIcon,
    iconColor: colors.orange[500],
    badgeColor: colors.orange[50],
    title: '한적도',
    description: '관심 장소가 지금 한적할 때 알려드립니다.',
  },
  {
    key: 'like',
    icon: HeartOutlineIcon,
    iconColor: colors.red[500],
    badgeColor: colors.red[50],
    title: '좋아요',
    description: '내 게시물에 좋아요가 눌렸을 때',
  },
  {
    key: 'comment',
    icon: MessageOutlineIcon,
    iconColor: colors.purple[500],
    badgeColor: colors.purple[50],
    title: '댓글 작성',
    description: '내 게시물에 댓글이 작성되었을 때',
  },
];

export default function NotificationSettingScreen() {
  const [settings, setSettings] = useState(MOCK_SETTINGS);

  const toggle = (key: SettingKey) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Layout>
      <StackHeader title="알림" />
      <View style={styles.container}>
        <SettingToggleItem
          title="앱 푸시 알림"
          description="앱에서 보내는 푸시 알림을 받습니다."
          value={settings.push}
          onValueChange={() => toggle('push')}
        />
        <SettingSection title="알림 항목">
          {NOTIFICATION_ITEMS.map(item => (
            <SettingToggleItem
              key={item.key}
              icon={item.icon}
              iconColor={item.iconColor}
              badgeColor={item.badgeColor}
              title={item.title}
              description={item.description}
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
