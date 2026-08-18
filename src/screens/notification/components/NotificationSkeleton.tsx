import { StyleSheet, View } from 'react-native';
import { AnimateSkeleton, Skeleton } from '@/shared/components/ui';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';

const BADGE_SIZE = 40;
const TITLE_HEIGHT = 22.5;
const META_HEIGHT = 19.5;
const ITEM_COUNT = 6;

export default function NotificationSkeleton() {
  return (
    <AnimateSkeleton delay={500} withGradient={false} withShimmer={true}>
      <View style={styles.container}>
        <Skeleton width={100} height={META_HEIGHT} style={styles.sectionHeader} />
        {Array.from({ length: ITEM_COUNT }, (_, index) => (
          <View key={index} style={styles.item}>
            <Skeleton width={BADGE_SIZE} height={BADGE_SIZE} borderRadius={12} />
            <View style={styles.content}>
              <Skeleton height={TITLE_HEIGHT} />
              <Skeleton width={80} height={META_HEIGHT} />
            </View>
          </View>
        ))}
      </View>
    </AnimateSkeleton>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
  },
  sectionHeader: {
    marginTop: 12,
    marginBottom: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 12,
  },
  content: {
    flex: 1,
    gap: 2,
  },
});
