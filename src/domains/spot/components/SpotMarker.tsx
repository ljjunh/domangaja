import { StyleSheet, View } from 'react-native';
import { Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { formatQuietness } from '@/shared/utils/formatQuietness';
import { getQuietnessLevel, QUIETNESS_LEVEL_COLORS } from '../constants/quietness';

const BUBBLE_SIZE = 26;
const TAIL_WIDTH = 5;
const TAIL_HEIGHT = 6;

interface SpotMarkerProps {
  quietness: number;
}

export default function SpotMarker({ quietness }: SpotMarkerProps) {
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
