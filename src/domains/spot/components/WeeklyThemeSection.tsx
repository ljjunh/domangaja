import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
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
  const { data: themes } = useSuspenseQuery(spotQueries.getWeeklyThemes({ limit: 5 }));

  return (
    <View style={styles.container}>
      <SectionHeader
        title="이번주 인기 테마"
        onPressSeeAll={() => console.log('이번주 인기테마로 이동')}
      />

      {themes.length === 0 ? (
        <EmptyState
          icon={ClockOutlineIcon}
          title={t('spot.popular.empty.title')}
          description={t('spot.popular.empty.description')}
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
              name={t(`spotTheme.${theme.theme}`)}
              spotCount={theme.spotCount}
              image={SPOT_THEME_IMAGES.square[theme.theme]}
              onPress={() => console.log('테마 페이지로 이동')}
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
});
