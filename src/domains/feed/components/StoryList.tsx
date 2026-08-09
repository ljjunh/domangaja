import { FlatList, StyleSheet, View, type ImageSourcePropType } from 'react-native';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { example1Image, example2Image } from '@/assets/images';
import StoryHeader from './StoryHeader';
import StoryCard from './StoryCard';

interface StoryPost {
  id: number;
  quietness: number;
  placeName: string;
  viewCount: number;
  image: ImageSourcePropType;
}

const MOCK_STORIES: StoryPost[] = [
  { id: 1, quietness: 5, placeName: '***도 **시', viewCount: 52, image: example1Image },
  { id: 2, quietness: 5, placeName: '***도 **시', viewCount: 52, image: example2Image },
  { id: 3, quietness: 5, placeName: '***도 **시', viewCount: 52, image: example1Image },
  { id: 4, quietness: 5, placeName: '***도 **시', viewCount: 52, image: example2Image },
  { id: 5, quietness: 5, placeName: '***도 **시', viewCount: 52, image: example1Image },
  { id: 6, quietness: 5, placeName: '***도 **시', viewCount: 52, image: example2Image },
];

interface StoryListProps {
  bottomInset?: number;
}

export default function StoryList({ bottomInset = 0 }: StoryListProps) {
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
