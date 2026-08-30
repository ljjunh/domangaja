import { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, Platform, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import { useTranslation } from 'react-i18next';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetFooter,
  BottomSheetTextInput,
  KEYBOARD_STATUS,
  useBottomSheetInternal,
  type BottomSheetBackdropProps,
  type BottomSheetFooterProps,
} from '@gorhom/bottom-sheet';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { Defs, LinearGradient, Rect, Stop, Svg } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Pressable, Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { fontFamilyByWeight } from '@/shared/constants/font';
import { typography } from '@/shared/constants/typography';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { showToast } from '@/shared/lib/toast';
import { feedMutations, feedQueries } from '@/domains/feed/api/queries';
import { userQueries } from '@/domains/user/api/queries';
import type { Comment } from '@/domains/feed/types/api';
import { overlay } from '@/shared/overlay';
import FeedCommentItem from './FeedCommentItem';
import { SendOutlineIcon } from '@/assets/icons/common';

let isCommentSheetOpen = false;

export function openFeedCommentBottomSheet(feedId: number) {
  if (isCommentSheetOpen) {
    return;
  }
  isCommentSheetOpen = true;
  overlay.open(({ unmount }) => (
    <FeedCommentBottomSheet
      feedId={feedId}
      onClose={() => {
        isCommentSheetOpen = false;
        unmount();
      }}
    />
  ));
}

const TOP_FADE_HEIGHT = 28;
const TOP_FADE_GRADIENT_ID = 'feed-comment-top-fade';

