import { ImageBackground, StyleSheet, View } from 'react-native';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Text, Pressable } from '@/shared/components/base';
import { spotQueries } from '@/domains/spot/api/queries';
import { colors } from '@/shared/constants/colors';

export default function TodaySpotBanner() {
  const { data: spot } = useSuspenseQuery(spotQueries.getTodaySpot());

  return (
    <Pressable onPress={() => console.log('오늘의 추천 도망지 상세 페이지 이동')}>
      <ImageBackground
        source={{ uri: spot.imageUrl }}
        fadeDuration={0}
        style={styles.banner}
        imageStyle={styles.image}
      >
        <Text typography="st12" weight="medium" color={colors.white} style={styles.textShadow}>
          오늘의 추천 도망지
        </Text>
        <Text typography="t5" weight="semiBold" color={colors.white} style={styles.textShadow}>
          {spot.title}
        </Text>
        <Text
          typography="st12"
          weight="regular"
          color={colors.white}
          style={[styles.description, styles.textShadow]}
          numberOfLines={2}
        >
          {spot.description}
        </Text>
        <View style={styles.detailChip}>
          <Text typography="st13" weight="medium" color={colors.white} style={styles.textShadow}>
            자세히 보기 {'>'}
          </Text>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  banner: {
    alignSelf: 'stretch',
    aspectRatio: 345 / 170,
    padding: 20,
    justifyContent: 'center',
    gap: 6,
  },
  image: {
    borderRadius: 12,
  },
  description: {
    // maxWidth: '60%',
  },
  detailChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: 12,
  },
  textShadow: {
    textShadowColor: colors.greyOpacity[600],
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});
