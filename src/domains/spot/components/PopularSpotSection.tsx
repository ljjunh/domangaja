import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSuspenseQuery } from '@tanstack/react-query';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { EmptyState } from '@/shared/components/ui';
import { spotQueries } from '@/domains/spot/api/queries';
import { ClockOutlineIcon } from '@/assets/icons/common';
import SectionHeader from './SectionHeader';
import RankedSpotCard from './RankedSpotCard';
import { useNavigation } from '@react-navigation/native';

export default function PopularSpotSection() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { data: spots } = useSuspenseQuery(spotQueries.getPopularSpots({ limit: 5 }));

  return (
    <View style={styles.container}>
      <SectionHeader
        title="지금 많이 찾는 도망지"
        onPressSeeAll={() => console.log('지금 많이 찾는 도망지 상세페이지로 이동')}
      />

      {spots.length === 0 ? (
        <EmptyState
          icon={ClockOutlineIcon}
          title={t('spot.popular.empty.title')}
          description={t('spot.popular.empty.description')}
        />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scroll}
          contentContainerStyle={styles.list}
        >
          {spots.map(spot => (
            <RankedSpotCard
              key={spot.contentId}
              rank={spot.rank}
              name={spot.title}
              quietness={spot.quietnessScore}
              image={{ uri: spot.imageUrl }}
              onPress={() =>
                navigation.navigate('SpotDetail', {
                  contentId: spot.contentId,
                })
              }
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  scroll: {
    marginHorizontal: -SCREEN_PADDING_HORIZONTAL,
  },
  list: {
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
    gap: 12,
  },
});
