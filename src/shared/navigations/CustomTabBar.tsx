import { useEffect, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/shared/components/base';
import type { SvgProps } from 'react-native-svg';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { HomeIcon, MapIcon, FeedIcon, SettingIcon } from '@/assets/icons/nav';
import { IS_ANDROID } from '@/shared/constants/platform';
import { colors } from '@/shared/constants/colors';
import { MAIN_TAB_BAR_HEIGHT, MAIN_TAB_BAR_BOTTOM_GAP } from '@/shared/constants/layout';

const TAB_ICONS: Record<string, ComponentType<SvgProps>> = {
  Home: HomeIcon,
  Map: MapIcon,
  Feed: FeedIcon,
  Setting: SettingIcon,
};

const BAR_PADDING = 5;

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();
  const tabCount = state.routes.length;
  const activeIndex = state.index;

  const tabIndex = useSharedValue(state.index);

  useEffect(() => {
    tabIndex.value = withSpring(activeIndex, {
      stiffness: 400,
      mass: 0.3,
    });
  }, [activeIndex, tabIndex]);

  const indicatorStyle = useAnimatedStyle(() => ({
    // translateX의 %는 자기 자신의 폭 기준 → 100% = 탭 한 칸
    transform: [{ translateX: `${tabIndex.value * 100}%` }],
  }));

  return (
    <View
      style={[
        styles.wrapper,
        { paddingBottom: IS_ANDROID ? bottom + MAIN_TAB_BAR_BOTTOM_GAP : bottom },
      ]}
    >
      <View style={styles.bar}>
        <Animated.View
          style={[styles.indicator, { width: `${100 / tabCount}%` }, indicatorStyle]}
        />

        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const Icon = TAB_ICONS[route.name];
          const label = t(`tab.${route.name.toLowerCase()}`);
          const color = isFocused ? colors.black : colors.grey[500];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable key={route.key} onPress={onPress} style={styles.item}>
              <View style={styles.inner}>
                <Icon width={22} height={22} color={color} />
                <Text typography="st12" color={color}>
                  {label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  bar: {
    height: MAIN_TAB_BAR_HEIGHT,
    flexDirection: 'row',
    marginHorizontal: 15,
    borderRadius: 30,
    backgroundColor: '#E5E8EB',
    alignItems: 'center',
    paddingHorizontal: BAR_PADDING,
    paddingVertical: BAR_PADDING,
  },
  indicator: {
    position: 'absolute',
    left: BAR_PADDING,
    top: BAR_PADDING,
    bottom: BAR_PADDING,
    backgroundColor: '#fff',
    borderRadius: 30,
  },
  item: {
    flex: 1,
  },
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: 3,
  },
});
