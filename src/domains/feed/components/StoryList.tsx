import { FlatList, StyleSheet, View, type ImageSourcePropType } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { toImageUrl } from '@/shared/api/service';
import { example1Image, example2Image } from '@/assets/images';
import { feedQueries } from '@/domains/feed/api/queries';
import type { Story } from '@/domains/feed/types/api';
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

// storyId만 갖고 상세 화면에 진입하는 경우를 위한 목업 — 상세 조회 API 연동 전까지
// StoryDetailScreen이 계속 참조한다 (이 화면의 실제 목록 렌더링에는 더 이상 쓰이지 않음)
export const MOCK_STORIES: StoryPost[] = [
  {
    id: 1,
    nickname: 'axx_xx',
    locationLabel: '강원 속초 부근',
    quietness: 5,
    placeName: '***도 **시',
    viewCount: 52,
    image: example1Image,
  },
  {
    id: 2,
    nickname: 'axx_xx',
    locationLabel: '강원 속초 부근',
    quietness: 5,
    placeName: '***도 **시',
    viewCount: 52,
    image: example2Image,
  },
  {
    id: 3,
    nickname: 'axx_xx',
    locationLabel: '강원 속초 부근',
    quietness: 5,
    placeName: '***도 **시',
    viewCount: 52,
    image: example1Image,
  },
  {
    id: 4,
    nickname: 'axx_xx',
    locationLabel: '강원 속초 부근',
    quietness: 5,
    placeName: '***도 **시',
    viewCount: 52,
    image: example2Image,
  },
  {
    id: 5,
    nickname: 'axx_xx',
    locationLabel: '강원 속초 부근',
    quietness: 5,
    placeName: '***도 **시',
    viewCount: 52,
    image: example1Image,
  },
  {
    id: 6,
    nickname: 'axx_xx',
    locationLabel: '강원 속초 부근',
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
  const navigation = useNavigation();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    feedQueries.storyList(),
  );
  const stories = data?.pages.flatMap(page => page.content) ?? [];
  const isOddCount = stories.length % 2 === 1;
  const rows: (Story | null)[] = isOddCount ? [...stories, null] : stories;

  const handleEndReached = () => {
    // hasNextPage가 false면 요청하지 않고, 이미 다음 페이지를 불러오는 중이면 중복 요청하지 않는다
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <FlatList
      data={rows}
      keyExtractor={(item, index) => (item == null ? `filler-${index}` : String(item.id))}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.list}
      ListHeaderComponent={<StoryHeader />}
      ListHeaderComponentStyle={styles.header}
      ListFooterComponent={<View style={{ height: bottomInset }} />}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      renderItem={({ item }) =>
        item == null ? (
          <View style={styles.filler} />
        ) : (
          <StoryCard
            quietness={item.quietnessScore}
            placeName={item.spotName}
            viewCount={item.viewCount}
            liked={item.likedByMe}
            image={{ uri: toImageUrl(item.imageUrl) ?? item.imageUrl }}
            onPress={() => navigation.navigate('StoryDetail', { storyId: item.id })}
          />
        )
      }
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
  filler: {
    flex: 1,
  },
});
