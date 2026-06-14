import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { MainTabs } from '@/shared/navigations/MainTabs';

import { OnboardingScreen } from '@/screens/auth/OnboardingScreen';
import { LoginScreen } from '@/screens/auth/LoginScreen';
import { FeedDetailScreen } from '@/screens/feed/FeedDetailScreen';

const isSignedIn = () => true;
const isSignedOut = () => false;

export const RootStack = createNativeStackNavigator({
  screenOptions: {
    headerShown: false,
  },
  groups: {
    // 비로그인 상태
    SignedOut: {
      if: isSignedOut,
      screens: {
        Onboarding: { screen: OnboardingScreen },
        Login: { screen: LoginScreen },
      },
    },
    // 로그인 상태
    SignedIn: {
      if: isSignedIn,
      screens: {
        Main: { screen: MainTabs },
        FeedDetail: { screen: FeedDetailScreen },
      },
    },
  },
});

type RootStackType = typeof RootStack;

declare module '@react-navigation/core' {
  interface RootNavigator extends RootStackType {}
}
