import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { HomeScreen } from '../../screens/home/HomeScreen';
import { MapScreen } from '../../screens/map/MapScreen';
import { FeedScreen } from '../../screens/feed/FeedScreen';
import { SettingScreen } from '../../screens/setting/SettingScreen';

export const MainTabs = createBottomTabNavigator({
  screenOptions: {
    headerShown: false,
  },
  screens: {
    Home: {
      screen: HomeScreen,
      options: { title: '홈' },
    },
    Map: {
      screen: MapScreen,
      options: { title: '지도' },
    },
    Feed: {
      screen: FeedScreen,
      options: { title: '피드' },
    },
    Setting: {
      screen: SettingScreen,
      options: { title: '설정' },
    },
  },
});
