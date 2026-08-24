import { FlatList, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { toImageUrl } from '@/shared/api/service';
import { showToast } from '@/shared/lib/toast';
import { feedMutations, feedQueries } from '@/domains/feed/api/queries';
import type { Story } from '@/domains/feed/types/api';
import StoryHeader from './StoryHeader';
import StoryCard from './StoryCard';

interface StoryListProps {
  bottomInset?: number;
}

function StoryEmptyState() {
  return (
    <View style={styles.empty}>
      <Text typography="st10" weight="semiBold" color={colors.grey[400]}>
        아직 등록된 스토리가 없어요.
      </Text>
    </View>
  );
}

export default function StoryList({ bottomInset = 0 }: StoryListProps) {
  const navigation = useNavigation();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    feedQueries.storyList(),
  );
  const stories = data?.pages.flatMap(page => page.content) ?? [];
  const isOddCount = stories.length % 2 === 1;
  const rows: (Story | null)[] = isOddCount ? [...stories, null] : stories;

  const { mutate: likeStory, isPending: isLiking } = useMutation(feedMutations.likeStory());
  const { mutate: unlikeStory, isPending: isUnliking } = useMutation(feedMutations.unlikeStory());

  const handlePressLike = (story: Story) => {
    // 좋아요 요청이 진행 중이면 다른 카드를 눌러도 중복 요청하지 않는다
    if (isLiking || isUnliking) {
      return;
    }
    if (story.likedByMe) {
      unlikeStory(story.id, {
        onError: () => showToast('error', '좋아요 취소에 실패했어요. 잠시 후 다시 시도해주세요.'),
      });
    } else {
      likeStory(story.id, {
        onError: () => showToast('error', '좋아요에 실패했어요. 잠시 후 다시 시도해주세요.'),
      });
    }
  };

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
      style={styles.flatList}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.list}
      ListHeaderComponent={<StoryHeader />}
      ListHeaderComponentStyle={styles.header}
      ListEmptyComponent={data != null ? StoryEmptyState : null}
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
            onPressLike={() => handlePressLike(item)}
          />
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
  },
  list: {
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
    paddingTop: 16,
    gap: 12,
    flexGrow: 1,
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
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
});
