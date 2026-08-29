import { useState } from 'react';
import { StyleSheet, View, type ImageSourcePropType } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import {
  ArchiveTickFillIcon,
  ArchiveTickOutlineIcon,
  MoreOutlineIcon,
  LocationFillIcon,
} from '@/assets/icons/common';
import { formatTimeAgo } from '@/shared/utils/formatTimeAgo';

interface FeedItemProps {
  id: number;
  nickname: string;
  createdAt: string;
  locationLabel: string;
  title: string;
  // 목록에서는 1줄로 자르고(...), 상세에서는 안 넘겨서 전체를 보여준다
  titleNumberOfLines?: number;
  content: string;
  // 목록에서는 2줄로 자르고(...), 상세에서는 안 넘겨서 전체를 보여준다
  contentNumberOfLines?: number;
  // 서버 연동 시 imageUrl(string)을 { uri: imageUrl }로 매핑
  image: ImageSourcePropType;
  placeName: string;
  viewCount: number;
  commentCount: number;
  // 더보기 메뉴 분기(삭제 vs 신고)에 필요 — 목록/상세 모두 호출부가 로그인 사용자와 비교해서 넘겨준다
  isMine: boolean;
  onPress?: () => void;
  onPressComment: (feedId: number) => void;
  // 실제 삭제/신고 요청은 호출부(목록/상세)가 각자의 성공 후 동작(목록 갱신 vs 화면 닫기)에 맞게 처리한다
  onPressDelete: () => void;
  onPressReport: () => void;
  // 1차 스토어 심사 전 임시로 숨김 처리 — "저장한 피드 모아보기" 화면(서버 API 포함)이 아직 없어서,
  // props를 안 넘기면 버튼 자체가 안 보인다. 목록/상세용 API 준비되면 다시 넘겨주면 됨
  bookmarked?: boolean;
  onPressBookmark?: () => void;
}

export default function FeedItem({
  id,
  nickname,
  createdAt,
  locationLabel,
  title,
  titleNumberOfLines,
  content,
  contentNumberOfLines,
  image,
  placeName,
  viewCount,
  commentCount,
  isMine,
  onPress,
  onPressComment,
  onPressDelete,
  onPressReport,
  bookmarked,
  onPressBookmark,
}: FeedItemProps) {
  const { t } = useTranslation();
  const timeAgo = formatTimeAgo(createdAt);
  const timeAgoLabel =
    timeAgo == null ? '' : t(`notification.timeAgo.${timeAgo.unit}`, { count: timeAgo.value });

  // 목록에서는 카드마다, 상세에서는 하나뿐이라 화면에 상태를 올리지 않고 카드 자신이 들고 있는다
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  const handlePressDelete = () => {
    closeMenu();
    onPressDelete();
  };

  const handlePressReport = () => {
    closeMenu();
    onPressReport();
  };

  return (
    <Pressable onPress={onPress} style={styles.container}>
      {/* 메뉴가 열려 있을 때 카드 안 다른 곳을 탭하면 닫는다 — 더보기/댓글 등 안쪽 Pressable이 우선 처리된다 */}
      {isMenuOpen && <Pressable style={StyleSheet.absoluteFill} onPress={closeMenu} />}

      <View style={styles.header}>
        <View style={styles.profile}>
          <View style={styles.avatar} />
          <View>
            <Text typography="st11" weight="bold" color={colors.grey[900]}>
              {nickname}
            </Text>
            <Text typography="st13" weight="semiBold" color={colors.grey[500]}>
              {locationLabel}
            </Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Text typography="st13" weight="regular" color={colors.grey[400]}>
            {timeAgoLabel}
          </Text>
          <View style={styles.moreWrapper}>
            <Pressable hitSlop={8} onPress={() => setIsMenuOpen(prev => !prev)}>
              <MoreOutlineIcon color={colors.grey[500]} />
            </Pressable>

            {isMenuOpen && (
              <View style={styles.menu}>
                {isMine ? (
                  <Pressable onPress={handlePressDelete} style={styles.menuItem}>
                    <Text typography="t7" weight="semiBold" color={colors.red[500]}>
                      {t('feed.action.deleteFeed')}
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
        </View>
      </View>

      <Text
        typography="t6"
        weight="bold"
        color={colors.grey[900]}
        numberOfLines={titleNumberOfLines}
        ellipsizeMode="tail"
      >
        {title}
      </Text>
      <Text
        typography="st11"
        weight="regular"
        color={colors.grey[700]}
        numberOfLines={contentNumberOfLines}
        ellipsizeMode="tail"
      >
        {content}
      </Text>

      <Image source={image} style={styles.image} />

      <View style={styles.placeRow}>
        <LocationFillIcon color={colors.grey[200]} />
        <Text typography="st13" weight="semiBold" color={colors.grey[700]}>
          {placeName}
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statsTextRow}>
          <Text typography="st13" weight="semiBold" color={colors.grey[500]}>
            {t('feed.item.viewCount', { count: viewCount })} ·{' '}
          </Text>
          <Pressable hitSlop={4} onPress={() => onPressComment(id)}>
            <Text typography="st13" weight="semiBold" color={colors.grey[500]}>
              {t('feed.item.commentCount', { count: commentCount })}
            </Text>
          </Pressable>
        </View>
        {onPressBookmark != null && (
          <Pressable hitSlop={8} onPress={onPressBookmark}>
            {bookmarked ? (
              <ArchiveTickFillIcon width={20} height={20} color={colors.blue[500]} />
            ) : (
              <ArchiveTickOutlineIcon width={20} height={20} color={colors.grey[500]} />
            )}
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.grey[200],
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  moreWrapper: {
    position: 'relative',
  },
  menu: {
    position: 'absolute',
    top: '100%',
    right: 0,
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
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  image: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 12,
  },
  placeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
