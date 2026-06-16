import { StyleSheet, View } from 'react-native';
import { useAuthStore } from '@/shared/store/authStore';
import { BrandIntro, SocialLoginButton, TermsAgreementNotice } from '@/domains/auth/components';
import { Layout } from '@/shared/components/layout';
export default function LoginScreen() {
  const login = useAuthStore(s => s.login);

  return (
    <Layout padded>
      <BrandIntro />
      <View style={styles.socialLoginButtonsWrapper}>
        <SocialLoginButton provider="kakao" onPress={login} />
        <SocialLoginButton provider="apple" onPress={login} />
        <SocialLoginButton provider="google" onPress={login} />
      </View>
      <TermsAgreementNotice />
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  socialLoginButtonsWrapper: {
    paddingBottom: 16,
    gap: 12,
  },
});
