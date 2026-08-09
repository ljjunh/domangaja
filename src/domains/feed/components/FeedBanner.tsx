import { StyleSheet, View } from 'react-native';
import { Pressable, Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { LocationFillIcon, ArrowRightIcon } from '@/assets/icons/common';

export default function FeedBanner() {
  return (
    <Pressable
      onPress={() => console.log('TODO: 실시간 한적도 페이지로 이동')}
      style={styles.banner}
    >
      <View style={styles.locationIconBadge}>
        <LocationFillIcon color={colors.blue[500]} />
      </View>
      <View style={styles.texts}>
        <Text typography="t7" weight="bold" color={colors.grey[900]}>
          지금 한적한 곳을 찾고 있나요?
        </Text>
        <Text typography="st13" weight="semiBold" color={colors.grey[500]}>
          실시간 한적도 높은 장소를 확인해보세요
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
