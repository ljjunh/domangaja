import { ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import DeviceInfo from 'react-native-device-info';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { Text } from '@/shared/components/base';
import { Layout, Header } from '@/shared/components/layout';
import { colors } from '@/shared/constants/colors';
import { useMainTabBarSpace } from '@/shared/hooks/useMainTabBarSpace';
import { useLogout } from '@/domains/auth/hooks/useLogout';
import { useWithdrawal } from '@/domains/auth/hooks/useWithdrawal';
import { useNotificationPermission } from '@/domains/notification/hooks/useNotificationPermission';
import { MAIN_TAB_SCREEN_EDGES, SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { NotificationButton } from '@/domains/notification/components';
import { userQueries } from '@/domains/user/api/queries';
import { getLanguageNativeName } from '@/shared/i18n/languages';
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
import { notificationQueries } from '@/domains/notification/api/queries';

export default function SettingScreen() {
  const mainTabBarSpace = useMainTabBarSpace();
  const { i18n, t } = useTranslation();
  const { navigate } = useNavigation();
  const { confirmLogout } = useLogout();
  const { confirmWithdrawal } = useWithdrawal();
  const { isPermissionGranted } = useNotificationPermission();
  const { data: me } = useQuery(userQueries.getMe());
  const { data: notificationSettings } = useQuery(notificationQueries.getNotificationSetting());

  return (
    <Layout edges={MAIN_TAB_SCREEN_EDGES}>
      <Header
        left={
          <Text typography="t4" weight="bold">
            {t('setting.title')}
          </Text>
        }
        right={<NotificationButton />}
      />
      <ScrollView contentContainerStyle={[styles.container, { paddingBottom: mainTabBarSpace }]}>
        <SettingSection title={t('setting.sections.account')}>
          <SettingListItem
            icon={UserFillIcon}
            iconColor={colors.blue[500]}
            label={t('myInfo.title')}
            value={me?.nickname}
            onPress={() => navigate('MyInfo')}
          />
          <SettingListItem
            icon={ArchiveTickFillIcon}
            iconColor={colors.red[300]}
            label={t('setting.savedSpot')}
            value={t('setting.savedSpotCount', { count: 4 })}
            onPress={() => navigate('SavedSpot')}
          />
        </SettingSection>

        <SettingSection title={t('setting.sections.app')}>
          <SettingListItem
            icon={NotificationFillIcon}
            iconColor={colors.orange[500]}
            label={t('setting.notification')}
            value={
              notificationSettings == null
                ? undefined
                : isPermissionGranted && notificationSettings?.pushEnabled
                ? t('setting.on')
                : t('setting.off')
            }
            onPress={() => navigate('NotificationSetting')}
          />
          <SettingListItem
            icon={TranslateFillIcon}
            iconColor={colors.teal[500]}
            label={t('language.title')}
            value={getLanguageNativeName(i18n.language)}
            onPress={() => navigate('LanguageSetting')}
          />
        </SettingSection>

        <SettingSection title={t('setting.sections.appInfo')}>
          <SettingListItem
            icon={InfoCircleFillIcon}
            iconColor={colors.blue[500]}
            label={t('setting.version')}
            value={`v ${DeviceInfo.getVersion()}`}
          />
          <SettingListItem
            icon={DocumentTextFillIcon}
            iconColor={colors.purple[500]}
            label={t('setting.terms')}
            onPress={() => navigate('Policy', { type: 'terms' })}
          />
          <SettingListItem
            icon={ShieldSecurityFillIcon}
            iconColor={colors.blue[500]}
            label={t('setting.privacy')}
            onPress={() => navigate('Policy', { type: 'privacy' })}
          />
        </SettingSection>

        <SettingSection title={t('setting.sections.accountManagement')}>
          <SettingListItem
            icon={LogoutFillIcon}
            iconColor={colors.red[500]}
            label={t('logout.title')}
            onPress={confirmLogout}
          />
          <SettingListItem
            icon={CloseSquareFillIcon}
            iconColor={colors.red[500]}
            label={t('withdrawal.title')}
            onPress={confirmWithdrawal}
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
