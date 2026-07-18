import { ImageBackground, StyleSheet, type ImageSourcePropType } from 'react-native';
import { Pressable, Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';

interface ThemeCardProps {
  name: string;
  spotCount: number;
  // 서버 연동 시 imageUrl(string)을 { uri: imageUrl }로 매핑
  image: ImageSourcePropType;
  onPress: () => void;
}

export default function ThemeCard({ name, spotCount, image, onPress }: ThemeCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <ImageBackground source={image} fadeDuration={0} style={styles.image}>
        <Text typography="st12" weight="semiBold" color={colors.white} style={styles.textShadow}>
          {name}
        </Text>
        <Text typography="st13" weight="semiBold" color={colors.white} style={styles.textShadow}>
          {spotCount}개의 도망지
        </Text>
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
    justifyContent: 'flex-end',
    padding: 8,
  },
  textShadow: {
    textShadowColor: colors.greyOpacity[600],
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});
