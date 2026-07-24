import { StyleSheet, View } from 'react-native';
import { Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { getQuietnessLevel, QUIETNESS_LEVEL_COLORS } from '../constants/quietness';

interface SpotMarkerProps {
  quietness: number;
}

export default function SpotMarker({ quietness }: SpotMarkerProps) {
  const level = getQuietnessLevel(quietness);

  return (
    <View style={[styles.bubble, { backgroundColor: QUIETNESS_LEVEL_COLORS[level] }]}>
      <Text typography="st13" weight="semiBold" color={colors.white}>
        {quietness}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 4 4 0 rgba(0, 0, 0, 0.25)',
  },
});
