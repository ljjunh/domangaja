import { Platform } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { login } from '@react-native-seoul/kakao-login';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { type SocialProvider } from '@/domains/auth/constants/socialProviders';

// 취소(사용자 의도)와 실패(안내 필요)를 구분해
export type SocialAuthResult =
  | { status: 'success'; token: string }
  | { status: 'cancelled' }
  | { status: 'failed' };

type SocialAuthStrategy = () => Promise<SocialAuthResult>;

async function signInWithGoogle(): Promise<SocialAuthResult> {
  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();
    if (response.type === 'cancelled') {
      return { status: 'cancelled' };
    }
    if (!response.data.idToken) {
      return { status: 'failed' };
    }
    return { status: 'success', token: response.data.idToken };
  } catch (error) {
    console.warn('구글 로그인 실패', error);
    return { status: 'failed' };
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
async function signInWithApple(): Promise<SocialAuthResult> {
  if (Platform.OS === 'android') {
    return { status: 'cancelled' }; // Android는 애플 버튼 미노출 — 도달하지 않는 경로
  }
  try {
    const response = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [], // 이메일·이름을 받지 않음 — 식별은 identityToken의 sub로만
    });
    if (!response.identityToken) {
      return { status: 'failed' };
    }
    return { status: 'success', token: response.identityToken };
  } catch (error) {
    if (isAppleAuthCancelled(error)) {
      return { status: 'cancelled' };
    }
    console.warn('애플 로그인 실패', error);
    return { status: 'failed' };
  }
}

function isKakaoCancelled(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) {
    return false;
  }
  const { code, message } = error as { code?: string; message?: string };
  return code === 'E_CANCELLED_OPERATION' || /cancel/i.test(message ?? '');
}

async function signInWithKakao(): Promise<SocialAuthResult> {
  try {
    const token = await login(); // 카카오톡 앱이 있으면 앱 전환, 없으면 계정 로그인
    return { status: 'success', token: token.accessToken };
  } catch (error) {
    if (isKakaoCancelled(error)) {
      return { status: 'cancelled' };
    }
    console.warn('카카오 로그인 실패', error);
    return { status: 'failed' };
  }
}

export const socialAuth: Record<SocialProvider, SocialAuthStrategy> = {
  google: signInWithGoogle,
  apple: signInWithApple,
  kakao: signInWithKakao,
};
