import { ActivityIndicator, StyleSheet } from 'react-native';
import { Pressable } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { LocationFillIcon } from '@/assets/icons/common';

const ICON_SIZE = 22;

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
        <LocationFillIcon width={ICON_SIZE} height={ICON_SIZE} color={colors.blue[500]} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    boxShadow: '0 4 4 0 rgba(0, 0, 0, 0.1)',
  },
});
