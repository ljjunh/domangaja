import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/shared/components/base';

const TYPING_INTERVAL_MS = 30;

interface TypingTitleProps {
  text: string;
  /**
   * 타이핑이 끝났을 때 실행 — 후속 요소 등장 트리거용
   */
  onComplete?: () => void;
}

export default function TypingTitle({ text, onComplete }: TypingTitleProps) {
  const [visibleLength, setVisibleLength] = useState(0);
  const isDone = visibleLength >= text.length;

  useEffect(() => {
    if (isDone) {
      onComplete?.();
    }
  }, [isDone, onComplete]);

  // 글자를 한 자씩 늘리는 타이핑 연출
  useEffect(() => {
    const id = setInterval(() => {
      setVisibleLength(length => {
        if (length >= text.length) {
          clearInterval(id);
          return length;
        }
        return length + 1;
      });
    }, TYPING_INTERVAL_MS);
    return () => clearInterval(id);
  }, [text]);

  return (
    <View>
      {/* 완성 문장을 투명하게 미리 렌더해 최종 크기 확보 — 타이핑·줄바꿈 중 아래 요소가 밀리지 않게 */}
      <Text typography="t1" weight="bold" style={styles.ghost}>
        {text}
      </Text>
      <Text typography="t1" weight="bold" style={styles.typed}>
        {text.slice(0, visibleLength)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  ghost: {
    opacity: 0,
  },
  typed: {
    ...StyleSheet.absoluteFill,
  },
});
