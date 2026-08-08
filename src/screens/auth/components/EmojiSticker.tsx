import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  type EntryExitAnimationFunction,
} from 'react-native-reanimated';
import { Text } from '@/shared/components/base';

const ENTER_DURATION_MS = 300;

// 크게 + 반투명하게 나타나서 원래 크기로 줄며 선명해지는 스티커 등장 효과
const stickerEntering: EntryExitAnimationFunction = () => {
  'worklet';
  return {
    initialValues: {
      opacity: 0.3,
      transform: [{ scale: 1.8 }],
    },
    animations: {
      opacity: withTiming(1, { duration: ENTER_DURATION_MS }),
      transform: [{ scale: withTiming(1, { duration: ENTER_DURATION_MS }) }],
    },
  };
};

interface EmojiStickerProps {
  emoji: string;
}

export default function EmojiSticker({ emoji }: EmojiStickerProps) {
  // 등장 효과가 끝난 뒤 좌우로 까딱까딱 무한 반복
  const rotation = useSharedValue(0);
  useEffect(() => {
    rotation.value = withDelay(
      ENTER_DURATION_MS,
      withRepeat(
        withSequence(withTiming(-15, { duration: 150 }), withTiming(20, { duration: 150 })),
        -1,
        true,
      ),
    );
  }, [rotation]);

  const rotationStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    // 등장(scale+opacity)과 흔들기(rotate)가 transform을 두고 충돌하지 않도록 뷰를 분리
    <Animated.View entering={stickerEntering}>
      <Animated.View style={rotationStyle}>
        {/* TODO: 디자인 확정 시 이모지 대신 이미지 에셋으로 교체 */}
        <Text typography="t1" style={styles.emoji}>
          {emoji}
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  emoji: {
    fontSize: 60,
    lineHeight: 72,
  },
});