function TopFadeOverlay() {
  return (
    <View style={styles.topFade} pointerEvents="none">
      <Svg width="100%" height="100%">
        <Defs>
          <LinearGradient id={TOP_FADE_GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.white} stopOpacity={1} />
            <Stop offset="1" stopColor={colors.white} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${TOP_FADE_GRADIENT_ID})`} />
      </Svg>
    </View>
  );
}

function CommentEmptyState() {
  const { t } = useTranslation();
  return (
    <View style={styles.empty}>
      <Text typography="st10" weight="semiBold" color={colors.grey[400]}>
        {t('feed.empty.comment')}
      </Text>
    </View>
  );
}

const SNAP_POINTS = ['65%'];
const ANDROID_KEYBOARD_INPUT_MODE =
  typeof Platform.Version === 'number' && Platform.Version >= 35 ? 'adjustPan' : 'adjustResize';

function CommentSeparator() {
  return <View style={styles.separator} />;
}

interface FeedCommentInputProps {
  bottom: number;
  isSending: boolean;
  onLayout: (event: LayoutChangeEvent) => void;
  onSend: (text: string) => void;
}

// draft를 이 컴포넌트 안에 두어야 타이핑 중 부모(FeedCommentBottomSheet)가 리렌더되지 않는다 —
// 부모가 리렌더되면 renderFooter가 다시 만들어져 footerComponent가 재마운트되고 키보드가 닫힌다
function FeedCommentInput({ bottom, isSending, onLayout, onSend }: FeedCommentInputProps) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState('');
  const { animatedKeyboardState } = useBottomSheetInternal();
  const keyboardAwarePadding = useAnimatedStyle(() => ({
    paddingBottom: animatedKeyboardState.get().status === KEYBOARD_STATUS.SHOWN ? 10 : bottom + 10,
  }));

  const handleSend = () => {
    const trimmed = draft.trim();
    if (trimmed.length === 0 || isSending) {
      return;
    }
    onSend(trimmed);
    setDraft('');
  };

  return (
    <Animated.View style={[styles.inputRow, keyboardAwarePadding]} onLayout={onLayout}>
      <BottomSheetTextInput
        value={draft}
        onChangeText={setDraft}
        placeholder={t('feed.comment.placeholder')}
        placeholderTextColor={colors.grey[500]}
        style={styles.input}
      />
      <Pressable hitSlop={8} onPress={handleSend}>
        <SendOutlineIcon color={colors.blue[500]} />
      </Pressable>
    </Animated.View>
  );
}

interface FeedCommentBottomSheetProps {
  feedId: number;
  onClose: () => void;
}

export default function FeedCommentBottomSheet({ feedId, onClose }: FeedCommentBottomSheetProps) {
  const { t } = useTranslation();
  const { top, bottom } = useSafeAreaInsets();
  // 입력창은 footerComponent로 별도 레이어에 떠서, 마지막 댓글이 그 밑에 가려지지 않도록
  // 실제 렌더된 높이를 재서 리스트 하단 padding으로 되돌려준다
  const [footerHeight, setFooterHeight] = useState(0);
  // 댓글마다 각자 열림 상태를 들고 있으면 다른 댓글을 열어도 이전 메뉴가 안 닫힌다 —
  // 목록이 "지금 열려 있는 댓글 id" 하나만 들고 통제한다
  const [openCommentId, setOpenCommentId] = useState<number | null>(null);
  const closeMenu = () => setOpenCommentId(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(function closeOnAndroidBackPress() {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      bottomSheetRef.current?.close();
      return true;
    });
    return () => subscription.remove();
  }, []);

  const { data: comments } = useQuery(feedQueries.comments(feedId));
  const { data: me } = useQuery(userQueries.getMe());

  const { mutate: createComment, isPending: isCreating } = useMutation(
    feedMutations.createComment(),
  );
  const { mutate: deleteComment, isPending: isDeleting } = useMutation(
    feedMutations.deleteComment(),
  );
  const { mutate: reportComment, isPending: isReporting } = useMutation(
    feedMutations.reportComment(),
  );
  const { mutate: likeComment, isPending: isLiking } = useMutation(feedMutations.likeComment());
  const { mutate: unlikeComment, isPending: isUnliking } = useMutation(
    feedMutations.unlikeComment(),
  );

  const renderBackdrop = useCallback(
    (backdropProps: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...backdropProps} appearsOnIndex={0} disappearsOnIndex={-1} />
    ),
    [],
  );

  const handleFooterLayout = useCallback((event: LayoutChangeEvent) => {
    setFooterHeight(event.nativeEvent.layout.height);
  }, []);

  const handleSend = useCallback(
    (text: string) => {
      createComment(
        { feedId, content: text },
        { onError: () => showToast('error', t('feed.error.createComment')) },
      );
    },
    [feedId, createComment, t],
  );

  // renderFooter가 매 렌더마다 새 함수면 BottomSheet가 footerComponent를 다른 컴포넌트로 보고
  // 통째로 재마운트해버려 입력 중이던 TextInput이 포커스(키보드)를 잃는다 —
  // draft state를 FeedCommentInput 안으로 내려서 타이핑 중엔 이 함수가 재생성되지 않게 한다.
  // bottomInset prop 대신 안전영역 패딩을 이 행 자체 높이에 포함시킨다 — 그래야 onLayout으로 잰
  // footerHeight가 실제 차지하는 전체 높이와 정확히 같아져서, 리스트 쪽과 어긋나 틈이 생기지 않는다
  const renderFooter = useCallback(
    (footerProps: BottomSheetFooterProps) => (
      <BottomSheetFooter {...footerProps}>
        <FeedCommentInput
          bottom={bottom}
          isSending={isCreating}
          onLayout={handleFooterLayout}
          onSend={handleSend}
        />
      </BottomSheetFooter>
    ),
    [bottom, isCreating, handleFooterLayout, handleSend],
  );

  const handlePressDelete = (commentId: number) => {
    // 삭제/신고가 진행 중일 때 다른 댓글을 눌러도 중복 요청하지 않는다
    if (isDeleting) {
      return;
    }
    deleteComment(
      { feedId, commentId },
      { onError: () => showToast('error', t('feed.error.deleteComment')) },
    );
  };

  const handlePressReport = (commentId: number) => {
    if (isReporting) {
      return;
    }
    reportComment(
      { feedId, commentId },
      { onError: () => showToast('error', t('feed.error.report')) },
    );
  };

  const handlePressLike = (comment: Comment) => {
    if (isLiking || isUnliking) {
      return;
    }
    if (comment.likedByMe) {
      unlikeComment(
        { feedId, commentId: comment.id },
        {
          onError: () => showToast('error', t('feed.error.unlike')),
        },
      );
    } else {
      likeComment(
        { feedId, commentId: comment.id },
        { onError: () => showToast('error', t('feed.error.like')) },
      );
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={SNAP_POINTS}
      enableDynamicSizing={false}
      enablePanDownToClose
      topInset={top}
      onClose={onClose}
      backdropComponent={renderBackdrop}
      footerComponent={renderFooter}
      keyboardBehavior="fillParent"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode={ANDROID_KEYBOARD_INPUT_MODE}
      handleIndicatorStyle={styles.handleIndicator}
      backgroundStyle={styles.background}
    >
      <BottomSheetFlatList
        data={comments ?? []}
        keyExtractor={item => String(item.id)}
        style={styles.flatList}
        contentContainerStyle={[styles.list, { paddingBottom: 12 + footerHeight }]}
        ItemSeparatorComponent={CommentSeparator}
        ListEmptyComponent={comments != null ? CommentEmptyState : null}
        renderItem={({ item, index }) => (
          <FeedCommentItem
            comment={item}
            isMine={me != null && me.id === item.userId}
            isLast={(comments?.length ?? 0) > 1 && index === (comments?.length ?? 0) - 1}
            onPressDelete={() => handlePressDelete(item.id)}
            onPressReport={() => handlePressReport(item.id)}
            onPressLike={() => handlePressLike(item)}
            isMenuOpen={openCommentId === item.id}
            onLongPress={() => setOpenCommentId(item.id)}
            onRequestClose={closeMenu}
          />
        )}
      />
      <TopFadeOverlay />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  handleIndicator: {
    backgroundColor: colors.grey[300],
    width: 36,
  },
  background: {
    borderRadius: 40,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 12,
  },
  flatList: {
    flex: 1,
  },
  topFade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: TOP_FADE_HEIGHT,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: 'hidden',
  },
  list: {
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
    paddingTop: 20,
  },
  separator: {
    height: 18,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
    paddingTop: 10,
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.grey[100],
  },
  input: {
    flex: 1,
    backgroundColor: colors.grey[100],
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: typography.st10.fontSize,
    fontFamily: fontFamilyByWeight.regular,
    color: colors.black,
  },
});
