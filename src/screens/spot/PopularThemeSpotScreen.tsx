import { Suspense } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { type StaticScreenProps, useNavigation } from '@react-navigation/native';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Text } from '@/shared/components/base';
import { Layout, StackHeader } from '@/shared/components/layout';
import { EmptyState } from '@/shared/components/ui';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { colors } from '@/shared/constants/colors';
import type { SpotTheme } from '@/shared/types/spotTheme';
import { spotQueries } from '@/domains/spot/api/queries';
import { ThemeInterestButton, ThemeSpotListItem } from '@/domains/spot/components';
import { ClockOutlineIcon } from '@/assets/icons/common';
import { ThemeSpotSkeleton } from './components';

const POPULAR_THEME_SPOT_LIMIT = 20;

type Props = StaticScreenProps<{ theme: SpotTheme }>;

export default function PopularThemeSpotScreen({ route }: Props) {
  const { t } = useTranslation();

  return (
    <Layout>
      <StackHeader title={t('spot.theme.popular.title')} />
      <Suspense
        fallback={
          <View style={styles.placeholder}>
            <ThemeSpotSkeleton />
          </View>
        }
      >
        <PopularThemeSpotList theme={route.params.theme} />
      </Suspense>
    </Layout>
  );
}

function PopularThemeSpotList({ theme }: { theme: SpotTheme }) {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useSuspenseInfiniteQuery(
    spotQueries.getPopularSpotsInfinite({ theme }, POPULAR_THEME_SPOT_LIMIT),
  );
  const spots = data.pages.flat();

  return (
    <FlatList
      data={spots}
      keyExtractor={spot => spot.contentId}
      contentContainerStyle={[styles.list, spots.length === 0 && styles.emptyList]}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={
        <View style={styles.header}>
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
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator style={styles.footer} color={colors.grey[400]} />
        ) : null
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
  list: { paddingHorizontal: SCREEN_PADDING_HORIZONTAL, paddingBottom: 24, gap: 12 },
  emptyList: { flexGrow: 1 },
  placeholder: { paddingHorizontal: SCREEN_PADDING_HORIZONTAL },
  footer: { paddingVertical: 20 },
  header: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
