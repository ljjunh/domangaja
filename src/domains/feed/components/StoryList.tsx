import { FlatList, StyleSheet, View, type ImageSourcePropType } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { example1Image, example2Image } from '@/assets/images';
import StoryHeader from './StoryHeader';
import StoryCard from './StoryCard';

export interface StoryPost {
  id: number;
  nickname: string;
  locationLabel: string;
  quietness: number;
  placeName: string;
  viewCount: number;
  image: ImageSourcePropType;
}

// Story 상세 화면(StoryDetailScreen)에서도 storyId로 같은 배열을 참조한다
export const MOCK_STORIES: StoryPost[] = [
  {
    id: 1,
    nickname: 'axx_xx',
    locationLabel: '강원 속초 부근 · 1.2km',
    quietness: 5,
    placeName: '***도 **시',
    viewCount: 52,
    image: example1Image,
  },
  {
    id: 2,
    nickname: 'axx_xx',
    locationLabel: '강원 속초 부근 · 1.2km',
    quietness: 5,
    placeName: '***도 **시',
    viewCount: 52,
    image: example2Image,
  },
  {
    id: 3,
    nickname: 'axx_xx',
    locationLabel: '강원 속초 부근 · 1.2km',
    quietness: 5,
    placeName: '***도 **시',
    viewCount: 52,
    image: example1Image,
  },
  {
    id: 4,
    nickname: 'axx_xx',
    locationLabel: '강원 속초 부근 · 1.2km',
    quietness: 5,
    placeName: '***도 **시',
    viewCount: 52,
    image: example2Image,
  },
  {
    id: 5,
    nickname: 'axx_xx',
    locationLabel: '강원 속초 부근 · 1.2km',
    quietness: 5,
    placeName: '***도 **시',
    viewCount: 52,
    image: example1Image,
  },
  {
    id: 6,
    nickname: 'axx_xx',
    locationLabel: '강원 속초 부근 · 1.2km',
    quietness: 5,
    placeName: '***도 **시',
    viewCount: 52,
    image: example2Image,
  },
];

interface StoryListProps {
  bottomInset?: number;
}

export default function StoryList({ bottomInset = 0 }: StoryListProps) {
  const { navigate } = useNavigation();

  return (
    <FlatList
      data={MOCK_STORIES}
      keyExtractor={item => String(item.id)}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.list}
      ListHeaderComponent={<StoryHeader />}
      ListHeaderComponentStyle={styles.header}
      ListFooterComponent={<View style={{ height: bottomInset }} />}
      renderItem={({ item }) => (
        <StoryCard
          quietness={item.quietness}
          placeName={item.placeName}
          viewCount={item.viewCount}
          image={item.image}
          onPress={() => navigate('StoryDetail', { storyId: item.id })}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
    paddingTop: 16,
    gap: 12,
  },
  header: {
    marginBottom: 16,
  },
  row: {
    gap: 12,
  },
});
