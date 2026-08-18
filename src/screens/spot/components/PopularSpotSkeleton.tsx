import { StyleSheet, View } from 'react-native';
import { AnimateSkeleton, Skeleton } from '@/shared/components/ui';

const IMAGE_SIZE = 70;
const NAME_HEIGHT = 19.5;
const REGION_HEIGHT = 16.5;
const ITEM_COUNT = 6;

export default function PopularSpotSkeleton() {
  return (
    <AnimateSkeleton delay={500} withGradient={false} withShimmer={true}>
      <View style={styles.list}>
        {Array.from({ length: ITEM_COUNT }, (_, index) => (
          <View key={index} style={styles.item}>
            <Skeleton width={IMAGE_SIZE} height={IMAGE_SIZE} borderRadius={12} />
            <View style={styles.info}>
              <Skeleton width={140} height={NAME_HEIGHT} />
              <Skeleton width={100} height={REGION_HEIGHT} />
            </View>
          </View>
        ))}
      </View>
    </AnimateSkeleton>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  info: {
    gap: 4,
  },
});
