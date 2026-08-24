import { Suspense, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { Layout, StackHeader } from '@/shared/components/layout';
import { EmptyState } from '@/shared/components/ui';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { colors } from '@/shared/constants/colors';
import type { SpotTheme } from '@/shared/types/spotTheme';
import { spotMutations, spotQueries } from '@/domains/spot/api/queries';
import { SpotListItem } from '@/domains/spot/components';
import type { PopularSpot } from '@/domains/spot/types/api';
import { ClockOutlineIcon } from '@/assets/icons/common';
import { PopularSpotSkeleton, ThemeFilterChips } from './components';

export default function PopularSpotScreen() {
  const { t } = useTranslation();

  return (
    <Layout>
      <StackHeader title={t('spot.popular.title')} />
      <Suspense
        fallback={
          <View style={styles.placeholder}>
            <PopularSpotSkeleton />
          </View>
        }
      >
        <PopularSpotList />
      </Suspense>
    </Layout>
  );
}

function PopularSpotList() {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const [selectedTheme, setSelectedTheme] = useState<SpotTheme | null>(null);
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useSuspenseInfiniteQuery(
    spotQueries.getPopularSpotsInfinite({ theme: selectedTheme ?? undefined }),
  );
  const { mutate: createScrap } = useMutation(spotMutations.createScrap());
  const { mutate: deleteScrap } = useMutation(spotMutations.deleteScrap());

  const popularSpots = data.pages.flat();

  const handlePressScrap = (spot: PopularSpot) => {
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

  return (
    <>
      <View style={styles.filter}>
        <ThemeFilterChips selectedTheme={selectedTheme} onSelectTheme={setSelectedTheme} />
      </View>

      {popularSpots.length === 0 ? (
        <View style={styles.placeholder}>
          <EmptyState
            icon={ClockOutlineIcon}
            title={t(
              selectedTheme == null ? 'spot.popular.empty.title' : 'spot.popular.emptyTheme.title',
            )}
            description={t(
              selectedTheme == null
                ? 'spot.popular.empty.description'
                : 'spot.popular.emptyTheme.description',
            )}
          />
        </View>
      ) : (
        <FlatList
          data={popularSpots}
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
              rank={item.rank}
              onPressItem={() => navigate('SpotDetail', { contentId: item.contentId })}
              onPressScrap={() => handlePressScrap(item)}
            />
          )}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  filter: {
    paddingBottom: 12,
  },
  list: {
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
    gap: 12,
  },
  footer: {
    paddingVertical: 20,
  },
  placeholder: {
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
  },
});
