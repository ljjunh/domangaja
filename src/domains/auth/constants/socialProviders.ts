import type { SvgProps } from 'react-native-svg';
import { KakaoIcon, AppleIcon, GoogleIcon } from '@/assets/icons/logo';

export type SocialProvider = 'kakao' | 'apple' | 'google';

interface SocialProviderConfig {
  label: string;
  Icon: React.FC<SvgProps>;
  backgroundColor: string;
  textColor: string;
}

export const SOCIAL_PROVIDERS: Record<SocialProvider, SocialProviderConfig> = {
  kakao: {
    label: '카카오로 계속하기',
    Icon: KakaoIcon,
    backgroundColor: '#FEE500',
    textColor: '#000000',
  },
  apple: {
    label: '애플로 계속하기',
    Icon: AppleIcon,
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
  },
  google: {
    label: '구글로 계속하기',
    Icon: GoogleIcon,
    backgroundColor: '#E7E7E7',
    textColor: '#000000',
  },
};
