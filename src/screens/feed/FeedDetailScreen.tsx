import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { type StaticScreenProps, useNavigation } from '@react-navigation/native';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Layout, StackHeader } from '@/shared/components/layout';
import { colors } from '@/shared/constants/colors';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { toImageUrl } from '@/shared/api/service';
import { overlay } from '@/shared/overlay';
import { showToast } from '@/shared/lib/toast';
import { feedMutations, feedQueries } from '@/domains/feed/api/queries';
import { FeedCommentBottomSheet, FeedItem } from '@/domains/feed/components';
import type { Feed } from '@/domains/feed/types/api';
import { userQueries } from '@/domains/user/api/queries';

// 등록 직후 넘어온 feed는 상세 조회 API를 다시 부르지 않고 그 값을 캐시 초기값으로 써서,
// 목록에서 feedId만 갖고 들어오는 경우와 동일하게 동작하게 한다 (deep link 등으로 feedId만 와도 그대로 조회)
type FeedDetailScreenProps = StaticScreenProps<{ feedId: number } | { feed: Feed }>;

// FeedList와 동일한 방식 — overlay로 기존 댓글 시트를 그대로 띄운다 (아직 mock 데이터)
function openComments(feedId: number) {
  overlay.open(({ unmount }) => <FeedCommentBottomSheet feedId={feedId} onClose={unmount} />);
}

export default function FeedDetailScreen({ route }: FeedDetailScreenProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const params = route.params;
  const feedId = 'feedId' in params ? params.feedId : params.feed.id;
  const initialFeed = 'feed' in params ? params.feed : undefined;

  const { data: feed } = useQuery({
    ...feedQueries.feedDetail(feedId),
    initialData: initialFeed,
    enabled: initialFeed == null,
  });

  // 더보기 메뉴에서 삭제/신고 분기용
  const { data: me } = useQuery(userQueries.getMe());

  const { mutate: deleteFeed, isPending: isDeleting } = useMutation(feedMutations.deleteFeed());
  const { mutate: reportFeed, isPending: isReporting } = useMutation(feedMutations.reportFeed());

  // 삭제·신고 성공 후 처리는 동일하다 — 이 화면을 닫고 목록으로 돌아간다(캐시 정리는 mutation 쪽에서 처리)
  const goBackToList = () => navigation.goBack();

  const handlePressDelete = () => {
    if (isDeleting) {
      return;
    }
    deleteFeed(feedId, {
      onSuccess: goBackToList,
      onError: () => showToast('error', t('feed.error.deleteFeed')),
    });
  };

  const handlePressReport = () => {
    if (isReporting) {
      return;
    }
    reportFeed(feedId, {
      onSuccess: goBackToList,
      onError: () => showToast('error', t('feed.error.report')),
    });
  };

  if (feed == null) {
    return (
      <Layout>
        <StackHeader />
        <View style={styles.center}>
          <ActivityIndicator color={colors.grey[400]} />
        </View>
      </Layout>
    );
  }

  return (
    <Layout>
      <StackHeader />
      <ScrollView contentContainerStyle={styles.container}>
        <FeedItem
          id={feed.id}
          nickname={feed.authorNickname}
          createdAt={feed.createdAt}
          locationLabel={feed.regionName}
          title={feed.title}
          content={feed.content}
          image={{ uri: toImageUrl(feed.imageUrl) ?? feed.imageUrl }}
          placeName={feed.spotName}
          viewCount={feed.viewCount}
          commentCount={feed.commentCount}
          isMine={me != null && me.id === feed.userId}
          onPressComment={openComments}
          onPressDelete={handlePressDelete}
          onPressReport={handlePressReport}
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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
