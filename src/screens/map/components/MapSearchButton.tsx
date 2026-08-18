import { ActivityIndicator, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { RotateLeftIcon } from '@/assets/icons/common';

const ICON_SIZE = 18;

interface MapSearchButtonProps {
  isSearching: boolean;
  onPress: () => void;
}

export default function MapSearchButton({ isSearching, onPress }: MapSearchButtonProps) {
  const { t } = useTranslation();

  return (
    <Pressable style={styles.container} onPress={onPress} disabled={isSearching}>
      {isSearching ? (
        <ActivityIndicator size={ICON_SIZE} color={colors.blue[500]} />
      ) : (
        <RotateLeftIcon width={ICON_SIZE} height={ICON_SIZE} color={colors.blue[500]} />
      )}
      <Text typography="t7" weight="semiBold" color={colors.blue[500]}>
        {t('map.searchThisArea')}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 25,
    backgroundColor: colors.white,
    boxShadow: '0 2 8 0 rgba(0, 0, 0, 0.15)',
  },
});
