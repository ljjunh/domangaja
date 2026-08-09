import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components/ui';
import { BaseModal } from '@/shared/components/overlay';
import { overlay } from '@/shared/overlay';
import { useAuthStore } from '@/shared/store/authStore';
import { tokenStorage } from '@/shared/api/tokenStorage';
import { queryClient } from '@/shared/api/queryClient';
import { userQueryKeys } from '@/domains/user/api/queries';

export const useLogout = () => {
  const logout = useAuthStore(state => state.logout);
  const { t } = useTranslation();

  const confirmLogout = () => {
    overlay.open(({ isOpen, close, unmount }) => {
      const handleLogoutConfirm = async () => {
        await tokenStorage.clear();
        queryClient.removeQueries({ queryKey: userQueryKeys.all });
        logout();
        close();
      };
      return (
        <BaseModal isOpen={isOpen} onClose={close} onUnmount={unmount} title={t('logout.message')}>
          <View style={styles.buttons}>
            <View style={styles.buttonItem}>
              <Button type="light" size="medium" display="block" onPress={close}>
                {t('common.cancel')}
              </Button>
            </View>
            <View style={styles.buttonItem}>
              <Button type="dark" size="medium" display="block" onPress={handleLogoutConfirm}>
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
});
