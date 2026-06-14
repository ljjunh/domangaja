import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ComponentType } from 'react';
import type { SvgProps } from 'react-native-svg';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { HomeIcon, MapIcon, FeedIcon, SettingIcon } from '@/assets/icons/nav';
import { IS_ANDROID } from '../constants/platform';

interface TabConfig {
  label: string;
  Icon: ComponentType<SvgProps>;
}

const TABS: Record<string, TabConfig> = {
  Home: { label: '홈', Icon: HomeIcon },
  Map: { label: '지도', Icon: MapIcon },
  Feed: { label: '피드', Icon: FeedIcon },
  Setting: { label: '설정', Icon: SettingIcon },
};

// TODO: 다국어, base Component, typography
export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingBottom: IS_ANDROID ? bottom + 8 : bottom }]}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const { label, Icon } = TABS[route.name];
          const color = isFocused ? '#000000' : '#8B95A1';

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
              <View style={[styles.inner, isFocused && styles.innerActive]}>
                <Icon width={22} height={22} color={color} />
                <Text style={[styles.label, { color }]} allowFontScaling={false}>
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
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  item: {
    flex: 1,
  },
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: 3,
    borderRadius: 30,
    overflow: 'hidden',
  },
  innerActive: {
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
  },
});
