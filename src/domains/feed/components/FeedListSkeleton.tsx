import { StyleSheet, View } from 'react-native';
import { AnimateSkeleton, Skeleton } from '@/shared/components/ui';
import { colors } from '@/shared/constants/colors';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';

const FEED_ITEM_COUNT = 3;

function FeedItemSkeleton() {
  return (
    <View style={styles.item}>
      <View style={styles.header}>
        <View style={styles.avatar} />
        <View style={styles.profileText}>
          <Skeleton width={80} height={16.5} />
          <Skeleton width={60} height={14.5} />
        </View>
      </View>

      <Skeleton width="60%" height={19.5} />
      <Skeleton width="100%" height={16.5} />
      <Skeleton width="80%" height={16.5} />

      <Skeleton style={styles.image} borderRadius={12} />

      <Skeleton width={100} height={16.5} />
    </View>
  );
}

export default function FeedListSkeleton() {
  return (
    <AnimateSkeleton delay={0} withGradient={false} withShimmer={true}>
      <View style={styles.container}>
        <Skeleton style={styles.banner} borderRadius={16} />

        {Array.from({ length: FEED_ITEM_COUNT }, (_, index) => (
          <FeedItemSkeleton key={index} />
        ))}
      </View>
    </AnimateSkeleton>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
    paddingTop: 12,
    gap: 24,
  },
  banner: {
    width: '100%',
    height: 72,
  },
  item: {
    gap: 10,
  },
  header: {
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
  profileText: {
    gap: 4,
  },
  image: {
    width: '100%',
    aspectRatio: 4 / 3,
  },
});
