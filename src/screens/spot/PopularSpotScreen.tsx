import { Suspense, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { Layout, StackHeader } from '@/shared/components/layout';
import { EmptyState } from '@/shared/components/ui';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import type { SpotTheme } from '@/shared/types/spotTheme';
import { spotMutations, spotQueries } from '@/domains/spot/api/queries';
import { SpotListItem } from '@/domains/spot/components';
import type { PopularSpot } from '@/domains/spot/types/api';
import { ClockOutlineIcon } from '@/assets/icons/common';
import { PopularSpotSkeleton, ThemeFilterChips } from './components';

const POPULAR_LIMIT = 50;

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
  const [selectedTheme, setSelectedTheme] = useState<SpotTheme | null>(null);
  const { data: popularSpots } = useSuspenseQuery(
    spotQueries.getPopularSpots({ limit: POPULAR_LIMIT }),
  );
  const { mutate: createScrap } = useMutation(spotMutations.createScrap());
  const { mutate: deleteScrap } = useMutation(spotMutations.deleteScrap());

  const visibleSpots =
    selectedTheme == null
      ? popularSpots
      : popularSpots.filter(spot => spot.theme === selectedTheme);

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

      {visibleSpots.length === 0 ? (
        <View style={styles.placeholder}>
          <EmptyState
            icon={ClockOutlineIcon}
            title={t(
              popularSpots.length === 0
                ? 'spot.popular.empty.title'
                : 'spot.popular.emptyTheme.title',
            )}
            description={t(
              popularSpots.length === 0
                ? 'spot.popular.empty.description'
                : 'spot.popular.emptyTheme.description',
            )}
          />
        </View>
      ) : (
        <FlatList
          data={visibleSpots}
          keyExtractor={spot => spot.contentId}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <SpotListItem
              name={item.title}
              region={item.regionName}
              quietness={item.quietnessScore}
              imageUrl={item.imageUrl}
              isScrapped={item.scrapped}
              rank={item.rank}
              onPressItem={() => console.log('TODO: 도망지 상세로 이동')}
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
  placeholder: {
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
  },
});
