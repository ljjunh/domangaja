import { ImageBackground, StyleSheet, View, type ImageSourcePropType } from 'react-native';
import { Text, Pressable } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { example1Image } from '@/assets/images';

interface TodaySpot {
  name: string;
  description: string;
  // 서버 연동 시 imageUrl(string)을 { uri: imageUrl }로 매핑
  image: ImageSourcePropType;
}

const MOCK_TODAY_SPOT: TodaySpot = {
  name: '제주 협재 해변',
  description: '에메랄드 빛 바다에서 아무 생각 없이 멍 때리기 좋은 곳',
  image: example1Image,
};

export default function TodaySpotBanner() {
  // TODO: 서버 연동 시 쿼리 결과로 교체
  const spot = MOCK_TODAY_SPOT;

  return (
    <Pressable onPress={() => console.log('오늘의 추천 도망지 상세 페이지 이동')}>
      <ImageBackground
        source={spot.image}
        fadeDuration={0}
        style={styles.banner}
        imageStyle={styles.image}
      >
        <Text typography="st12" weight="medium" color={colors.white} style={styles.textShadow}>
          오늘의 추천 도망지
        </Text>
        <Text typography="t5" weight="semiBold" color={colors.white} style={styles.textShadow}>
          {spot.name}
        </Text>
        <Text
          typography="st12"
          weight="regular"
          color={colors.white}
          style={[styles.description, styles.textShadow]}
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
    maxWidth: '60%',
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
