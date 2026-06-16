import { StyleSheet, Text } from 'react-native';

export default function TermsAgreementNotice() {
  const handleTermsPress = () => {};
  const handlePrivacyPress = () => {};

  return (
    <Text style={styles.text}>
      시작하면{' '}
      <Text style={styles.link} onPress={handleTermsPress}>
        이용약관
      </Text>
      과{' '}
      <Text style={styles.link} onPress={handlePrivacyPress}>
        개인정보처리방침
      </Text>
      에 동의하게 됩니다.
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    lineHeight: 18,
    color: '#71717B',
    textAlign: 'center',
  },
  link: { textDecorationLine: 'underline' },
});
