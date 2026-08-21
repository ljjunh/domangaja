import { ActivityIndicator, StyleSheet } from 'react-native';
import { Pressable } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { GpsIcon } from '@/assets/icons/common';

const ICON_SIZE = 24;

interface MyLocationButtonProps {
  isLocating: boolean;
  onPress: () => void;
}

export default function MyLocationButton({ isLocating, onPress }: MyLocationButtonProps) {
  return (
    <Pressable style={styles.container} onPress={onPress} disabled={isLocating}>
      {isLocating ? (
        <ActivityIndicator size={ICON_SIZE} color={colors.blue[500]} />
      ) : (
        <GpsIcon width={ICON_SIZE} height={ICON_SIZE} color={colors.blue[500]} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    boxShadow: '0 4 4 0 rgba(0, 0, 0, 0.1)',
  },
});
