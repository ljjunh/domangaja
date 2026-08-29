import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { HeartFillIcon, HeartOutlineIcon } from '@/assets/icons/common';
import { formatTimeAgo } from '@/shared/utils/formatTimeAgo';
import type { Comment } from '@/domains/feed/types/api';

interface FeedCommentItemProps {
  comment: Comment;
  // 삭제/신고 메뉴 분기용 — 호출부가 로그인 사용자와 비교해서 넘겨준다
  isMine: boolean;
  // 마지막 댓글이면 메뉴를 아래가 아니라 위로 띄운다 — 아래로 띄우면 하단 입력창(footer)에 가려진다
  isLast: boolean;
  onPressDelete: () => void;
  onPressReport: () => void;
  onPressLike: () => void;
  // 메뉴는 목록(부모)이 "어느 댓글이 열려 있는지" 하나만 들고 있는다 —
  // 그래야 다른 댓글을 길게 눌렀을 때 기존 메뉴가 자동으로 닫힌다
  isMenuOpen: boolean;
  onLongPress: () => void;
  onRequestClose: () => void;
}

export default function FeedCommentItem({
  comment,
  isMine,
  isLast,
  onPressDelete,
  onPressReport,
  onPressLike,
  isMenuOpen,
  onLongPress,
  onRequestClose,
}: FeedCommentItemProps) {
  const { t } = useTranslation();
  const timeAgo = formatTimeAgo(comment.createdAt);
  const timeAgoLabel =
    timeAgo == null ? '' : t(`notification.timeAgo.${timeAgo.unit}`, { count: timeAgo.value });

  const handlePressDelete = () => {
    onRequestClose();
    onPressDelete();
  };

  const handlePressReport = () => {
    onRequestClose();
    onPressReport();
  };

  return (
    <View style={styles.container}>
      {/* 이 댓글의 메뉴가 열려 있을 때, 이 행 안에서 메뉴 바깥을 탭하면 닫는다 */}
      {isMenuOpen && <Pressable style={StyleSheet.absoluteFill} onPress={onRequestClose} />}

      <View style={styles.avatar} />
      <View style={styles.bodyWrapper}>
        {/* 다른 댓글의 메뉴가 열려 있을 때 이 댓글을 탭하면(길게 누르지 않아도) 그 메뉴를 닫는다 —
            일반 탭 자체에는 별다른 동작이 없어 기존 UX를 방해하지 않는다 */}
        <Pressable onPress={onRequestClose} onLongPress={onLongPress} style={styles.body}>
          <View style={styles.nicknameRow}>
            <Text typography="st11" weight="bold" color={colors.grey[900]}>
              {comment.authorNickname}
            </Text>
            <Text typography="st13" weight="semiBold" color={colors.grey[400]}>
              {timeAgoLabel}
            </Text>
          </View>
          <Text typography="st10" weight="regular" color={colors.grey[800]}>
            {comment.content}
          </Text>
        </Pressable>

        {isMenuOpen && (
          <View style={[styles.menu, isLast && styles.menuUpward]}>
            {isMine ? (
              <Pressable onPress={handlePressDelete} style={styles.menuItem}>
                <Text typography="t7" weight="semiBold" color={colors.red[500]}>
                  {t('feed.action.deleteComment')}
                </Text>
              </Pressable>
            ) : (
              <Pressable onPress={handlePressReport} style={styles.menuItem}>
                <Text typography="t7" weight="semiBold" color={colors.red[500]}>
                  {t('feed.action.report')}
                </Text>
              </Pressable>
            )}
          </View>
        )}
      </View>

      <Pressable hitSlop={8} onPress={onPressLike} style={styles.like}>
        {comment.likedByMe ? (
          <HeartFillIcon width={18} height={18} color={colors.red[500]} />
        ) : (
          <HeartOutlineIcon width={18} height={18} color={colors.grey[400]} />
        )}
        <Text typography="st13" weight="semiBold" color={colors.grey[500]}>
          {comment.likeCount}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.grey[200],
  },
  bodyWrapper: {
    flex: 1,
    position: 'relative',
  },
  body: {
    gap: 4,
  },
  nicknameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  menu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    marginTop: 8,
    minWidth: 120,
    borderRadius: 14,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 100,
  },
  menuUpward: {
    top: undefined,
    bottom: '100%',
    marginTop: 0,
    marginBottom: 8,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  like: {
    alignItems: 'center',
    gap: 2,
  },
});
