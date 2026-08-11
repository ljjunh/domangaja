import { StyleSheet, View } from 'react-native';
import { AnimateSkeleton, Skeleton } from '@/shared/components/ui';

const PROFILE_IMAGE_SIZE = 100;
// t5 lineHeight(25.5) + paddingVertical 10*2 + borderBottomWidth 1.5
const NICKNAME_INPUT_HEIGHT = 47;
// Button size="medium"의 minHeight
const SUBMIT_BUTTON_HEIGHT = 38;
// t7 lineHeight
const RULE_TEXT_HEIGHT = 19.5;

// MyInfoForm과 같은 골격 — 데이터가 도착해도 레이아웃이 튀지 않게 높이를 맞춘다
export default function MyInfoSkeleton() {
  return (
    <AnimateSkeleton delay={500} withGradient={false} withShimmer={true}>
      <View style={styles.container}>
        <Skeleton
          width={PROFILE_IMAGE_SIZE}
          height={PROFILE_IMAGE_SIZE}
          borderRadius={PROFILE_IMAGE_SIZE / 2}
          style={styles.profileImage}
        />
        <Skeleton height={NICKNAME_INPUT_HEIGHT} />
        <View style={styles.buttonGap}>
          <Skeleton height={SUBMIT_BUTTON_HEIGHT} borderRadius={10} />
          <Skeleton width={180} height={RULE_TEXT_HEIGHT} />
        </View>
      </View>
    </AnimateSkeleton>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 15,
  },
  profileImage: {
    alignSelf: 'center',
  },
  buttonGap: {
    gap: 5,
  },
});
