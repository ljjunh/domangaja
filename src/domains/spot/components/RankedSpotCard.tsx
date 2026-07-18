import { ImageBackground, StyleSheet, View, type ImageSourcePropType } from 'react-native';
import { Pressable, Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';

interface RankedSpotCardProps {
  rank: number;
  name: string;
  quietness: number;
  // 서버 연동 시 imageUrl(string)을 { uri: imageUrl }로 매핑
  image: ImageSourcePropType;
  onPress: () => void;
}

export default function RankedSpotCard({
  rank,
  name,
  quietness,
  image,
  onPress,
}: RankedSpotCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <ImageBackground source={image} fadeDuration={0} style={styles.image}>
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
            한적도 {quietness}%
          </Text>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    height: 140,
    overflow: 'hidden',
    borderRadius: 12,
  },
  image: {
    aspectRatio: 1,
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
