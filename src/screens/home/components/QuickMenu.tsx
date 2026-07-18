import { StyleSheet, View } from 'react-native';
import { Text, Pressable } from '@/shared/components/base';
import { ArchiveTickFillIcon, CrownIcon, LocationIcon, SunFogIcon } from '@/assets/icons/common';
import { colors } from '@/shared/constants/colors';

export default function QuickMenu() {
  return (
    <View style={styles.container}>
      <Pressable onPress={() => console.log('지역별 찾기로 이동')} style={styles.item}>
        <LocationIcon width={24} height={24} color={colors.blue[500]} />
        <Text typography="st12" weight="semiBold">
          지역별 찾기
        </Text>
      </Pressable>
      <Pressable onPress={() => console.log('테마별 찾기로 이동')} style={styles.item}>
        <SunFogIcon width={24} height={24} color={colors.blue[500]} />
        <Text typography="st12" weight="semiBold">
          테마별 찾기
        </Text>
      </Pressable>
      <Pressable onPress={() => console.log('인기 도망지로 이동')} style={styles.item}>
        <CrownIcon width={24} height={24} color={colors.blue[500]} />
        <Text typography="st12" weight="semiBold">
          인기 도망지
        </Text>
      </Pressable>
      <Pressable onPress={() => console.log('저장한 곳으로 이동')} style={styles.item}>
        <ArchiveTickFillIcon width={24} height={24} color={colors.blue[500]} />
        <Text typography="st12" weight="semiBold">
          저장한 곳
        </Text>
      </Pressable>
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
