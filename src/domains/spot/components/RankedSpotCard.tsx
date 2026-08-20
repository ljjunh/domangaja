import { ImageBackground, StyleSheet, View } from 'react-native';
import { Pressable, Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { placeholderImage } from '@/assets/images';

interface RankedSpotCardProps {
  rank: number;
  name: string;
  region: string;
  /** 없거나 빈 문자열이면 폴백 이미지를 쓴다 */
  imageUrl: string | null;
  onPress: () => void;
}

export default function RankedSpotCard({
  rank,
  name,
  region,
  imageUrl,
  onPress,
}: RankedSpotCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <ImageBackground
        source={imageUrl ? { uri: imageUrl } : placeholderImage}
        fadeDuration={0}
        style={styles.image}
      >
        <View style={styles.rankBadge}>
          <Text typography="t7" weight="semiBold" color={colors.blue[500]}>
            {rank}
          </Text>
        </View>
        <View style={styles.info}>
          {/* 140px 폭이라 두 줄이 되면 카드 높이가 어긋난다 — 한 줄로 고정 */}
          <Text typography="st12" weight="semiBold" numberOfLines={1}>
            {name}
          </Text>
          <Text typography="st12" weight="semiBold" color={colors.grey[500]} numberOfLines={1}>
            {region}
          </Text>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    aspectRatio: 1,
    overflow: 'hidden',
    borderRadius: 12,
  },
  image: {
    flex: 1,
    justifyContent: 'space-between',
  },
  rankBadge: {
    width: 20,
    height: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginLeft: 8,
    marginTop: 8,
    borderRadius: 6,
  },
  info: {
    backgroundColor: colors.grey[50],
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
});
