import { StyleSheet, View } from 'react-native';
import { Pressable, Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { ArrowRightIcon, LocationIcon } from '@/assets/icons/common';

export default function NearbySpotBanner() {
  return (
    <Pressable style={styles.banner}>
      <View style={styles.content}>
        <View style={styles.locationIconBadge}>
          <LocationIcon color={colors.blue[500]} />
        </View>
        <View>
          <Text typography="st12" weight="semiBold">
            지금 내 주변 한적한 곳이 궁금하다면?
          </Text>
          <Text typography="st13" weight="semiBold" color={colors.grey[500]}>
            내 위치 기준 한적도 높은 장소를 알려드려요
          </Text>
        </View>
      </View>
      <ArrowRightIcon color={colors.blue[500]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.blue[50],
    borderRadius: 24,
    padding: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationIconBadge: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 8,
  },
});
