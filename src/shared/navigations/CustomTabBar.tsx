import { useState, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/shared/components/base';
import type { SvgProps } from 'react-native-svg';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { HomeIcon, MapIcon, FeedIcon, SettingIcon } from '@/assets/icons/nav';
import { IS_ANDROID } from '@/shared/constants/platform';
import { colors } from '../constants/colors';

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
  const [contentWidth, setContentWidth] = useState(0);
  const tabCount = state.routes.length;
  const tabWidth = tabCount > 0 ? contentWidth / tabCount : 0;
  const activeIndex = state.index;

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withSpring(activeIndex * tabWidth, {
          stiffness: 400,
          mass: 0.3,
        }),
      },
    ],
  }));

  return (
    <View style={[styles.wrapper, { paddingBottom: IS_ANDROID ? bottom + 8 : bottom }]}>
      <View
        style={styles.bar}
        onLayout={e => setContentWidth(e.nativeEvent.layout.width - BAR_PADDING * 2)}
      >
        {tabWidth > 0 && (
          <Animated.View style={[styles.indicator, { width: tabWidth }, indicatorStyle]} />
        )}

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
