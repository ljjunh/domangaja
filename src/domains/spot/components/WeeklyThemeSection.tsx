import { ScrollView, StyleSheet, View } from 'react-native';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { example1Image, example2Image } from '@/assets/images';
import SectionHeader from './SectionHeader';
import ThemeCard from './ThemeCard';

const MOCK_WEEKLY_THEME = [
  { id: 1, name: '여름 바다', spotCount: 32, image: example1Image },
  { id: 2, name: '계곡 · 폭포', spotCount: 14, image: example2Image },
  { id: 3, name: '별 · 밤하늘', spotCount: 12, image: example1Image },
  { id: 4, name: '숲', spotCount: 20, image: example2Image },
  { id: 5, name: '휴양지', spotCount: 24, image: example1Image },
];

export default function WeeklyThemeSection() {
  return (
    <View style={styles.container}>
      <SectionHeader
        title="이번주 인기 테마"
        onPressSeeAll={() => console.log('이번주 인기테마로 이동')}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={styles.list}
      >
        {MOCK_WEEKLY_THEME.map(theme => (
          <ThemeCard
            key={theme.id}
            name={theme.name}
            spotCount={theme.spotCount}
            image={theme.image}
            onPress={() => console.log('테마 페이지로 이동')}
          />
        ))}
      </ScrollView>
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
