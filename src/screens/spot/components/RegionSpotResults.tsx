import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { SearchIcon } from '@/assets/icons/common';
import { placeholderImage } from '@/assets/images';
import { spotQueries } from '@/domains/spot/api/queries';
import type { AreaSpot, GetAreaSpotsParams } from '@/domains/spot/types/api';
import { Image, Pressable, Text } from '@/shared/components/base';
import { EmptyState } from '@/shared/components/ui';
import { colors } from '@/shared/constants/colors';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { formatQuietness } from '@/shared/utils/formatQuietness';

interface Props {
  search: GetAreaSpotsParams;
}

function RegionSpotItem({ spot, onPress }: { spot: AreaSpot; onPress: () => void }) {
  const { t } = useTranslation();

  return (
    <Pressable onPress={onPress} style={styles.spotItem}>
      <Image
        source={spot.imageUrl ? { uri: spot.imageUrl } : placeholderImage}
        style={styles.image}
      />
      <View style={styles.spotInfo}>
        <Text typography="t7" weight="bold" numberOfLines={1}>
          {spot.title}
        </Text>
        <Text typography="st13" weight="semiBold" color={colors.grey[500]} numberOfLines={2}>
          {spot.address}
          {spot.quietnessScore != null &&
            ` · ${t('spot.regionSearch.quietness', {
              score: formatQuietness(spot.quietnessScore),
            })}`}
        </Text>
      </View>
    </Pressable>
  );
}

export default function RegionSpotResults({ search }: Props) {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const query = useSuspenseInfiniteQuery(spotQueries.getAreaSpotsInfinite(search));
  const spots = query.data.pages.flat();

  if (spots.length === 0) {
    return (
      <View style={styles.stateWrap}>
        <EmptyState
          icon={SearchIcon}
          title={t('spot.regionSearch.empty.title')}
          description={t('spot.regionSearch.empty.description')}
        />
      </View>
    );
  }

  return (
    <FlatList
      data={spots}
      keyExtractor={spot => spot.contentId}
      contentContainerStyle={styles.list}
      onEndReached={() => {
        if (query.hasNextPage && !query.isFetchingNextPage) query.fetchNextPage();
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        query.isFetchingNextPage ? (
          <ActivityIndicator style={styles.footer} color={colors.grey[400]} />
        ) : null
      }
      renderItem={({ item }) => (
        <RegionSpotItem
          spot={item}
          onPress={() =>
            navigate('SpotDetail', {
              contentId: item.contentId,
              lang: search.lang,
            })
          }
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  stateWrap: {
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
    paddingTop: 10,
  },
  list: { paddingHorizontal: SCREEN_PADDING_HORIZONTAL, gap: 10 },
  spotItem: { flexDirection: 'row', gap: 12 },
  image: { width: 70, height: 70, borderRadius: 12 },
  spotInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 5,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[200],
  },
  footer: { paddingVertical: 20 },
});
