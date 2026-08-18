import { FlatList, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { Border } from '@/shared/components/ui';
import { overlay } from '@/shared/overlay';
import { showToast } from '@/shared/lib/toast';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { toImageUrl } from '@/shared/api/service';
import { feedMutations, feedQueries } from '@/domains/feed/api/queries';
import { userQueries } from '@/domains/user/api/queries';
import type { Feed } from '@/domains/feed/types/api';
import FeedBanner from './FeedBanner';
import FeedCommentBottomSheet from './FeedCommentBottomSheet';
import FeedItem from './FeedItem';

interface FeedListProps {
  bottomInset?: number;
}

function FeedItemSeparator() {
  return <Border style={styles.separator} />;
}

// 피드 카드가 리스트 어디서나 호출할 수 있도록 overlay로 댓글 시트를 띄운다 (WithdrawalSheet와 동일한 방식)
function openComments(feedId: number) {
  overlay.open(({ unmount }) => <FeedCommentBottomSheet feedId={feedId} onClose={unmount} />);
}

export default function FeedList({ bottomInset = 0 }: FeedListProps) {
  const navigation = useNavigation();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    feedQueries.feedList(),
  );
  const feeds = data?.pages.flatMap(page => page.content) ?? [];

  // 더보기 메뉴에서 삭제/신고 분기용 — 카드마다 새로 조회하지 않고 한 번만 가져와 비교한다
  const { data: me } = useQuery(userQueries.getMe());

  const { mutate: deleteFeed, isPending: isDeleting } = useMutation(feedMutations.deleteFeed());
  const { mutate: reportFeed, isPending: isReporting } = useMutation(feedMutations.reportFeed());

  const handlePressDelete = (feedId: number) => {
    // 삭제/신고가 진행 중일 때 다른 카드를 눌러도 중복 요청하지 않는다
    if (isDeleting) {
      return;
    }
    deleteFeed(feedId, {
      onError: () => showToast('error', '피드 삭제에 실패했어요. 잠시 후 다시 시도해주세요.'),
    });
  };

  const handlePressReport = (feedId: number) => {
    if (isReporting) {
      return;
    }
    reportFeed(feedId, {
      onError: () => showToast('error', '신고에 실패했어요. 잠시 후 다시 시도해주세요.'),
    });
  };

  const { mutate: bookmarkFeed, isPending: isBookmarking } = useMutation(
    feedMutations.bookmarkFeed(),
  );
  const { mutate: unbookmarkFeed, isPending: isUnbookmarking } = useMutation(
    feedMutations.unbookmarkFeed(),
  );

  const handlePressBookmark = (feed: Feed) => {
    // 북마크 요청이 진행 중이면 다른 카드를 눌러도 중복 요청하지 않는다
    if (isBookmarking || isUnbookmarking) {
      return;
    }
    if (feed.bookmarkedByMe) {
      unbookmarkFeed(feed.id, {
        onError: () => showToast('error', '북마크 해제에 실패했어요. 잠시 후 다시 시도해주세요.'),
      });
    } else {
      bookmarkFeed(feed.id, {
        onError: () => showToast('error', '북마크에 실패했어요. 잠시 후 다시 시도해주세요.'),
      });
    }
  };

  const handleEndReached = () => {
    // hasNext가 false면 요청하지 않고, 이미 다음 페이지를 불러오는 중이면 중복 요청하지 않는다
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <FlatList
      data={feeds}
      keyExtractor={item => String(item.id)}
      contentContainerStyle={styles.list}
      ListHeaderComponent={<FeedBanner />}
      ListHeaderComponentStyle={styles.header}
      ItemSeparatorComponent={FeedItemSeparator}
      ListFooterComponent={<View style={{ height: bottomInset }} />}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      renderItem={({ item }) => (
        <FeedItem
          id={item.id}
          nickname={item.authorNickname}
          createdAt={item.createdAt}
          locationLabel={item.regionName}
          title={item.title}
          content={item.content}
          image={{ uri: toImageUrl(item.imageUrl) ?? item.imageUrl }}
          placeName={item.spotName}
          viewCount={item.viewCount}
          commentCount={item.commentCount}
          isMine={me != null && me.id === item.userId}
          onPress={() => navigation.navigate('FeedDetail', { feedId: item.id })}
          onPressComment={openComments}
          onPressDelete={() => handlePressDelete(item.id)}
          onPressReport={() => handlePressReport(item.id)}
          bookmarked={item.bookmarkedByMe}
          onPressBookmark={() => handlePressBookmark(item)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
    paddingTop: 12,
  },
  header: {
    marginBottom: 16,
  },
  separator: {
    marginVertical: 18,
  },
});
