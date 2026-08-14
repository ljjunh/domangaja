import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSuspenseQuery } from '@tanstack/react-query';
import { EmptyState } from '@/shared/components/ui';
import { spotQueries } from '@/domains/spot/api/queries';
import { example1Image, example2Image } from '@/assets/images';
import { ClockOutlineIcon } from '@/assets/icons/common';
import SectionHeader from './SectionHeader';
import SpotListItem from './SpotListItem';

const MOCK_RESENT_SPOT = [
  {
    id: 1,
    name: '전북 무주 반디랜드',
    region: '전북 무주',
    quietness: 91,
    image: example1Image,
    isScrapped: true,
  },
  {
    id: 2,
    name: '강원 양양 죽도해변',
    region: '강원 양양',
    quietness: 87,
    image: example2Image,
    isScrapped: false,
  },
  {
    id: 3,
    name: '전북 무주 반디랜드',
    region: '전북 무주',
    quietness: 85,
    image: example1Image,
    isScrapped: true,
  },
];

export default function RecentSpotSection() {
  const { t } = useTranslation();
  const { data: recentSpots } = useSuspenseQuery(spotQueries.getRecentSpots());

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
          {MOCK_RESENT_SPOT.map(spot => (
            <SpotListItem
              key={spot.id}
              name={spot.name}
              region={spot.region}
              quietness={spot.quietness}
              image={spot.image}
              isScrapped={spot.isScrapped}
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
