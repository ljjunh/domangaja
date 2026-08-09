import { StatusBar, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { type StaticScreenProps, useNavigation } from '@react-navigation/native';
import { colors } from '@/shared/constants/colors';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import {
  StoryMedia,
  StoryProgressBar,
  StoryViewerFooter,
  StoryViewerHeader,
} from '@/domains/feed/components';
import { MOCK_STORIES } from '@/domains/feed/components/StoryList';

type StoryDetailScreenProps = StaticScreenProps<{ storyId: number }>;

// TODO: 자동 재생 붙일 때 실제 진행률로 교체
const TEMP_PROGRESS = 0.35;

export default function StoryDetailScreen({ route }: StoryDetailScreenProps) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { storyId } = route.params;
  const story = MOCK_STORIES.find(item => item.id === storyId) ?? MOCK_STORIES[0];

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
    backgroundColor: colors.grey[900],
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
