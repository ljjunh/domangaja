import { ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from '@/shared/components/base';
import { Layout, Header } from '@/shared/components/layout';
import { colors } from '@/shared/constants/colors';
import { useMainTabBarSpace } from '@/shared/hooks/useMainTabBarSpace';
import { MAIN_TAB_SCREEN_EDGES, SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { NotificationButton } from '@/domains/notification/components';
import { SettingListItem, SettingSection } from './components';
import { UserFillIcon } from '@/assets/icons/nav';
import {
  ArchiveTickFillIcon,
  CloseSquareFillIcon,
  DocumentTextFillIcon,
  InfoCircleFillIcon,
  LogoutFillIcon,
  NotificationFillIcon,
  ShieldSecurityFillIcon,
  TranslateFillIcon,
} from '@/assets/icons/common';
import { useLogout } from '@/domains/auth/hooks/useLogout';

export default function SettingScreen() {
  const mainTabBarSpace = useMainTabBarSpace();
  const { navigate } = useNavigation();
  const { confirmLogout } = useLogout();

  return (
    <Layout edges={MAIN_TAB_SCREEN_EDGES}>
      <Header
        left={
          <Text typography="t4" weight="bold">
            설정
          </Text>
        }
        right={<NotificationButton />}
      />
      <ScrollView contentContainerStyle={[styles.container, { paddingBottom: mainTabBarSpace }]}>
        <SettingSection title="계정">
          <SettingListItem
            icon={UserFillIcon}
            iconColor={colors.blue[500]}
            label="내 정보"
            value="aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
            onPress={() => navigate('MyInfo')}
          />
          <SettingListItem
            icon={ArchiveTickFillIcon}
            iconColor={colors.red[300]}
            label="저장한 곳"
            value="3곳"
            onPress={() => navigate('SavedSpot')}
          />
        </SettingSection>

        <SettingSection title="앱 설정">
          <SettingListItem
            icon={NotificationFillIcon}
            iconColor={colors.orange[500]}
            label="알림"
            value="꺼짐"
            onPress={() => navigate('NotificationSetting')}
          />
          <SettingListItem
            icon={TranslateFillIcon}
            iconColor={colors.teal[500]}
            label="언어"
            value="한국어"
            onPress={() => navigate('LanguageSetting')}
          />
        </SettingSection>

        <SettingSection title="앱 정보">
          <SettingListItem
            icon={InfoCircleFillIcon}
            iconColor={colors.blue[500]}
            label="버전 정보"
            value="1.0.0"
          />
          <SettingListItem
            icon={DocumentTextFillIcon}
            iconColor={colors.purple[500]}
            label="이용약관"
            onPress={() => console.log('이용약관 페이지 이동')}
          />
          <SettingListItem
            icon={ShieldSecurityFillIcon}
            iconColor={colors.blue[500]}
            label="개인정보 처리방침"
            onPress={() => console.log('개인정보 처리방침 페이지 이동')}
          />
        </SettingSection>

        <SettingSection title="계정 관리">
          <SettingListItem
            icon={LogoutFillIcon}
            iconColor={colors.red[500]}
            label="로그아웃"
            onPress={confirmLogout}
          />
          <SettingListItem
            icon={CloseSquareFillIcon}
            iconColor={colors.red[500]}
            label="탈퇴하기"
            onPress={() => console.log('탈퇴 페이지 이동')}
          />
        </SettingSection>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
    gap: 18,
  },
});
