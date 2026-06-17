import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '@/shared/constants/colors';

export interface SkeletonProps {
  width?: ViewStyle['width'];
  height?: ViewStyle['height'];
  /**
   * @default 6
   */
  borderRadius?: ViewStyle['borderRadius'];
  style?: StyleProp<ViewStyle>;
}

export default function Skeleton({ width, height, borderRadius = 6, style }: SkeletonProps) {
  return <View style={[styles.base, { width, height, borderRadius }, style]} />;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.grey[200],
  },
});
