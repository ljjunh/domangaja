import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { PlayFillIcon } from '@/assets/icons/common';

const MOCK_TAGS = ['들판', '문학', '호수'];

export default function SpotTourInfo() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text typography="t6" weight="medium" color={colors.grey[700]}>
        소설 토지의 무대가 된 들판. 너른 평야에 사람보다 바람이 많아요.
      </Text>
      <View style={styles.tags}>
        {MOCK_TAGS.map(tag => (
          <View key={tag} style={styles.tag}>
            <Text typography="st12" weight="semiBold" color={colors.grey[700]}>
              #{tag}
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.statRow}>
        <View style={styles.statCard}>
          <Text typography="st12" weight="semiBold" color={colors.grey[600]}>
            {t('spotSheet.weeklyVisitors')}
          </Text>
          <Text typography="t4" weight="semiBold">
            1.1 천명
          </Text>
        </View>
        <View style={styles.statCard}>
          <Text typography="st12" weight="semiBold" color={colors.grey[600]}>
            {t('spotSheet.trend')}
          </Text>
          <Text typography="t4" weight="semiBold" color={colors.blue[500]}>
            +2
          </Text>
        </View>
      </View>

      <View style={styles.audioGuideCard}>
        <Pressable style={styles.playButton}>
          <PlayFillIcon width={36} height={36} color={colors.white} />
        </Pressable>
        <View>
          <Text typography="t7" weight="semiBold">
            {t('spotSheet.audioGuide')}
          </Text>
          <Text typography="st12" weight="semiBold" color={colors.grey[600]}>
            4분 32초
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tag: {
    paddingVertical: 2,
    paddingHorizontal: 10,
    backgroundColor: colors.grey[100],
    borderRadius: 12,
  },
  statRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.grey[100],
    padding: 10,
    borderRadius: 8,
  },
  audioGuideCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 10,
    backgroundColor: colors.grey[100],
    borderRadius: 8,
  },
  playButton: {
    backgroundColor: colors.blue[500],
    borderRadius: 25,
  },
});
