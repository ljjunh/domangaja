import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '@/shared/components/base';
import { Button } from '@/shared/components/ui';
import { BaseModal } from '@/shared/components/overlay';
import { overlay } from '@/shared/overlay';
import { useAuthStore } from '@/shared/store/authStore';
import { tokenStorage } from '@/shared/api/tokenStorage';
import { queryClient } from '@/shared/api/queryClient';
import { colors } from '@/shared/constants/colors';
import { IS_IOS } from '@/shared/constants/platform';
import { getFcmToken } from '@/domains/notification/lib/fcm';
import { unregisterDeviceToken } from '@/domains/notification/api/service';

export const useLogout = () => {
  const logout = useAuthStore(state => state.logout);
  const { t } = useTranslation();

  const confirmLogout = () => {
    overlay.open(({ isOpen, close, unmount }) => {
      const handleLogoutConfirm = async () => {
        const fcmToken = await getFcmToken();
        if (fcmToken != null) {
          try {
            await unregisterDeviceToken({ token: fcmToken, platform: IS_IOS ? 'IOS' : 'ANDROID' });
          } catch {}
        }

        await tokenStorage.clear();
        queryClient.clear();
        logout();
        close();
      };
      return (
        <BaseModal isOpen={isOpen} onClose={close} onUnmount={unmount} title={t('logout.message')}>
          <Text typography="t6" weight="semiBold" color={colors.grey[500]} textAlign="center">
            {t('logout.description')}
          </Text>
          <View style={styles.buttons}>
            <View style={styles.buttonItem}>
              <Button
                type="light"
                size="medium"
                display="block"
                onPress={close}
                containerStyle={styles.button}
              >
                {t('common.cancel')}
              </Button>
            </View>
            <View style={styles.buttonItem}>
              <Button
                type="primary"
                size="medium"
                display="block"
                onPress={handleLogoutConfirm}
                containerStyle={styles.button}
              >
                {t('logout.title')}
              </Button>
            </View>
          </View>
        </BaseModal>
      );
    });
  };

  return { confirmLogout };
};

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  buttonItem: {
    flex: 1,
  },
  button: {
    paddingVertical: 12,
  },
});
