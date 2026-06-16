import { StyleSheet, View, Text } from 'react-native';

export default function BrandIntro() {
  return (
    <View style={styles.container}>
      <View style={styles.logo} />
      <View style={styles.textGroup}>
        <Text style={styles.title}>도망가자</Text>
        <Text style={styles.subtitle}>붐비는 곳을 피해, 지금 가장 한적한 여행지로.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20 },
  logo: {
    width: 82,
    height: 82,
    backgroundColor: 'blue',
    borderRadius: 12,
  },
  textGroup: {
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    lineHeight: 40,
    fontFamily: 'Pretendard-Bold',
    color: '000000',
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19.5,
    fontFamily: 'Pretendard-SemiBold',
    color: '000000',
  },
});
