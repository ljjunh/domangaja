import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSuspenseQuery } from '@tanstack/react-query';
import { EmptyState } from '@/shared/components/ui';
import { spotQueries } from '@/domains/spot/api/queries';
import { ClockOutlineIcon } from '@/assets/icons/common';
import SectionHeader from './SectionHeader';
import SpotListItem from './SpotListItem';

export default function RecentSpotSection() {
  const { t } = useTranslation();
  const { data: recentSpots } = useSuspenseQuery(spotQueries.getRecentSpots());
  console.log(recentSpots);

  return (
    <View style={styles.container}>
      <SectionHeader
        title="최근 본 도망지"
        onPressSeeAll={() => console.log('최근 본 스팟으로 이동')}
      />

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
              onPressScrap={() => console.log('스크랩 api 연동')}
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
