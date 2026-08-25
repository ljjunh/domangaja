import { Suspense } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Text } from '@/shared/components/base';
import { Layout, StackHeader } from '@/shared/components/layout';
import { EmptyState } from '@/shared/components/ui';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import type { TourismSpotTheme } from '@/shared/types/spotTheme';
import { spotQueries } from '@/domains/spot/api/queries';
import { ThemeInterestButton, ThemeSpotListItem } from '@/domains/spot/components';
import { ClockOutlineIcon } from '@/assets/icons/common';
import { RecentSpotSkeleton } from './components';

const THEME_SPOT_LIMIT = 20;

type ThemeSpotScreenProps = StaticScreenProps<{ theme: TourismSpotTheme }>;

// TODO: 컴포넌트 분리하기, screens/spot/components 디렉토리도 점검하기
export default function ThemeSpotScreen({ route }: ThemeSpotScreenProps) {
  const { t } = useTranslation();

  return (
    <Layout>
      <StackHeader title={t('spot.theme.browse.title')} />
      <Suspense
        fallback={
          <View style={styles.skeleton}>
            <RecentSpotSkeleton />
          </View>
        }
      >
        <ThemeSpotList theme={route.params.theme} />
      </Suspense>
    </Layout>
  );
}

function ThemeSpotList({ theme }: { theme: TourismSpotTheme }) {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const { data: spots } = useSuspenseQuery(
    spotQueries.getThemeSpots({ theme, limit: THEME_SPOT_LIMIT }),
  );
  return (
    <FlatList
      data={spots}
      keyExtractor={spot => spot.contentId}
      contentContainerStyle={[styles.list, spots.length === 0 && styles.emptyList]}
      ListHeaderComponent={
        <View style={styles.themeHeader}>
          <Text typography="t6" weight="semiBold">
            {t(`spot.theme.names.${theme}`)}
          </Text>
          <ThemeInterestButton theme={theme} />
        </View>
      }
      ListEmptyComponent={
        <EmptyState
          icon={ClockOutlineIcon}
          title={t('spot.theme.result.empty.title')}
          description={t('spot.theme.result.empty.description')}
        />
      }
      renderItem={({ item }) => (
        <ThemeSpotListItem
          spot={item}
          onPress={() => navigate('SpotDetail', { contentId: item.contentId })}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
    paddingBottom: 24,
    gap: 12,
  },
  emptyList: {
    flexGrow: 1,
  },
  skeleton: {
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
  },
  themeHeader: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
