import { useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Layout, StackHeader } from '@/shared/components/layout';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { Text } from '@/shared/components/base';
import { example1Image, example2Image } from '@/assets/images';
import { SpotListItem } from '@/domains/spot/components';

// TODO: 서버 연동 시 저장 목록 쿼리로 교체, toggle 훅 분리, 낙관적업데이트
const MOCK_SAVED_SPOTS = [
  {
    id: 1,
    name: '전북 무주 반디랜드',
    region: '전북 무주',
    quietness: 91,
    image: example1Image,
    isBookmarked: true,
  },
  {
    id: 2,
    name: '강원 양양 죽도해변',
    region: '강원 양양',
    quietness: 86,
    image: example2Image,
    isBookmarked: true,
  },
  {
    id: 3,
    name: '경북 영양 반딧불이천문대',
    region: '경북 영양',
    quietness: 87,
    image: example1Image,
    isBookmarked: true,
  },
  {
    id: 4,
    name: '전남 신안 우이도',
    region: '전남 신안',
    quietness: 89,
    image: example2Image,
    isBookmarked: true,
  },
];

export default function SavedSpotScreen() {
  const [spots, setSpots] = useState(MOCK_SAVED_SPOTS);

  const toggleBookmark = (id: number) => {
    setSpots(prev =>
      prev.map(spot => (spot.id === id ? { ...spot, isBookmarked: !spot.isBookmarked } : spot)),
    );
  };

  return (
    <Layout>
      <StackHeader title="저장한 곳" />
      <FlatList
        data={spots}
        keyExtractor={spot => String(spot.id)}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text typography="t6" weight="semiBold">
            총 {spots.length}곳
          </Text>
        }
        renderItem={({ item }) => (
          <SpotListItem
            name={item.name}
            region={item.region}
            quietness={item.quietness}
            image={item.image}
            isBookmarked={item.isBookmarked}
            onPressItem={() => console.log('TODO: 도망지 상세로 이동')}
            onPressBookmark={() => toggleBookmark(item.id)}
          />
        )}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
    gap: 12,
  },
});
