import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '@/shared/store/authStore';

import { MainTabs } from '@/shared/navigations/MainTabs';
import {
  OnboardingScreen,
  LoginScreen,
  FeedDetailScreen,
  StoryDetailScreen,
  FeedWriteScreen,
  StoryWriteScreen,
  LanguageSettingScreen,
  MyInfoScreen,
  NotificationSettingScreen,
  NotificationScreen,
  ScrapScreen,
  RecentSpotScreen,
  PopularSpotScreen,
  WeeklyThemeScreen,
  ThemeBrowseScreen,
  ThemeSpotScreen,
  RegionSpotScreen,
  PolicyScreen,
  SpotDetailScreen,
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
        Onboarding: {
          screen: OnboardingScreen,
          options: { gestureEnabled: false },
        },
      },
    },
    // 로그인 상태
    SignedIn: {
      if: useIsSignedIn,
      screens: {
        Main: { screen: MainTabs },
        FeedDetail: { screen: FeedDetailScreen },
        StoryDetail: {
          screen: StoryDetailScreen,
          options: { animation: 'fade', presentation: 'fullScreenModal' },
        },
        FeedWrite: {
          screen: FeedWriteScreen,
          options: { presentation: 'fullScreenModal' },
        },
        StoryWrite: {
          screen: StoryWriteScreen,
          options: { presentation: 'fullScreenModal' },
        },
        LanguageSetting: { screen: LanguageSettingScreen },
        MyInfo: { screen: MyInfoScreen },
        NotificationSetting: { screen: NotificationSettingScreen },
        Notification: { screen: NotificationScreen },
        Scrap: { screen: ScrapScreen },
        RecentSpot: { screen: RecentSpotScreen },
        PopularSpot: { screen: PopularSpotScreen },
        WeeklyTheme: { screen: WeeklyThemeScreen },
        ThemeBrowse: { screen: ThemeBrowseScreen },
        ThemeSpot: { screen: ThemeSpotScreen },
        RegionSpot: { screen: RegionSpotScreen },
        SpotDetail: { screen: SpotDetailScreen },
      },
    },
    // 로그인 여부와 무관한 공통 화면
    Common: {
      screens: {
        Policy: { screen: PolicyScreen },
      },
    },
  },
});

type RootStackType = typeof RootStack;

declare module '@react-navigation/core' {
  interface RootNavigator extends RootStackType {}
}
