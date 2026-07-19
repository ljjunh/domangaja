import { type Ref } from 'react';
import {
  StyleSheet,
  Pressable as RNPressable,
  type PressableProps as RNPressableProps,
  type StyleProp,
  type ViewStyle,
  type View,
} from 'react-native';

export interface PressableProps extends Omit<RNPressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  ref?: Ref<View>;
}

export default function Pressable({ style, ref, ...rest }: PressableProps) {
  return (
    <RNPressable ref={ref} style={({ pressed }) => [style, pressed && styles.pressed]} {...rest} />
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.8,
  },
});
