import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { EmptyState } from '@/shared/components/ui';
import { spotMutations, spotQueries } from '@/domains/spot/api/queries';
import type { RecentSpot } from '@/domains/spot/types/api';
import { ClockOutlineIcon } from '@/assets/icons/common';
import SectionHeader from './SectionHeader';
import SpotListItem from './SpotListItem';

export default function RecentSpotSection() {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const { data: recentSpots } = useSuspenseQuery(spotQueries.getRecentSpots());
  const { mutate: createScrap } = useMutation(spotMutations.createScrap());
  const { mutate: deleteScrap } = useMutation(spotMutations.deleteScrap());

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
      quietnessScore: spot.quietnessScore,
    });
  };

  return (
    <View style={styles.container}>
      <SectionHeader title={t('spot.recent.title')} onPressSeeAll={() => navigate('RecentSpot')} />

      {recentSpots.length === 0 ? (
        <EmptyState
          icon={ClockOutlineIcon}
          title={t('spot.recent.empty.title')}
          description={t('spot.recent.empty.description')}
        />
      ) : (
        <View style={styles.list}>
          {recentSpots.map(spot => (
            <SpotListItem
              key={spot.contentId}
              name={spot.title}
              region={spot.regionName}
              quietness={spot.quietnessScore}
              image={{ uri: spot.imageUrl }}
              isScrapped={spot.scrapped}
              onPressItem={() => console.log('도망지 상세 페이지로 이동')}
              onPressScrap={() => handlePressScrap(spot)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  list: {
    gap: 10,
  },
});
