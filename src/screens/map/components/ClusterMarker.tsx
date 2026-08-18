import { StyleSheet, View } from 'react-native';
import { Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';

// 묶인 개수가 많을수록 크게 — 한눈에 밀집도가 보이게
const SIZE_BY_COUNT = [
  { min: 100, size: 46 },
  { min: 20, size: 40 },
  { min: 0, size: 34 },
];

interface ClusterMarkerProps {
  count: number;
}

export default function ClusterMarker({ count }: ClusterMarkerProps) {
  const size = SIZE_BY_COUNT.find(({ min }) => count >= min)!.size;

  return (
    <View style={[styles.bubble, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text typography="st13" weight="bold" color={colors.white}>
        {count}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.blue[500],
    borderWidth: 2,
    borderColor: colors.white,
    boxShadow: '0 4 4 0 rgba(0, 0, 0, 0.25)',
  },
});
