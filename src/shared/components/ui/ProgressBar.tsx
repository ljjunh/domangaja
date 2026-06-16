import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, type ViewProps } from 'react-native';
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
  const animated = useRef(new Animated.Value(progress)).current;

  useEffect(() => {
    Animated.timing(animated, {
      toValue: progress,
      duration: withAnimation ? 500 : 0,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  }, [progress, withAnimation, animated]);

  const width = animated.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

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
        style={[styles.fill, { width, backgroundColor: color, borderRadius: height / 2 }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    height: '100%',
  },
});
