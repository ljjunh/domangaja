import { StyleSheet, View } from 'react-native';

import { PlayFillIcon } from '@/assets/icons/common';
import { Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';

export default function SpotAudioGuide() {
  return (
    <View style={styles.container}>
      <View style={styles.playButton}>
        <PlayFillIcon width={28} height={28} color={colors.white} />
      </View>
      <View style={styles.texts}>
        <Text typography="t7" weight="semiBold">
          오디오 가이드
        </Text>
        <Text typography="st12" weight="semiBold" color={colors.grey[600]}>
          준비 중
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.grey[100],
  },
  playButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: colors.blue[500],
  },
  texts: { gap: 1 },
});
