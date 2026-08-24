import { useState } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { type StaticScreenProps, useNavigation } from '@react-navigation/native';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Pressable } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { toImageUrl } from '@/shared/api/service';
import { showToast } from '@/shared/lib/toast';
import {
  StoryMedia,
  StoryProgressBar,
  StoryViewerFooter,
  StoryViewerHeader,
} from '@/domains/feed/components';
import { feedMutations, feedQueries } from '@/domains/feed/api/queries';
import type { Story } from '@/domains/feed/types/api';
import { userQueries } from '@/domains/user/api/queries';

type StoryDetailScreenProps = StaticScreenProps<{ storyId: number } | { story: Story }>;

// TODO: 자동 재생 붙일 때 실제 진행률로 교체
const TEMP_PROGRESS = 0.35;

export default function StoryDetailScreen({ route }: StoryDetailScreenProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const params = route.params;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const storyId = 'storyId' in params ? params.storyId : params.story.id;
  const initialStory = 'story' in params ? params.story : undefined;
  const { data: story } = useQuery({
    ...feedQueries.storyDetail(storyId),
    initialData: initialStory,
    enabled: initialStory == null,
  });

  const { data: me } = useQuery(userQueries.getMe());
  const isMine = me != null && story != null && me.id === story.userId;

  const { mutate: deleteStory, isPending: isDeleting } = useMutation(feedMutations.deleteStory());
  const { mutate: reportStory, isPending: isReporting } = useMutation(feedMutations.reportStory());
  const { mutate: likeStory, isPending: isLiking } = useMutation(feedMutations.likeStory());
  const { mutate: unlikeStory, isPending: isUnliking } = useMutation(feedMutations.unlikeStory());

  const handlePressMore = () => setIsMenuOpen(prev => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  const goBackToList = () => navigation.goBack();

  const handlePressDelete = () => {
    closeMenu();
    if (isDeleting || story == null) {
      return;
    }
    deleteStory(story.id, {
      onSuccess: goBackToList,
      onError: () => showToast('error', t('feed.error.deleteStory')),
    });
  };

  const handlePressReport = () => {
    closeMenu();
    if (isReporting || story == null) {
      return;
    }
    reportStory(story.id, {
      onSuccess: goBackToList,
      onError: () => showToast('error', t('feed.error.report')),
    });
  };

  const handlePressLike = () => {
    if (isLiking || isUnliking || story == null) {
      return;
    }
    if (story.likedByMe) {
      unlikeStory(story.id, {
        onError: () => showToast('error', t('feed.error.unlike')),
      });
    } else {
      likeStory(story.id, {
        onError: () => showToast('error', t('feed.error.like')),
      });
    }
  };

  if (story == null) {
    return (
      <View style={[styles.root, styles.center]}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator color={colors.white} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <StoryMedia image={{ uri: toImageUrl(story.imageUrl) ?? story.imageUrl }} />

      {isMenuOpen && <Pressable style={StyleSheet.absoluteFill} onPress={closeMenu} />}

      <View style={[styles.topOverlay, { paddingTop: insets.top + 10 }]}>
        <StoryProgressBar progress={TEMP_PROGRESS} />
        <StoryViewerHeader
          nickname={story.authorNickname}
          locationLabel={story.regionName}
          isMine={isMine}
          isMenuOpen={isMenuOpen}
          onPressMore={handlePressMore}
          onPressDelete={handlePressDelete}
          onPressReport={handlePressReport}
          onClose={() => navigation.goBack()}
        />
      </View>

      <View style={[styles.bottomOverlay, { paddingBottom: insets.bottom + 16 }]}>
        <StoryViewerFooter
          viewCount={story.viewCount}
          liked={story.likedByMe}
          onPressLike={handlePressLike}
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
  center: {
    alignItems: 'center',
    justifyContent: 'center',
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
