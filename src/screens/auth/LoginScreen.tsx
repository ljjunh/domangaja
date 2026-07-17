import { StyleSheet, View } from 'react-native';
import { useAuthStore } from '@/shared/store/authStore';
import { BrandIntro, SocialLoginButton, TermsAgreementNotice } from '@/domains/auth/components';
import { Layout } from '@/shared/components/layout';
import { SCREEN_PADDING_BOTTOM, SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';

export default function LoginScreen() {
  // TODO: 임시 로그인
  const login = useAuthStore(s => s.login);

  return (
    <Layout>
      <View style={styles.container}>
        <BrandIntro />
        <View style={styles.socialLoginButtonsWrapper}>
          <SocialLoginButton provider="kakao" onPress={login} />
          <SocialLoginButton provider="apple" onPress={login} />
          <SocialLoginButton provider="google" onPress={login} />
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
