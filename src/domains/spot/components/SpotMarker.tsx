import { StyleSheet, View } from 'react-native';
import { Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { formatQuietness } from '@/shared/utils/formatQuietness';
import { getQuietnessLevel, QUIETNESS_LEVEL_COLORS } from '../constants/quietness';

const BUBBLE_SIZE = 26;
const DOT_SIZE = 24;
const DOT_RING_WIDTH = 4;
const TAIL_WIDTH = 5;
const TAIL_HEIGHT = 6;

interface SpotMarkerProps {
  /** null이면 측정 대상이 아니라는 뜻 — 숫자 없이 점으로 표시한다 */
  quietness: number | null;
}

export default function SpotMarker({ quietness }: SpotMarkerProps) {
  // 0으로 내림돼 "가장 혼잡"처럼 보이면 안 된다 — 등급 판정 전에 갈라낸다
  if (quietness == null) {
    return <View style={styles.dot} />;
  }

  const level = getQuietnessLevel(quietness);
  const { fill } = QUIETNESS_LEVEL_COLORS[level];

  return (
    <View style={styles.container}>
      <View style={[styles.bubble, { backgroundColor: fill }]}>
        <Text typography="st13" weight="semiBold" color={colors.white}>
          {formatQuietness(quietness)}
        </Text>
      </View>
      {/* 꼬리 끝이 실제 좌표를 가리킨다. 묶여 있는 클러스터(원)와 형태로 구분되도록 */}
      <View style={[styles.tail, { borderTopColor: fill }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  bubble: {
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    borderRadius: BUBBLE_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 4 4 0 rgba(0, 0, 0, 0.25)',
  },
  // 측정 대상이 아닌 스팟 — 흰 원에 회색 띠. 숫자 체계와 섞이지 않게 꼬리도 없다
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: colors.white,
    borderWidth: DOT_RING_WIDTH,
    borderColor: colors.greyOpacity[300],
  },
  tail: {
    width: 0,
    height: 0,
    borderLeftWidth: TAIL_WIDTH,
    borderRightWidth: TAIL_WIDTH,
    borderTopWidth: TAIL_HEIGHT,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -1,
  },
});
