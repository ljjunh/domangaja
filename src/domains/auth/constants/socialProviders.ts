import type { SvgProps } from 'react-native-svg';
import { KakaoIcon, AppleIcon, GoogleIcon } from '@/assets/icons/logo';
import { colors } from '@/shared/constants/colors';

export type SocialProvider = 'kakao' | 'apple' | 'google';

interface SocialProviderConfig {
  Icon: React.FC<SvgProps>;
  backgroundColor: string;
  textColor: string;
}

export const SOCIAL_PROVIDERS: Record<SocialProvider, SocialProviderConfig> = {
  kakao: {
    Icon: KakaoIcon,
    backgroundColor: colors.kakao,
    textColor: colors.black,
  },
  apple: {
    Icon: AppleIcon,
    backgroundColor: colors.black,
    textColor: colors.white,
  },
  google: {
    Icon: GoogleIcon,
    backgroundColor: colors.grey[100],
    textColor: colors.black,
  },
};
