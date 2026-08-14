import { useRef, useState, type ComponentRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Trans, useTranslation } from 'react-i18next';
import BottomSheet from '@gorhom/bottom-sheet';
import { Pressable, Text } from '@/shared/components/base';
import { Button } from '@/shared/components/ui';
import { BaseSheet } from '@/shared/components/overlay';
import { colors } from '@/shared/constants/colors';
import { DoneIcon, InfoCircleFillIcon } from '@/assets/icons/common';

interface WithdrawalSheetProps {
  onClose: () => void;
  onConfirm: () => void;
}

export default function WithdrawalSheet({ onClose, onConfirm }: WithdrawalSheetProps) {
  const { t } = useTranslation();
  const [isAgreed, setIsAgreed] = useState(false);
  const sheetRef = useRef<ComponentRef<typeof BottomSheet>>(null);

  const handleConfirm = () => {
    onConfirm();
    sheetRef.current?.close();
  };

  return (
    <BaseSheet ref={sheetRef} onClose={onClose}>
      <View style={styles.container}>
        <Text typography="t4" weight="bold" color={colors.grey[900]}>
          {t('withdrawal.message')}
        </Text>

        <Text typography="t6" weight="semiBold" color={colors.grey[500]}>
          <Trans
            i18nKey="withdrawal.description"
            components={{
              danger: <Text typography="t6" weight="bold" color={colors.red[500]} />,
            }}
          />
        </Text>

        <View style={styles.noticeBox}>
          <View style={styles.noticeHeader}>
            <InfoCircleFillIcon width={18} height={18} color={colors.orange[600]} />
            <Text typography="t7" weight="bold" color={colors.orange[900]}>
              {t('withdrawal.noticeTitle')}
            </Text>
          </View>
          <NoticeItem i18nKey="withdrawal.notice.scrap" />
          <NoticeItem i18nKey="withdrawal.notice.post" />
          <NoticeItem i18nKey="withdrawal.notice.history" />
        </View>

        <Pressable
          onPress={() => setIsAgreed(prev => !prev)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isAgreed }}
          style={styles.agreement}
        >
          <View style={[styles.checkbox, isAgreed && styles.checkboxChecked]}>
            {isAgreed && <DoneIcon width={16} height={16} color={colors.white} />}
          </View>
          <Text typography="t6" weight="semiBold" color={colors.grey[800]}>
            {t('withdrawal.agree')}
          </Text>
        </Pressable>

        <View style={styles.actions}>
          <View style={styles.actionItem}>
            <Button
              type="light"
              size="large"
              display="block"
              onPress={() => sheetRef.current?.close()}
              containerStyle={styles.actionButton}
            >
              {t('common.cancel')}
            </Button>
          </View>
          <View style={styles.actionItem}>
            <Button
              type="danger"
              size="large"
              display="block"
              disabled={!isAgreed}
              onPress={handleConfirm}
              containerStyle={styles.actionButton}
            >
              {t('withdrawal.title')}
            </Button>
          </View>
        </View>
      </View>
    </BaseSheet>
  );
}

function NoticeItem({ i18nKey }: { i18nKey: string }) {
  return (
    <View style={styles.noticeItem}>
      <View style={styles.noticeDot} />
      <Text typography="t7" weight="semiBold" color={'#785B2C'}>
        <Trans i18nKey={i18nKey} />
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  noticeBox: {
    marginTop: 4,
    padding: 16,
    borderRadius: 14,
    backgroundColor: colors.orange[50],
    gap: 10,
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  noticeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  noticeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D7AC72',
  },
  agreement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: colors.grey[50],
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.grey[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    borderColor: colors.red[500],
    backgroundColor: colors.red[500],
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
