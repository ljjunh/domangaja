import { StyleSheet, View } from 'react-native';
import { Trans, useTranslation } from 'react-i18next';
import { Text } from '@/shared/components/base';
import { Button } from '@/shared/components/ui';
import { BaseSheet } from '@/shared/components/overlay';
import { colors } from '@/shared/constants/colors';
import { IS_IOS } from '@/shared/constants/platform';
import { openPhotoSettings } from '@/domains/user/lib/photoPermission';

const PLATFORM_KEY = IS_IOS ? 'ios' : 'android';

interface PhotoPermissionSheetProps {
  onClose: () => void;
}

export default function PhotoPermissionSheet({ onClose }: PhotoPermissionSheetProps) {
  const { t } = useTranslation();
  const handleOpenSettings = (close: () => void) => {
    openPhotoSettings();
    close();
  };

  return (
    <BaseSheet onClose={onClose}>
      {close => (
        <View style={styles.container}>
          <Text typography="t4" weight="bold" color={colors.grey[900]}>
            {t('photoPermission.title')}
          </Text>

          <Text typography="t6" weight="semiBold" color={colors.grey[500]}>
            {t('photoPermission.description')}
          </Text>

          <View style={styles.stepBox}>
            <StepItem order={1} i18nKey={`photoPermission.${PLATFORM_KEY}.step1`} />
            <StepItem order={2} i18nKey={`photoPermission.${PLATFORM_KEY}.step2`} />
          </View>

          <View style={styles.actions}>
            <View style={styles.actionItem}>
              <Button
                type="light"
                size="large"
                display="block"
                onPress={close}
                containerStyle={styles.actionButton}
              >
                {t('photoPermission.later')}
              </Button>
            </View>
            <View style={styles.actionItem}>
              <Button
                type="primary"
                size="large"
                display="block"
                onPress={() => handleOpenSettings(close)}
                containerStyle={styles.actionButton}
              >
                {t('photoPermission.openSettings')}
              </Button>
            </View>
          </View>
        </View>
      )}
    </BaseSheet>
  );
}

function StepItem({ order, i18nKey }: { order: number; i18nKey: string }) {
  return (
    <View style={styles.stepItem}>
      <View style={styles.stepBadge}>
        <Text typography="st13" weight="medium" color={colors.white}>
          {order}
        </Text>
      </View>
      <Text typography="t7" weight="medium" color={colors.black} style={styles.stepText}>
        <Trans
          i18nKey={i18nKey}
          components={{
            b: <Text typography="t7" weight="bold" color={colors.black} />,
          }}
        />
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  stepBox: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: colors.grey[100],
    gap: 6,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.blue[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    flexShrink: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  actionItem: {
    flex: 1,
  },
  actionButton: {
    paddingVertical: 14,
  },
});
