import { Platform, StyleSheet, View } from 'react-native';
import { Layout } from '@/shared/components/layout';
import { SCREEN_PADDING_BOTTOM, SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { BrandIntro, SocialLoginButton, TermsAgreementNotice } from '@/domains/auth/components';
import { useSocialLogin } from '@/domains/auth/hooks/useSocialLogin';

export default function LoginScreen() {
  const { signIn, loadingProvider } = useSocialLogin();

  return (
    <Layout>
      <View style={styles.container}>
        <BrandIntro />
        <View style={styles.socialLoginButtonsWrapper}>
          <SocialLoginButton
            provider="kakao"
            onPress={() => signIn('kakao')}
            loading={loadingProvider === 'kakao'}
            disabled={loadingProvider !== null && loadingProvider !== 'kakao'}
          />
          {Platform.OS === 'ios' && (
            <SocialLoginButton
              provider="apple"
              onPress={() => signIn('apple')}
              loading={loadingProvider === 'apple'}
              disabled={loadingProvider !== null && loadingProvider !== 'apple'}
            />
          )}
          <SocialLoginButton
            provider="google"
            onPress={() => signIn('google')}
            loading={loadingProvider === 'google'}
            disabled={loadingProvider !== null && loadingProvider !== 'google'}
          />
        </View>
        <TermsAgreementNotice />
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
    paddingBottom: SCREEN_PADDING_BOTTOM,
  },
  socialLoginButtonsWrapper: {
    paddingBottom: 16,
    gap: 12,
  },
});
