import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Pressable, Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { LocationFillIcon, ArrowRightIcon } from '@/assets/icons/common';

export default function FeedBanner() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  return (
    <Pressable
      onPress={() => navigation.navigate('Main', { screen: 'Map' })}
      style={styles.banner}
    >
      <View style={styles.locationIconBadge}>
        <LocationFillIcon color={colors.blue[500]} />
      </View>
      <View style={styles.texts}>
        <Text typography="t7" weight="bold" color={colors.grey[900]}>
          {t('feed.quietSpot.title')}
        </Text>
        <Text typography="st13" weight="semiBold" color={colors.grey[500]}>
          {t('feed.banner.subtitle')}
        </Text>
      </View>
      <ArrowRightIcon width={16} height={16} color={colors.grey[400]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.blue[50],
    borderRadius: 24,
    padding: 16,
  },
  locationIconBadge: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 8,
  },
  texts: {
    flex: 1,
    gap: 2,
  },
});
