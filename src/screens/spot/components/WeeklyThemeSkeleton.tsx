import { StyleSheet, View } from 'react-native';
import { AnimateSkeleton, Skeleton } from '@/shared/components/ui';

const HEADER_HEIGHT = 19.5;
const ROW_COUNT = 4;

export default function WeeklyThemeSkeleton() {
  return (
    <AnimateSkeleton delay={500} withGradient={false} withShimmer={true}>
      <View style={styles.container}>
        <Skeleton width={100} height={HEADER_HEIGHT} />
        {Array.from({ length: ROW_COUNT }, (_, index) => (
          <View key={index} style={styles.row}>
            <Skeleton style={styles.card} borderRadius={12} />
            <Skeleton style={styles.card} borderRadius={12} />
          </View>
        ))}
      </View>
    </AnimateSkeleton>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
    aspectRatio: 1,
  },
});
