import { StyleSheet, View } from 'react-native';
import { Pressable, Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { CloseIcon } from '@/assets/icons/common';

interface StoryViewerHeaderProps {
  nickname: string;
  locationLabel: string;
  onClose: () => void;
}

export default function StoryViewerHeader({
  nickname,
  locationLabel,
  onClose,
}: StoryViewerHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <View style={styles.avatar} />
        <View>
          <Text typography="st11" weight="bold" color={colors.white} style={styles.textShadow}>
            {nickname}
          </Text>
          <Text
            typography="st13"
            weight="semiBold"
            color={colors.grey[200]}
            style={styles.textShadow}
          >
            {locationLabel}
          </Text>
        </View>
      </View>
      <Pressable hitSlop={8} onPress={onClose}>
        <CloseIcon color={colors.white} />
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
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.grey[200],
  },
  textShadow: {
    textShadowColor: colors.greyOpacity[600],
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});
