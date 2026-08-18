import { ScrollView, StyleSheet, View } from 'react-native';
import { Layout, StackHeader } from '@/shared/components/layout';
import { AnimateSkeleton, Skeleton } from '@/shared/components/ui';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';

export default function SpotDetailSkeleton() {
  return (
    <Layout edges={['top']}>
      <StackHeader />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <AnimateSkeleton delay={500} withGradient={false} withShimmer={true}>
          <Skeleton height={260} borderRadius={12} style={styles.hero} />
          <View style={styles.content}>
            <View style={styles.titleSection}>
              <Skeleton width={180} height={30} />
              <Skeleton width={220} height={20} />
            </View>
            <Skeleton height={72} borderRadius={12} />
            <Skeleton height={96} borderRadius={12} />
            <Skeleton height={40} borderRadius={12} />
          </View>
        </AnimateSkeleton>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 40 },
  hero: { marginHorizontal: SCREEN_PADDING_HORIZONTAL },
  content: { paddingHorizontal: SCREEN_PADDING_HORIZONTAL, paddingTop: 20, gap: 16 },
  titleSection: { gap: 7 },
});
