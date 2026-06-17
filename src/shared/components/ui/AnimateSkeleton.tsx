import { useEffect, type ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Defs, LinearGradient, Rect, Stop, Svg } from 'react-native-svg';
import { colors } from '@/shared/constants/colors';

export interface AnimateSkeletonProps {
  children: ReactNode;
  /**
   * 단위 ms. 500으로 지정 시 스켈레톤을 잠시 미노출하여 화면전환 깜빡임을 최소화
   */
  delay: 0 | 500;
  withGradient: boolean;
  withShimmer: boolean;
}

const GRADIENT_ID = 'animate-skeleton-gradient';

function GradientOverlay() {
  const background = colors.white;
  return (
    <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
      <Defs>
        <LinearGradient id={GRADIENT_ID} gradientTransform="rotate(90)">
          <Stop offset="5%" stopColor={background} stopOpacity={0} />
          <Stop offset="95%" stopColor={background} stopOpacity={1} />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${GRADIENT_ID})`} />
    </Svg>
  );
}

export default function AnimateSkeleton({
  children,
  delay,
  withGradient,
  withShimmer,
}: AnimateSkeletonProps) {
  // 컨테이너 fade-in: delay 500이면 0에서 시작해 delay 후 노출
  const containerOpacity = useSharedValue(delay === 500 ? 0 : 1);
  // shimmer 펄스: 0.2 ↔ 1 반복
  const shimmerOpacity = useSharedValue(withShimmer ? 0.2 : 1);

  useEffect(() => {
    containerOpacity.value = withDelay(delay, withTiming(1, { duration: 100 }));
    if (withShimmer) {
      shimmerOpacity.value = withDelay(
        delay,
        withRepeat(
          withSequence(withTiming(1, { duration: 650 }), withTiming(0.2, { duration: 650 })),
          -1,
        ),
      );
    }
  }, [delay, withShimmer, containerOpacity, shimmerOpacity]);

  const containerStyle = useAnimatedStyle(() => ({ opacity: containerOpacity.value }));
  const shimmerStyle = useAnimatedStyle(() => ({ opacity: shimmerOpacity.value }));

  return (
    <Animated.View style={containerStyle}>
      <Animated.View style={shimmerStyle}>{children}</Animated.View>
      {withGradient ? <GradientOverlay /> : null}
    </Animated.View>
  );
}
