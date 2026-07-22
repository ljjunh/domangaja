import { type ComponentType } from 'react';
import { StyleSheet, View } from 'react-native';
import { SvgProps } from 'react-native-svg';
import { Text, Pressable } from '@/shared/components/base';
import {
  ArchiveTickFillIcon,
  CrownFillIcon,
  LocationFillIcon,
  SunFogFillIcon,
} from '@/assets/icons/common';
import { colors } from '@/shared/constants/colors';

interface QuickMenuItem {
  label: string;
  icon: ComponentType<SvgProps>;
  onPress: () => void;
}

const MENU_ITEMS: QuickMenuItem[] = [
  {
    label: '지역별 찾기',
    icon: LocationFillIcon,
    onPress: () => console.log('지역별 찾기로 이동'),
  },
  { label: '테마별 찾기', icon: SunFogFillIcon, onPress: () => console.log('테마별 찾기로 이동') },
  { label: '인기 도망지', icon: CrownFillIcon, onPress: () => console.log('인기 도망지로 이동') },
  {
    label: '저장한 곳',
    icon: ArchiveTickFillIcon,
    onPress: () => console.log('저장한 곳으로 이동'),
  },
];

export default function QuickMenu() {
  return (
    <View style={styles.container}>
      {MENU_ITEMS.map(({ label, icon: Icon, onPress }) => (
        <Pressable key={label} onPress={onPress} style={styles.item}>
          <Icon width={24} height={24} color={colors.blue[500]} />
          <Text typography="st12" weight="semiBold">
            {label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[100],
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 9,
  },
});
