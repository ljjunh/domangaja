import { Platform } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import type { SocialProvider } from '../constants/socialProviders';

type SocialAuthStrategy = () => Promise<string | null>;

async function signInWithGoogle(): Promise<string | null> {
  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();
    if (response.type === 'cancelled') {
      return null;
    }
    return response.data.idToken;
  } catch (error) {
    // TODO: 에러 안내(토스트) 붙일 때 처리
    console.warn('구글 로그인 실패', error);
    return null;
  }
}

function isAppleAuthCancelled(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: string }).code === appleAuth.Error.CANCELED
  );
}

// TODO(블로킹): 유료 Apple Developer Program($99/년) 결제 필요.
// 무료 계정은 Sign in with Apple capability를 못 붙여서 error 1000으로 실패
// 결제·승인 후: Xcode > 타겟 domangaja > Signing & Capabilities > + Capability
// > "Sign in with Apple" 추가
async function signInWithApple(): Promise<string | null> {
  if (Platform.OS === 'android') {
    return null;
  }
  try {
    const response = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [], // 이메일·이름을 받지 않음 — 식별은 identityToken의 sub로만
    });
    return response.identityToken;
  } catch (error) {
    if (isAppleAuthCancelled(error)) {
      return null; // 취소는 정상 흐름
    }
    console.warn('애플 로그인 실패', error);
    return null;
  }
}

export const socialAuth: Record<SocialProvider, SocialAuthStrategy> = {
  google: signInWithGoogle,
  apple: signInWithApple,
  kakao: async () => {
    console.log('TODO: 카카오 SDK 연동');
    return '임시로 통과';
  },
};
