import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { formatQuietness } from '@/shared/utils/formatQuietness';
import { placeholderImage } from '@/assets/images';

interface ThemeSpotListItemProps {
  spot: {
    title: string;
    regionName: string;
    imageUrl: string;
    quietnessScore: number | null;
  };
  onPress: () => void;
}

export default function ThemeSpotListItem({ spot, onPress }: ThemeSpotListItemProps) {
  const { t } = useTranslation();

  return (
    <Pressable onPress={onPress} style={styles.item}>
      <Image source={spot.imageUrl ? { uri: spot.imageUrl } : placeholderImage} style={styles.image} />
      <View style={styles.content}>
        <Text typography="t7" weight="bold" numberOfLines={2} ellipsizeMode="tail">
          {spot.title}
        </Text>
        <Text
          typography="st13"
          weight="semiBold"
          color={colors.grey[500]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {spot.regionName}
          {spot.quietnessScore != null &&
            ` · ${t('spot.theme.result.quietness', {
              score: formatQuietness(spot.quietnessScore),
            })}`}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: { minHeight: 70, flexDirection: 'row', gap: 11 },
  image: { width: 70, height: 70, borderRadius: 12 },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[200],
  },
});
