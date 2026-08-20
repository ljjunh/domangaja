import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { ClockOutlineIcon, InfoCircleFillIcon } from '@/assets/icons/common';

const ICON_SIZE = 24;

export default function QuietnessCalendarEmpty() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconBadge}>
          <ClockOutlineIcon width={ICON_SIZE} height={ICON_SIZE} color={colors.grey[500]} />
        </View>
        <View>
          <Text typography="t5" weight="bold" textAlign="center">
            {t('spot.congestionEmpty.title')}
          </Text>
          <Text typography="t7" weight="medium" color={colors.grey[500]} textAlign="center">
            {t('spot.congestionEmpty.description')}
          </Text>
        </View>
      </View>

      <View style={styles.notice}>
        <InfoCircleFillIcon width={ICON_SIZE} height={ICON_SIZE} color={colors.blue[500]} />
        <View style={styles.noticeTexts}>
          <Text typography="t7" weight="bold" color={colors.blue[500]}>
            {t('spot.congestionEmpty.noticeTitle')}
          </Text>
          <Text typography="t7" weight="regular" color={colors.grey[700]}>
            {t('spot.congestionEmpty.noticeDescription')}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  content: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 20,
  },
  iconBadge: {
    padding: 10,
    borderRadius: 14,
    backgroundColor: colors.grey[100],
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    backgroundColor: colors.blue[50],
  },
  noticeTexts: {
    flex: 1,
  },
});
