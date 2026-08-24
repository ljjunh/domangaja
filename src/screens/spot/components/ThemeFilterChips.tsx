import { ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { SPOT_THEMES, type SpotTheme } from '@/shared/types/spotTheme';

interface ThemeFilterChipsProps {
  selectedTheme: SpotTheme | null;
  onSelectTheme: (theme: SpotTheme | null) => void;
}

export default function ThemeFilterChips({ selectedTheme, onSelectTheme }: ThemeFilterChipsProps) {
  const { t } = useTranslation();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
    >
      <Chip
        label={t('common.all')}
        isSelected={selectedTheme == null}
        onPress={() => onSelectTheme(null)}
      />
      {SPOT_THEMES.map(theme => (
        <Chip
          key={theme}
          label={t(`spot.theme.names.${theme}`)}
          isSelected={selectedTheme === theme}
          onPress={() => onSelectTheme(theme)}
        />
      ))}
    </ScrollView>
  );
}

interface ChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

function Chip({ label, isSelected, onPress }: ChipProps) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, isSelected && styles.selectedChip]}>
      <Text typography="t7" weight="semiBold" color={isSelected ? colors.white : colors.grey[700]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: colors.grey[100],
  },
  selectedChip: {
    backgroundColor: colors.grey[900],
  },
});
