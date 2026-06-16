import { useEffect } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '@/shared/constants/colors';

type Size = 'light' | 'normal' | 'bold';

export interface ProgressBarProps extends ViewProps {
  /**
   * 막대를 얼마나 채울지 (0 ~ 100)
   */
  progress: number;
  size: Size;
  /**
   * 채워지는 색상.
   * @default colors.blue[500]
   */
  color?: string;
  /**
   * @default false
   */
  withAnimation?: boolean;
}

const heightBySize: Record<Size, number> = {
  light: 2,
  normal: 5,
  bold: 8,
};

export default function ProgressBar({
  progress,
  size,
  color = colors.blue[500],
  withAnimation = false,
  style,
  ...rest
}: ProgressBarProps) {
  const height = heightBySize[size];
  const clamped = Math.min(Math.max(progress, 0), 100);
  const value = useSharedValue(clamped);

  useEffect(() => {
    value.value = withAnimation
      ? withTiming(clamped, { duration: 500, easing: Easing.ease })
      : clamped; // 애니메이션 비활성 시 즉시 설정 (불필요한 timing 스케줄 방지)
  }, [clamped, withAnimation, value]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${value.value}%`,
  }));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: progress }}
      style={[
        { height, borderRadius: height, backgroundColor: colors.grey[100], overflow: 'hidden' },
        style,
      ]}
      {...rest}
    >
      <Animated.View
        style={[styles.fill, fillStyle, { backgroundColor: color, borderRadius: height / 2 }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    height: '100%',
  },
});
