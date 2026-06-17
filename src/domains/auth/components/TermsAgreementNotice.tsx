import { Trans } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';

interface TermsAgreementNoticeProps {
  onPressTerms?: () => void;
  onPressPrivacy?: () => void;
}

export default function TermsAgreementNotice({
  onPressTerms,
  onPressPrivacy,
}: TermsAgreementNoticeProps) {
  return (
    <Text typography="st12" weight="regular" color={colors.grey[500]} textAlign="center">
      <Trans
        i18nKey="login.by_tapping_continue"
        components={{
          terms: (
            <Text typography="st12" color={colors.grey[500]} onPress={onPressTerms} style={styles.link} />
          ),
          privacy: (
            <Text
              typography="st12"
              color={colors.grey[500]}
              onPress={onPressPrivacy}
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
