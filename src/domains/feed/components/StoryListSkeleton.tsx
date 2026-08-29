import { StyleSheet, View } from 'react-native';
import { AnimateSkeleton, Skeleton } from '@/shared/components/ui';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';

const CARD_ASPECT_RATIO = 160 / 240;
const STORY_ROW_COUNT = 3;

export default function StoryListSkeleton() {
  return (
    <AnimateSkeleton delay={0} withGradient={false} withShimmer={true}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Skeleton width={140} height={22.5} />
          <Skeleton width={100} height={16.5} />
        </View>

        {Array.from({ length: STORY_ROW_COUNT }, (_, index) => (
          <View key={index} style={styles.row}>
            <Skeleton style={styles.card} borderRadius={14} />
            <Skeleton style={styles.card} borderRadius={14} />
          </View>
        ))}
      </View>
    </AnimateSkeleton>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
    paddingTop: 16,
    gap: 12,
  },
  headerRow: {
    gap: 8,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
    aspectRatio: CARD_ASPECT_RATIO,
  },
});
