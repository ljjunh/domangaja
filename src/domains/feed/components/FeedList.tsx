import { FlatList, StyleSheet, View, type ImageSourcePropType } from 'react-native';
import { Border } from '@/shared/components/ui';
import { overlay } from '@/shared/overlay';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { example1Image, example2Image } from '@/assets/images';
import FeedBanner from './FeedBanner';
import FeedCommentBottomSheet from './FeedCommentBottomSheet';
import FeedItem from './FeedItem';

interface FeedPost {
  id: number;
  nickname: string;
  timeAgo: string;
  locationLabel: string;
  title: string;
  content: string;
  image: ImageSourcePropType;
  placeName: string;
  viewCount: number;
  commentCount: number;
}

const MOCK_FEED_POSTS: FeedPost[] = [
  {
    id: 1,
    nickname: 'axx_xx',
    timeAgo: '23시간 전',
    locationLabel: '강원 속초 부근',
    title: '아침 일찍 다녀온 속초 바다',
    content: '사람이 거의 없어서 너무 좋았어요.\n파도 소리 들으면서 힐링하고 왔네요',
    image: example1Image,
    placeName: '속초 외웅치 해변',
    viewCount: 124,
    commentCount: 12,
  },
  {
    id: 2,
    nickname: 'axx_xx',
    timeAgo: '23시간 전',
    locationLabel: '강원 속초 부근',
    title: '아침 일찍 다녀온 속초 바다',
    content: '사람이 거의 없어서 너무 좋았어요.\n파도 소리 들으면서 힐링하고 왔네요',
    image: example2Image,
    placeName: '속초 외웅치 해변',
    viewCount: 124,
    commentCount: 12,
  },
];

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
  return (
    <FlatList
      data={MOCK_FEED_POSTS}
      keyExtractor={item => String(item.id)}
      contentContainerStyle={styles.list}
      ListHeaderComponent={<FeedBanner />}
      ListHeaderComponentStyle={styles.header}
      ItemSeparatorComponent={FeedItemSeparator}
      ListFooterComponent={<View style={{ height: bottomInset }} />}
      renderItem={({ item }) => (
        <FeedItem
          id={item.id}
          nickname={item.nickname}
          timeAgo={item.timeAgo}
          locationLabel={item.locationLabel}
          title={item.title}
          content={item.content}
          image={item.image}
          placeName={item.placeName}
          viewCount={item.viewCount}
          commentCount={item.commentCount}
          onPressComment={openComments}
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
