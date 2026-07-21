import { View, StyleSheet } from 'react-native';
import { Text } from '@/shared/components/base';
import { Button } from '@/shared/components/ui';
import { BaseModal } from '@/shared/components/overlay';
import { overlay } from '@/shared/overlay';
import { colors } from '@/shared/constants/colors';
import { useAuthStore } from '@/shared/store/authStore';

export const useLogout = () => {
  const logout = useAuthStore(state => state.logout);

  const confirmLogout = () => {
    overlay.open(({ isOpen, close, unmount }) => (
      <BaseModal isOpen={isOpen} onClose={close} onUnmount={unmount} title="로그아웃">
        <Text typography="t6" color={colors.grey[600]} textAlign="center">
          정말 로그아웃 할까요?
        </Text>
        <View style={styles.buttons}>
          <View style={styles.buttonItem}>
            <Button type="light" display="block" onPress={close}>
              취소
            </Button>
          </View>
          <View style={styles.buttonItem}>
            <Button
              type="danger"
              display="block"
              onPress={() => {
                logout();
                close();
              }}
            >
              로그아웃
            </Button>
          </View>
        </View>
      </BaseModal>
    ));
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
