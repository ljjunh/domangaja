import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useSuspenseQuery } from '@tanstack/react-query';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { EmptyState } from '@/shared/components/ui';
import { spotQueries } from '@/domains/spot/api/queries';
import { ClockOutlineIcon } from '@/assets/icons/common';
import { SPOT_THEME_IMAGES } from '@/assets/images/spotTheme';
import SectionHeader from './SectionHeader';
import ThemeCard from './ThemeCard';

export default function WeeklyThemeSection() {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const { data: themes } = useSuspenseQuery(spotQueries.getWeeklyThemes({ limit: 5 }));

  return (
    <View style={styles.container}>
      <SectionHeader
        title={t('spot.theme.popular.title')}
        onPressSeeAll={() => navigate('WeeklyTheme')}
      />

      {themes.length === 0 ? (
        <EmptyState
          icon={ClockOutlineIcon}
          title={t('spot.theme.popular.empty.title')}
          description={t('spot.theme.popular.empty.description')}
        />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scroll}
          contentContainerStyle={styles.list}
        >
          {themes.map(theme => (
            <ThemeCard
              key={theme.theme}
              name={t(`spot.theme.names.${theme.theme}`)}
              spotCount={theme.spotCount}
              image={SPOT_THEME_IMAGES.square[theme.theme]}
              style={styles.card}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  scroll: {
    marginHorizontal: -SCREEN_PADDING_HORIZONTAL,
  },
  list: {
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
    gap: 12,
  },
  card: {
    width: 140,
  },
});
