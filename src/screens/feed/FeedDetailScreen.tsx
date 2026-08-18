import { ScrollView, StyleSheet } from 'react-native';
import { type StaticScreenProps } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Layout, StackHeader } from '@/shared/components/layout';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { toImageUrl } from '@/shared/api/service';
import { overlay } from '@/shared/overlay';
import { formatTimeAgo } from '@/shared/utils/formatTimeAgo';
import { FeedCommentBottomSheet, FeedItem } from '@/domains/feed/components';
import type { Feed } from '@/domains/feed/types/api';

// 피드 상세/목록 조회 API가 아직 없어 등록 직후 응답만 받는다 —
// 상세 조회 API 연동 시 StoryDetailScreen처럼 { feedId } 케이스를 추가해 확장
type FeedDetailScreenProps = StaticScreenProps<{ feed: Feed }>;

// FeedList와 동일한 방식 — overlay로 기존 댓글 시트를 그대로 띄운다 (아직 mock 데이터)
function openComments(feedId: number) {
  overlay.open(({ unmount }) => <FeedCommentBottomSheet feedId={feedId} onClose={unmount} />);
}

export default function FeedDetailScreen({ route }: FeedDetailScreenProps) {
  const { t } = useTranslation();
  const { feed } = route.params;
  const timeAgo = formatTimeAgo(feed.createdAt);

  return (
    <Layout>
      <StackHeader />
      <ScrollView contentContainerStyle={styles.container}>
        <FeedItem
          id={feed.id}
          nickname={feed.authorNickname}
          timeAgo={
            timeAgo == null
              ? ''
              : t(`notification.timeAgo.${timeAgo.unit}`, { count: timeAgo.value })
          }
          locationLabel={feed.regionName}
          title={feed.title}
          content={feed.content}
          image={{ uri: toImageUrl(feed.imageUrl) ?? feed.imageUrl }}
          placeName={feed.spotName}
          viewCount={feed.viewCount}
          commentCount={feed.commentCount}
          onPressComment={openComments}
        />
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
    paddingTop: 16,
    paddingBottom: 24,
  },
});
