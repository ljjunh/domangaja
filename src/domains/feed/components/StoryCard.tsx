import { ImageBackground, StyleSheet, View, type ImageSourcePropType } from 'react-native';
import { Pressable, Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { HeartOutlineIcon, ViewOutlineIcon } from '@/assets/icons/common';

interface StoryCardProps {
  quietness: number | null;
  placeName: string;
  viewCount: number;
  liked: boolean;
  image: ImageSourcePropType;
  onPress: () => void;
}

export default function StoryCard({
  quietness,
  placeName,
  viewCount,
  liked,
  image,
  onPress,
}: StoryCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <ImageBackground source={image} style={styles.image} resizeMode="cover">
        {quietness != null && (
          <View style={styles.badge}>
            <Text typography="st12" weight="semiBold">
              한적도 {quietness}%
            </Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text
            typography="st11"
            weight="semiBold"
            color={colors.white}
            style={styles.textShadow}
            numberOfLines={1}
          >
            {placeName}
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <ViewOutlineIcon width={20} height={20} color={colors.white} />
              <Text
                typography="st13"
                weight="semiBold"
                color={colors.white}
                style={styles.textShadow}
              >
                {viewCount}
              </Text>
            </View>

            <Pressable hitSlop={8} onPress={() => console.log('TODO: 스토리 좋아요 연동')}>
              <HeartOutlineIcon
                width={20}
                height={20}
                color={liked ? colors.red[500] : colors.white}
              />
            </Pressable>
          </View>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    aspectRatio: 160 / 240,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: colors.grey[200],
  },
  image: {
    flex: 1,
    padding: 10,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  footer: {
    marginTop: 'auto',
    gap: 6,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  textShadow: {
    textShadowColor: colors.greyOpacity[600],
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});
