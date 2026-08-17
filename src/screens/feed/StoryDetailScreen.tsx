import { StatusBar, StyleSheet, View, type ImageSourcePropType } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { type StaticScreenProps, useNavigation } from '@react-navigation/native';
import { colors } from '@/shared/constants/colors';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { toImageUrl } from '@/shared/api/service';
import {
  StoryMedia,
  StoryProgressBar,
  StoryViewerFooter,
  StoryViewerHeader,
} from '@/domains/feed/components';
import { MOCK_STORIES, type StoryPost } from '@/domains/feed/components/StoryList';
import type { CreateStoryResponse } from '@/domains/feed/types/api';

// 등록 직후에는 서버 응답(story)을 그대로 받고, 목록에서 진입할 때는 storyId만 받는다 —
// storyId 케이스는 아직 상세 조회 API가 없어 MOCK_STORIES에서 찾아 대신 쓴다 (TODO: 상세 조회 API 연동 시 교체)
type StoryDetailScreenProps = StaticScreenProps<
  { storyId: number } | { story: CreateStoryResponse }
>;

interface StoryDetailData {
  nickname: string;
  locationLabel: string;
  image: ImageSourcePropType;
  viewCount: number;
}

function toStoryDetailData(story: StoryPost | CreateStoryResponse): StoryDetailData {
  if ('locationLabel' in story) {
    return {
      nickname: story.nickname,
      locationLabel: story.locationLabel,
      image: story.image,
      viewCount: story.viewCount,
    };
  }
  return {
    nickname: story.authorNickname,
    locationLabel: story.regionName,
    image: { uri: toImageUrl(story.imageUrl) ?? story.imageUrl },
    viewCount: story.viewCount,
  };
}

// TODO: 자동 재생 붙일 때 실제 진행률로 교체
const TEMP_PROGRESS = 0.35;

export default function StoryDetailScreen({ route }: StoryDetailScreenProps) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const params = route.params;
  const rawStory =
    'story' in params
      ? params.story
      : MOCK_STORIES.find(item => item.id === params.storyId) ?? MOCK_STORIES[0];
  const story = toStoryDetailData(rawStory);

  return (
    // 미디어를 노치/상태바 뒤까지 완전히 채우기 위해 SafeAreaView(Layout) 대신 일반 View를 쓰고,
    // 오버레이(헤더/푸터) 쪽에서 직접 insets를 더해 안전영역을 피한다.
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <StoryMedia image={story.image} />

      <View style={[styles.topOverlay, { paddingTop: insets.top + 10 }]}>
        <StoryProgressBar progress={TEMP_PROGRESS} />
        <StoryViewerHeader
          nickname={story.nickname}
          locationLabel={story.locationLabel}
          onClose={() => navigation.goBack()}
        />
      </View>

      <View style={[styles.bottomOverlay, { paddingBottom: insets.bottom + 16 }]}>
        <StoryViewerFooter
          viewCount={story.viewCount}
          onPressLike={() => console.log('TODO: 스토리 좋아요 연동')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.black,
  },
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
    gap: 12,
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
  },
});
