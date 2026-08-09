import { StyleSheet, View } from 'react-native';
import { Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';

export default function StoryHeader() {
  return (
    <View style={styles.container}>
      <Text typography="t4" weight="bold" color={colors.grey[900]}>
        지금 한적한 곳을 찾고 있나요?
      </Text>
      <View style={styles.statusRow}>
        <View style={styles.dot} />
        <Text typography="st12" weight="semiBold" color={colors.grey[500]}>
          지금 이 순간, 한적한 장소들
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.green[500],
  },
});
