import { ScrollView, StyleSheet, View } from 'react-native';
import { example1Image, example2Image } from '@/assets/images';
import SectionHeader from './SectionHeader';
import RankedSpotCard from './RankedSpotCard';

const MOCK_POPULAR_SPOTS = [
  { rank: 1, name: '강원 인제 자작나무숲', quietness: 92, image: example2Image },
  { rank: 2, name: '전남 신안 우이도', quietness: 89, image: example1Image },
  { rank: 3, name: '경북 영양 반딧불이천문대', quietness: 87, image: example2Image },
  { rank: 4, name: '전남 완도 보길도', quietness: 85, image: example1Image },
  { rank: 5, name: '강원 속초해수욕장', quietness: 82, image: example2Image },
  { rank: 6, name: '전남 담양', quietness: 75, image: example1Image },
];

export default function PopularSpotSection() {
  return (
    <View style={styles.container}>
      <SectionHeader
        title="지금 많이 찾는 도망지"
        onPressSeeAll={() => console.log('지금 많이 찾는 도망지 상세페이지로 이동')}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {MOCK_POPULAR_SPOTS.map(spot => (
          <RankedSpotCard
            key={spot.rank}
            rank={spot.rank}
            name={spot.name}
            quietness={spot.quietness}
            image={spot.image}
            onPress={() => console.log('도망지 상세페이지로 이동')}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  list: {
    gap: 12,
  },
});
