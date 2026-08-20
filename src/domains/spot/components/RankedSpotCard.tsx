import { ImageBackground, StyleSheet, View } from 'react-native';
import { Pressable, Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { placeholderImage } from '@/assets/images';
import { formatQuietness } from '@/shared/utils/formatQuietness';

interface RankedSpotCardProps {
  rank: number;
  name: string;
  quietness: number;
  /** 없거나 빈 문자열이면 폴백 이미지를 쓴다 */
  imageUrl: string | null;
  onPress: () => void;
}

export default function RankedSpotCard({
  rank,
  name,
  quietness,
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
          <Text typography="st12" weight="semiBold">
            {name}
          </Text>
          <Text typography="st12" weight="semiBold" color={colors.grey[500]}>
            한적도 {formatQuietness(quietness)}%
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
