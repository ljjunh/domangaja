import { Trans } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';

export default function TermsAgreementNotice() {
  const { navigate } = useNavigation();

  return (
    <Text typography="st12" weight="regular" color={colors.grey[500]} textAlign="center">
      <Trans
        i18nKey="login.by_tapping_continue"
        components={{
          terms: (
            <Text
              typography="st12"
              color={colors.grey[500]}
              onPress={() => navigate('Policy', { type: 'terms' })}
              style={styles.link}
            />
          ),
          privacy: (
            <Text
              typography="st12"
              color={colors.grey[500]}
              onPress={() => navigate('Policy', { type: 'privacy' })}
              style={styles.link}
            />
          ),
        }}
      />
    </Text>
  );
}

const styles = StyleSheet.create({
  link: { textDecorationLine: 'underline' },
});
