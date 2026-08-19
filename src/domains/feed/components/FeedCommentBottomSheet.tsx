import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetTextInput,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
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
import FeedCommentItem from './FeedCommentItem';
import { SendOutlineIcon } from '@/assets/icons/common';

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
  return (
    <View style={styles.empty}>
      <Text typography="st10" weight="semiBold" color={colors.grey[400]}>
        아직 작성된 댓글이 없어요.
      </Text>
    </View>
  );
}

const SNAP_POINTS = ['60%'];

function CommentSeparator() {
  return <View style={styles.separator} />;
}

interface FeedCommentBottomSheetProps {
  feedId: number;
  onClose: () => void;
}

export default function FeedCommentBottomSheet({ feedId, onClose }: FeedCommentBottomSheetProps) {
  const { bottom } = useSafeAreaInsets();
  const [draft, setDraft] = useState('');
  // 댓글마다 각자 열림 상태를 들고 있으면 다른 댓글을 열어도 이전 메뉴가 안 닫힌다 —
  // 목록이 "지금 열려 있는 댓글 id" 하나만 들고 통제한다
  const [openCommentId, setOpenCommentId] = useState<number | null>(null);
  const closeMenu = () => setOpenCommentId(null);

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

  const handleSend = () => {
    const trimmed = draft.trim();
    if (trimmed.length === 0 || isCreating) {
      return;
    }
    createComment(
      { feedId, content: trimmed },
      {
        onSuccess: () => setDraft(''),
        onError: () => showToast('error', '댓글 등록에 실패했어요. 잠시 후 다시 시도해주세요.'),
      },
    );
  };

  const handlePressDelete = (commentId: number) => {
    // 삭제/신고가 진행 중일 때 다른 댓글을 눌러도 중복 요청하지 않는다
    if (isDeleting) {
      return;
    }
    deleteComment(
      { feedId, commentId },
      { onError: () => showToast('error', '댓글 삭제에 실패했어요. 잠시 후 다시 시도해주세요.') },
    );
  };

  const handlePressReport = (commentId: number) => {
    if (isReporting) {
      return;
    }
    reportComment(
      { feedId, commentId },
      { onError: () => showToast('error', '신고에 실패했어요. 잠시 후 다시 시도해주세요.') },
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
          onError: () => showToast('error', '좋아요 취소에 실패했어요. 잠시 후 다시 시도해주세요.'),
        },
      );
    } else {
      likeComment(
        { feedId, commentId: comment.id },
        { onError: () => showToast('error', '좋아요에 실패했어요. 잠시 후 다시 시도해주세요.') },
      );
    }
  };

  return (
    <BottomSheet
      index={0}
      snapPoints={SNAP_POINTS}
      enableDynamicSizing={false}
      enablePanDownToClose
      onClose={onClose}
      backdropComponent={renderBackdrop}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      handleIndicatorStyle={styles.handleIndicator}
      backgroundStyle={styles.background}
    >
      <View style={styles.listArea}>
        <BottomSheetFlatList
          data={comments ?? []}
          keyExtractor={item => String(item.id)}
          style={styles.flatList}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={CommentSeparator}
          ListEmptyComponent={comments != null ? CommentEmptyState : null}
          renderItem={({ item }) => (
            <FeedCommentItem
              comment={item}
              isMine={me != null && me.id === item.userId}
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

        {/* 목록 빈 공간(다른 댓글 줄이 아닌 곳)을 탭해도 메뉴가 닫히도록 — 입력창 영역은 덮지 않는다 */}
        {openCommentId != null && <Pressable style={StyleSheet.absoluteFill} onPress={closeMenu} />}
      </View>

      <View style={[styles.inputRow, { paddingBottom: bottom + 10 }]}>
        <BottomSheetTextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="댓글을 입력해주세요..."
          placeholderTextColor={colors.grey[500]}
          style={styles.input}
        />
        <Pressable hitSlop={8} onPress={handleSend}>
          <SendOutlineIcon color={colors.blue[500]} />
        </Pressable>
      </View>
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
  listArea: {
    flex: 1,
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
    paddingBottom: 12,
    flexGrow: 1,
  },
  separator: {
    height: 18,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
    paddingTop: 10,
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
  sendIcon: {
    borderColor: colors.blue[500],
  },
});
