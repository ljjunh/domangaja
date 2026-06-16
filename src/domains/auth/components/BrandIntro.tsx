import { StyleSheet, View } from 'react-native';
import { Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';

export default function BrandIntro() {
  return (
    <View style={styles.container}>
      <View style={styles.logo} />
      <View style={styles.textGroup}>
        <Text typography="t1" weight="bold">
          도망가자
        </Text>
        <Text typography="t7" weight="semiBold">
          붐비는 곳을 피해, 지금 가장 한적한 여행지로.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20 },
  logo: {
    width: 82,
    height: 82,
    backgroundColor: colors.blue[500],
    borderRadius: 12,
  },
  textGroup: {
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
