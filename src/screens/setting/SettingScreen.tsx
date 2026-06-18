import { View, StyleSheet } from 'react-native';
import { useAuthStore } from '@/shared/store/authStore';
import { overlay } from '@/shared/overlay';
import { Button } from '@/shared/components/ui';
import { Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { Layout } from '@/shared/components/layout';
import { BaseModal } from '@/shared/components/overlay';

export default function SettingScreen() {
  const logout = useAuthStore(state => state.logout);

  const handleLogoutPress = () => {
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
              type="primary"
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

  return (
    <Layout padded>
      <Text typography="t4" weight="bold">
        Setting
      </Text>
      <Button onPress={handleLogoutPress}>로그아웃</Button>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  buttons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  buttonItem: {
    flex: 1,
  },
});
