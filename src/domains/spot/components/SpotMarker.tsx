import { StyleSheet, View } from 'react-native';
import { Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { formatQuietness } from '@/shared/utils/formatQuietness';
import { getQuietnessLevel, QUIETNESS_LEVEL_COLORS } from '../constants/quietness';

const BUBBLE_SIZE = 26;
const UNMEASURED_BORDER_WIDTH = 3;
// 반투명(greyOpacity)을 쓰면 원 테두리는 흰 배경 위, 꼬리는 지도 위에 얹혀
// 같은 값인데도 다른 색으로 보인다 — 불투명 회색으로 고정한다
const UNMEASURED_COLOR = colors.grey[400];
const TAIL_WIDTH = 5;
const TAIL_HEIGHT = 6;

interface SpotMarkerProps {
  /** null이면 측정 대상이 아니라는 뜻 — 숫자 없이 빈 핀으로 표시한다 */
  quietness: number | null;
}

export default function SpotMarker({ quietness }: SpotMarkerProps) {
  // 0으로 내림돼 "가장 혼잡"처럼 보이면 안 된다 — 등급 판정 전에 갈라낸다
  if (quietness == null) {
    return (
      <View style={styles.container}>
        <View style={[styles.bubble, styles.unmeasuredBubble]} />
        <View style={[styles.tail, styles.unmeasuredTail]} />
      </View>
    );
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
  // 측정 대상이 아닌 스팟 — 크기·꼬리는 색깔 핀과 동일하고 안쪽만 흰색
  unmeasuredBubble: {
    backgroundColor: colors.white,
    borderWidth: UNMEASURED_BORDER_WIDTH,
    borderColor: UNMEASURED_COLOR,
  },
  // 테두리와 이어져 하나의 핀으로 읽히게 같은 색
  unmeasuredTail: {
    borderTopColor: UNMEASURED_COLOR,
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
