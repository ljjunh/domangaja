import { Suspense } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useMutation, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { Layout, StackHeader } from '@/shared/components/layout';
import { EmptyState } from '@/shared/components/ui';
import { colors } from '@/shared/constants/colors';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { spotMutations, spotQueries } from '@/domains/spot/api/queries';
import { SpotListItem } from '@/domains/spot/components';
import type { RecentSpot } from '@/domains/spot/types/api';
import { ClockOutlineIcon } from '@/assets/icons/common';
import { RecentSpotSkeleton } from './components';

export default function RecentSpotScreen() {
  const { t } = useTranslation();

  return (
    <Layout>
      <StackHeader title={t('spot.recent.title')} />
      <Suspense
        fallback={
          <View style={styles.placeholder}>
            <RecentSpotSkeleton />
          </View>
        }
      >
        <RecentSpotList />
      </Suspense>
    </Layout>
  );
}

function RecentSpotList() {
  const { t } = useTranslation();
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useSuspenseInfiniteQuery(
    spotQueries.getRecentSpotsInfinite(),
  );
  const { mutate: createScrap } = useMutation(spotMutations.createScrap());
  const { mutate: deleteScrap } = useMutation(spotMutations.deleteScrap());

  const recentSpots = data.pages.flat();

  const handlePressScrap = (spot: RecentSpot) => {
    if (spot.scrapped) {
      deleteScrap({ contentId: spot.contentId });
      return;
    }
    createScrap({
      contentId: spot.contentId,
      title: spot.title,
      regionName: spot.regionName,
      imageUrl: spot.imageUrl,
      quietnessScore: spot.quietnessScore ?? undefined,
    });
  };

  if (recentSpots.length === 0) {
    return (
      <View style={styles.placeholder}>
        <EmptyState
          icon={ClockOutlineIcon}
          title={t('spot.recent.empty.title')}
          description={t('spot.recent.empty.description')}
        />
      </View>
    );
  }

  return (
    <FlatList
      data={recentSpots}
      keyExtractor={spot => spot.contentId}
      contentContainerStyle={styles.list}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator style={styles.footer} color={colors.grey[400]} />
        ) : null
      }
      renderItem={({ item }) => (
        <SpotListItem
          name={item.title}
          region={item.regionName}
          quietness={item.quietnessScore}
          imageUrl={item.imageUrl}
          isScrapped={item.scrapped}
          onPressItem={() => console.log('TODO: 도망지 상세로 이동')}
          onPressScrap={() => handlePressScrap(item)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
    gap: 12,
  },
  footer: {
    paddingVertical: 20,
  },
  placeholder: {
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
    flex: 1,
    justifyContent: 'center',
  },
});
