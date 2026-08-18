import { StyleSheet, View, type ImageSourcePropType } from 'react-native';
import { Image, Pressable, Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { IconButton } from '@/shared/components/ui';
import { ArchiveTickFillIcon, ArchiveTickOutlineIcon } from '@/assets/icons/common';

interface SpotListItemProps {
  name: string;
  region: string;
  quietness: number;
  // 서버 연동 시 imageUrl(string)을 { uri: imageUrl }로 매핑
  image: ImageSourcePropType;
  isScrapped: boolean;
  rank?: number;
  onPressItem: () => void;
  onPressScrap: () => void;
}

export default function SpotListItem({
  name,
  region,
  quietness,
  image,
  isScrapped,
  rank,
  onPressItem,
  onPressScrap,
}: SpotListItemProps) {
  return (
    <Pressable onPress={onPressItem} style={styles.container}>
      <View>
        <Image source={image} style={styles.image} />
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
          <Text typography="t7" weight="bold">
            {name}
          </Text>
          <Text typography="st13" weight="semiBold" color={colors.grey[500]}>
            {region}
            {' · '}한적도 {quietness}%
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
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[200],
  },
  info: {
    gap: 4,
  },
  scrapButton: {
    alignSelf: 'center',
  },
});
