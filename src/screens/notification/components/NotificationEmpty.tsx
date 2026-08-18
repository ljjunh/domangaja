import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '@/shared/components/base';
import { Button } from '@/shared/components/ui';
import { colors } from '@/shared/constants/colors';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { NotificationOffOutlineIcon } from '@/assets/icons/common';

const ICON_SIZE = 36;

interface NotificationEmptyProps {
  onPressSetting: () => void;
}

export default function NotificationEmpty({ onPressSetting }: NotificationEmptyProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconBadge}>
          <NotificationOffOutlineIcon
            width={ICON_SIZE}
            height={ICON_SIZE}
            color={colors.blue[500]}
          />
        </View>
        <Text typography="t3" weight="bold" textAlign="center">
          {t('notification.empty.title')}
        </Text>
        <Text typography="t5" weight="medium" color={colors.grey[500]} textAlign="center">
          {t('notification.empty.description')}
        </Text>
      </View>

      <Button size="large" display="block" onPress={onPressSetting}>
        {t('notification.empty.action')}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL + 15,
    gap: 20,
  },
  content: {
    alignItems: 'center',
    gap: 10,
  },
  iconBadge: {
    padding: 16,
    borderRadius: 20,
    backgroundColor: colors.blue[50],
  },
});
