import { StyleSheet, View, type ImageSourcePropType } from 'react-native';
import { Image, Pressable, Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { ArchiveTickOutlineIcon, MoreOutlineIcon, LocationFillIcon } from '@/assets/icons/common';

interface FeedItemProps {
  nickname: string;
  timeAgo: string;
  locationLabel: string;
  title: string;
  content: string;
  // 서버 연동 시 imageUrl(string)을 { uri: imageUrl }로 매핑
  image: ImageSourcePropType;
  placeName: string;
  viewCount: number;
  commentCount: number;
}

export default function FeedItem({
  nickname,
  timeAgo,
  locationLabel,
  title,
  content,
  image,
  placeName,
  viewCount,
  commentCount,
}: FeedItemProps) {
  return (
    <Pressable
      onPress={() => console.log('TODO: 피드 상세 페이지로 이동')}
      style={styles.container}
    >
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
            {timeAgo}
          </Text>
          <Pressable hitSlop={8} onPress={() => console.log('TODO: 게시글 더보기 메뉴')}>
            <MoreOutlineIcon color={colors.grey[500]} />
          </Pressable>
        </View>
      </View>

      <Text typography="t6" weight="bold" color={colors.grey[900]}>
        {title}
      </Text>
      <Text typography="st11" weight="regular" color={colors.grey[700]}>
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
        <Text typography="st13" weight="semiBold" color={colors.grey[500]}>
          조회 {viewCount} · 댓글 {commentCount}
        </Text>
        <Pressable hitSlop={8} onPress={() => console.log('TODO: 피드 저장 연동')}>
          <ArchiveTickOutlineIcon color={colors.grey[500]} />
        </Pressable>
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
});
