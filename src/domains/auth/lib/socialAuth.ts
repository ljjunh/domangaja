import { GoogleSignin } from '@react-native-google-signin/google-signin';
import type { SocialProvider } from '../constants/socialProviders';

type SocialAuthStrategy = () => Promise<string | null>;

async function signInWithGoogle(): Promise<string | null> {
  await GoogleSignin.hasPlayServices();
  const response = await GoogleSignin.signIn();
  if (response.type === 'cancelled') {
    return null;
  }
  return response.data.idToken;
}

export const socialAuth: Record<SocialProvider, SocialAuthStrategy> = {
  google: signInWithGoogle,
  kakao: async () => {
    console.log('TODO: 카카오 SDK 연동');
    return '임시로 통과';
  },
  apple: async () => {
    console.log('TODO: 애플 SDK 연동');
    return '임시로 통과';
  },
};
