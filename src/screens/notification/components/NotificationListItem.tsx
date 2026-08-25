import { type ComponentType } from 'react';
import { StyleSheet, View } from 'react-native';
import { type SvgProps } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import { Pressable, Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { formatTimeAgo } from '@/shared/utils/formatTimeAgo';
import type { NotificationType } from '@/domains/notification/types/api';
import {
  ArchiveTickFillIcon,
  GiftFillIcon,
  HeartFillIcon,
  MessageOutlineIcon,
  NotificationOutlineIcon,
  SunFogFillIcon,
  SunOutlineIcon,
} from '@/assets/icons/common';

const BADGE_SIZE = 40;
const ICON_SIZE = 22;

interface NotificationBadge {
  icon: ComponentType<SvgProps>;
  color: string;
}

// 서버 enum이 늘어나면 앱 배포 전까지 모르는 값이 내려온다 — 그때 쓸 기본 배지
const FALLBACK_BADGE: NotificationBadge = {
  icon: NotificationOutlineIcon,
  color: colors.grey[500],
};

const BADGE_BY_TYPE: Record<NotificationType, NotificationBadge> = {
  FEED_COMMENT: { icon: MessageOutlineIcon, color: colors.blue[500] },
  STORY_LIKE: { icon: HeartFillIcon, color: colors.red[400] },
  COMMENT_LIKE: { icon: HeartFillIcon, color: colors.red[400] },
  FEED_BOOKMARK: { icon: ArchiveTickFillIcon, color: colors.blue[500] },
  QUIETNESS_RISE: { icon: SunOutlineIcon, color: colors.teal[500] },
  // 한적해짐(맑은 해)과 짝이 보이게 흐린 해 + 주의 색
  QUIETNESS_DROP: { icon: SunFogFillIcon, color: colors.orange[500] },
  MARKETING: { icon: GiftFillIcon, color: colors.purple[700] },
};

interface NotificationListItemProps {
  type: NotificationType;
  title: string;
  body?: string;
  createdAt: string;
  isUnread: boolean;
  onPress: () => void;
}

export default function NotificationListItem({
  type,
  title,
  body,
  createdAt,
  isUnread,
  onPress,
}: NotificationListItemProps) {
  const { t } = useTranslation();
  const badge = BADGE_BY_TYPE[type] ?? FALLBACK_BADGE;
  const { icon: Icon, color } = badge;

  const timeAgo = formatTimeAgo(createdAt);

  return (
    <Pressable onPress={onPress} style={[styles.container, isUnread && styles.unreadContainer]}>
      <View style={styles.badge}>
        <Icon width={ICON_SIZE} height={ICON_SIZE} color={color} />
      </View>
      <View style={styles.content}>
        <Text typography="t6" weight="bold">
          {title}
        </Text>
        {body != null && (
          <Text typography="t7" weight="medium" color={colors.grey[500]}>
            {body}
          </Text>
        )}
        {timeAgo != null && (
          <Text typography="t7" weight="medium" color={colors.grey[500]}>
            {t(`notification.timeAgo.${timeAgo.unit}`, { count: timeAgo.value })}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
    paddingVertical: 12,
  },
  unreadContainer: {
    backgroundColor: colors.blue[50],
  },
  badge: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
  },
});
