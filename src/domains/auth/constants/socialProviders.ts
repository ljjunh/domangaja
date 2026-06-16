import type { SvgProps } from 'react-native-svg';
import { KakaoIcon, AppleIcon, GoogleIcon } from '@/assets/icons/logo';
import { colors } from '@/shared/constants/colors';

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
    backgroundColor: colors.kakao,
    textColor: colors.black,
  },
  apple: {
    label: '애플로 계속하기',
    Icon: AppleIcon,
    backgroundColor: colors.black,
    textColor: colors.white,
  },
  google: {
    label: '구글로 계속하기',
    Icon: GoogleIcon,
    backgroundColor: colors.grey[100],
    textColor: colors.black,
  },
};
