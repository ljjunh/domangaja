import { useEffect, useRef, type ReactNode } from 'react';
import { BackHandler, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { runOnJS } from 'react-native-worklets';
import { Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnmount: () => void;
  title?: string;
  children: ReactNode;
  /**
   * 백드롭 탭 시 닫기 여부
   * @default true
   */
  dismissOnBackdropPress?: boolean;
}

const ENTER_DURATION = 250;
const EXIT_DURATION = 200;

export default function BaseModal({
  isOpen,
  onClose,
  onUnmount,
  title,
  children,
  dismissOnBackdropPress = true,
}: BaseModalProps) {
  const progress = useSharedValue(0);
  const hasOpenedRef = useRef(false);

  // isOpen 변화에 따라 등장/퇴장 애니메이션
  useEffect(() => {
    if (isOpen) {
      hasOpenedRef.current = true;
      progress.value = withTiming(1, { duration: ENTER_DURATION });
    } else if (hasOpenedRef.current) {
      // 한 번 열렸다가 닫히는 경우만 퇴장 애니메이션 후 unmount
      progress.value = withTiming(0, { duration: EXIT_DURATION }, finished => {
        if (finished) {
          runOnJS(onUnmount)();
        }
      });
    }
  }, [isOpen, onUnmount, progress]);

  // 안드로이드 뒤로가기 → 닫기
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true; // 기본 동작(화면 뒤로) 막음
    });
    return () => subscription.remove();
  }, [onClose]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: interpolate(progress.value, [0, 1], [40, 0]) }],
  }));

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={dismissOnBackdropPress ? onClose : undefined}
        />
      </Animated.View>

      <View style={styles.centerWrap} pointerEvents="box-none">
        <Animated.View style={[styles.card, contentStyle]}>
          {title ? (
            <Text typography="t4" weight="bold" color={colors.grey[900]} textAlign="center">
              {title}
            </Text>
          ) : null}
          {children}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    gap: 12,
  },
});
