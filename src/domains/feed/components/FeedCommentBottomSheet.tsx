import { useCallback, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import { useTranslation } from 'react-i18next';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetFooter,
  BottomSheetTextInput,
  type BottomSheetBackdropProps,
  type BottomSheetFooterProps,
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
  const { t } = useTranslation();
  return (
    <View style={styles.empty}>
      <Text typography="st10" weight="semiBold" color={colors.grey[400]}>
        {t('feed.empty.comment')}
      </Text>
    </View>
  );
}

// 처음엔 55% 높이로 열리고, handle을 위로 드래그하면 거의 전체 높이까지 확장된다
const SNAP_POINTS = ['55%', '95%'];

function CommentSeparator() {
  return <View style={styles.separator} />;
}

interface FeedCommentBottomSheetProps {
  feedId: number;
  onClose: () => void;
}

export default function FeedCommentBottomSheet({ feedId, onClose }: FeedCommentBottomSheetProps) {
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();
  const [draft, setDraft] = useState('');
  // 입력창은 footerComponent로 별도 레이어에 떠서, 마지막 댓글이 그 밑에 가려지지 않도록
  // 실제 렌더된 높이를 재서 리스트 하단 padding으로 되돌려준다
  const [footerHeight, setFooterHeight] = useState(0);
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

  const handleFooterLayout = useCallback((event: LayoutChangeEvent) => {
    setFooterHeight(event.nativeEvent.layout.height);
  }, []);

  const handleSend = () => {
    const trimmed = draft.trim();
    if (trimmed.length === 0 || isCreating) {
      return;
    }
    createComment(
      { feedId, content: trimmed },
      {
        onSuccess: () => setDraft(''),
        onError: () => showToast('error', t('feed.error.createComment')),
      },
    );
  };

  // footerComponent는 리스트와 분리된 레이어라 draft/handleSend를 그대로 클로저로 참조해도 안전하다 —
  // useCallback으로 감싸도 매 타이핑마다 다시 만들어져 이점이 없어 일반 함수로 둔다.
  // bottomInset prop 대신 안전영역 패딩을 이 행 자체 높이에 포함시킨다 — 그래야 onLayout으로 잰
  // footerHeight가 실제 차지하는 전체 높이와 정확히 같아져서, 리스트 쪽과 어긋나 틈이 생기지 않는다
  const renderFooter = (footerProps: BottomSheetFooterProps) => (
    <BottomSheetFooter {...footerProps}>
      <View style={[styles.inputRow, { paddingBottom: bottom + 10 }]} onLayout={handleFooterLayout}>
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
      </View>
    </BottomSheetFooter>
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
      index={0}
      snapPoints={SNAP_POINTS}
      enableDynamicSizing={false}
      enablePanDownToClose
      // 시트 크기(55%/95%)는 handle 드래그로만 바뀌고, 콘텐츠 영역은 항상 그 안에서만 스크롤되게 —
      // 댓글이 적거나 없을 때 content 영역 드래그가 시트 크기를 바꿔버리는 걸 막는다
      enableContentPanningGesture={false}
      onClose={onClose}
      backdropComponent={renderBackdrop}
      footerComponent={renderFooter}
      // footer 위치는 "시트 위치 - 키보드 높이"로 계산된다 — interactive는 시트를 키보드 높이만큼
      // 계속 실시간으로 밀어올려서 시트+입력창이 통째로 움직이는 것처럼 느껴진다.
      // extend는 이미 정해둔 두 번째 snap point(95%)로 한 번에 확장만 하고 끝나서 훨씬 안정적으로 보인다
      keyboardBehavior="extend"
      keyboardBlurBehavior="restore"
      handleIndicatorStyle={styles.handleIndicator}
      backgroundStyle={styles.background}
    >
      {/* BottomSheetFlatList가 시트 콘텐츠의 유일한 스크롤 영역 — 입력창은 footerComponent로
          완전히 분리된 레이어라 이 목록의 스크롤/제스처 계산에 끼어들지 않는다(안드로이드 스크롤 이슈 원인) */}
      <BottomSheetFlatList
        data={comments ?? []}
        keyExtractor={item => String(item.id)}
        style={styles.flatList}
        contentContainerStyle={[styles.list, { paddingBottom: 12 + footerHeight }]}
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

      {/* 목록 빈 공간(다른 댓글 줄이 아닌 곳)을 탭해도 메뉴가 닫히도록 */}
      {openCommentId != null && <Pressable style={StyleSheet.absoluteFill} onPress={closeMenu} />}
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
