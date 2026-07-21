import { ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '@/shared/components/base';
import { Layout } from '@/shared/components/layout';
import { MAIN_TAB_SCREEN_EDGES, SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { Header } from '@/shared/components/layout';
import { NotificationButton } from '@/domains/notification/components';
import { useMainTabBarSpace } from '@/shared/hooks/useMainTabBarSpace';
import {
  TodaySpotBanner,
  PopularSpotSection,
  WeeklyThemeSection,
  RecentSpotSection,
} from '@/domains/spot/components';
import { QuickMenu, NearbySpotBanner } from './components';

export default function HomeScreen() {
  const mainTabBarSpace = useMainTabBarSpace();
  const { t } = useTranslation();

  return (
    <Layout edges={MAIN_TAB_SCREEN_EDGES}>
      <Header
        left={
          <Text typography="t4" weight="bold">
            {t('login.title')}
          </Text>
        }
        right={<NotificationButton />}
      />
      <ScrollView contentContainerStyle={[styles.container, { paddingBottom: mainTabBarSpace }]}>
        <TodaySpotBanner />
        <QuickMenu />
        <PopularSpotSection />
        <NearbySpotBanner />
        <WeeklyThemeSection />
        <RecentSpotSection />
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
    gap: 16,
  },
});
