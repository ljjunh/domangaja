import { StyleSheet, View } from 'react-native';
import { Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';

// 묶인 개수가 많을수록 크게 — 한눈에 밀집도가 보이게
const SIZE_BY_COUNT = [
  { min: 100, size: 58 },
  { min: 20, size: 50 },
  { min: 0, size: 42 },
];

// 안쪽 원의 비율. 바깥 halo와 두 겹으로 겹쳐 테두리가 번진 느낌을 낸다
const CORE_RATIO = 0.68;

const HALO_COLOR = 'rgba(69, 147, 252, 0.16)';
const CORE_COLOR = 'rgba(69, 147, 252, 0.34)';

interface ClusterMarkerProps {
  count: number;
}

export default function ClusterMarker({ count }: ClusterMarkerProps) {
  const size = SIZE_BY_COUNT.find(({ min }) => count >= min)!.size;
  const coreSize = Math.round(size * CORE_RATIO);

  return (
    <View style={[styles.halo, { width: size, height: size, borderRadius: size / 2 }]}>
      <View
        style={[styles.core, { width: coreSize, height: coreSize, borderRadius: coreSize / 2 }]}
      />
      <Text typography="t7" weight="bold" color={colors.blue[800]}>
        {count}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  halo: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: HALO_COLOR,
  },
  // absolute라 부모의 정렬을 그대로 따라 가운데에 깔린다
  core: {
    position: 'absolute',
    backgroundColor: CORE_COLOR,
  },
});
