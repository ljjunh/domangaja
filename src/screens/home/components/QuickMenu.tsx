import { type ComponentType } from 'react';
import { StyleSheet, View } from 'react-native';
import { SvgProps } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
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

export default function QuickMenu() {
  const { t } = useTranslation();
  const { navigate } = useNavigation();

  const menuItems: QuickMenuItem[] = [
    {
      label: t('home.quickMenu.region'),
      icon: LocationFillIcon,
      onPress: () => navigate('RegionSpot'),
    },
    {
      label: t('home.quickMenu.theme'),
      icon: SunFogFillIcon,
      onPress: () => navigate('ThemeBrowse'),
    },
    {
      label: t('home.quickMenu.popular'),
      icon: CrownFillIcon,
      onPress: () => navigate('PopularSpot'),
    },
    {
      label: t('home.quickMenu.scrap'),
      icon: ArchiveTickFillIcon,
      onPress: () => navigate('Scrap'),
    },
  ];

  return (
    <View style={styles.container}>
      {menuItems.map(({ label, icon: Icon, onPress }) => (
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
