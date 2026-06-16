import { StyleSheet } from 'react-native';
import { Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';

export default function TermsAgreementNotice() {
  const handleTermsPress = () => {};
  const handlePrivacyPress = () => {};

  return (
    <Text typography="st12" weight="regular" color={colors.grey[500]} textAlign="center">
      시작하면{' '}
      <Text
        typography="st12"
        weight="regular"
        color={colors.grey[500]}
        onPress={handleTermsPress}
        style={styles.link}
      >
        이용약관
      </Text>
      과{' '}
      <Text
        typography="st12"
        weight="regular"
        color={colors.grey[500]}
        onPress={handlePrivacyPress}
        style={styles.link}
      >
        개인정보처리방침
      </Text>
      에 동의하게 됩니다.
    </Text>
  );
}

const styles = StyleSheet.create({
  link: { textDecorationLine: 'underline' },
});
