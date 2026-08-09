import { StyleSheet, View } from 'react-native';
import { Pressable, Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { HeartOutlineIcon, ViewOutlineIcon } from '@/assets/icons/common';

interface StoryViewerFooterProps {
  viewCount: number;
  onPressLike: () => void;
}

export default function StoryViewerFooter({ viewCount, onPressLike }: StoryViewerFooterProps) {
  return (
    <View style={styles.container}>
      <View style={styles.stat}>
        <ViewOutlineIcon color={colors.white} />
        <Text typography="st10" weight="bold" color={colors.white} style={styles.textShadow}>
          {viewCount}
        </Text>
      </View>
      <Pressable hitSlop={8} onPress={onPressLike}>
        <HeartOutlineIcon color={colors.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  textShadow: {
    textShadowColor: colors.greyOpacity[600],
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});
