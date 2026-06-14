import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { HomeScreen, MapScreen, FeedScreen, SettingScreen } from '@/screens';
import CustomTabBar from '@/shared/navigations/CustomTabBar';

export const MainTabs = createBottomTabNavigator({
  screenOptions: {
    headerShown: false,
  },
  tabBar: props => <CustomTabBar {...props} />,
  screens: {
    Home: {
      screen: HomeScreen,
    },
    Map: {
      screen: MapScreen,
    },
    Feed: {
      screen: FeedScreen,
    },
    Setting: {
      screen: SettingScreen,
    },
  },
});
