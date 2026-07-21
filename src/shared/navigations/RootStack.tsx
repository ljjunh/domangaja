import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '@/shared/store/authStore';

import { MainTabs } from '@/shared/navigations/MainTabs';
import {
  OnboardingScreen,
  LoginScreen,
  FeedDetailScreen,
  LanguageSettingScreen,
  MyInfoScreen,
  NotificationSettingScreen,
  SavedSpotScreen,
} from '@/screens';

const useIsSignedIn = () => useAuthStore(state => state.isLogin);
const useIsSignedOut = () => !useAuthStore(state => state.isLogin);

export const RootStack = createNativeStackNavigator({
  screenOptions: {
    headerShown: false,
  },
  groups: {
    // 비로그인 상태
    SignedOut: {
      if: useIsSignedOut,
      screens: {
        Login: { screen: LoginScreen },
        Onboarding: { screen: OnboardingScreen },
      },
    },
    // 로그인 상태
    SignedIn: {
      if: useIsSignedIn,
      screens: {
        Main: { screen: MainTabs },
        FeedDetail: { screen: FeedDetailScreen },
        LanguageSetting: { screen: LanguageSettingScreen },
        MyInfo: { screen: MyInfoScreen },
        NotificationSetting: { screen: NotificationSettingScreen },
        SavedSpot: { screen: SavedSpotScreen },
      },
    },
  },
});

type RootStackType = typeof RootStack;

declare module '@react-navigation/core' {
  interface RootNavigator extends RootStackType {}
}
