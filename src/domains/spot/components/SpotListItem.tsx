import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { formatQuietness } from '@/shared/utils/formatQuietness';
import { IconButton } from '@/shared/components/ui';
import { ArchiveTickFillIcon, ArchiveTickOutlineIcon } from '@/assets/icons/common';
import { placeholderImage } from '@/assets/images';

interface SpotListItemProps {
  name: string;
  region: string;
  /** null이면 측정 대상이 아니라 한적도를 표시하지 않는다 */
  quietness: number | null;
  /** 없거나 빈 문자열이면 폴백 이미지를 쓴다 */
  imageUrl: string | null;
  isScrapped: boolean;
  rank?: number;
  onPressItem: () => void;
  onPressScrap: () => void;
}

export default function SpotListItem({
  name,
  region,
  quietness,
  imageUrl,
  isScrapped,
  rank,
  onPressItem,
  onPressScrap,
}: SpotListItemProps) {
  const { t } = useTranslation();

  return (
    <Pressable onPress={onPressItem} style={styles.container}>
      <View>
        <Image source={imageUrl ? { uri: imageUrl } : placeholderImage} style={styles.image} />
        {rank != null && (
          <View style={styles.rankBadge}>
            <Text typography="st13" weight="semiBold" color={colors.white}>
              {rank}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.content}>
        <View style={styles.info}>
          <Text typography="t7" weight="bold" numberOfLines={2} ellipsizeMode="tail">
            {name}
          </Text>
          <Text
            typography="st13"
            weight="semiBold"
            color={colors.grey[500]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {region}
            {quietness != null &&
              ` · ${t('spot.quietness', { score: formatQuietness(quietness) })}`}
          </Text>
        </View>
        <IconButton
          onPress={onPressScrap}
          icon={isScrapped ? ArchiveTickFillIcon : ArchiveTickOutlineIcon}
          color={isScrapped ? colors.blue[500] : colors.black}
          style={styles.scrapButton}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 11,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 12,
  },
  rankBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: 18,
    height: 18,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.blue[500],
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[200],
  },
  info: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  scrapButton: {
    flexShrink: 0,
    alignSelf: 'center',
  },
});
