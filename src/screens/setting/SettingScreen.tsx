import { ScrollView, StyleSheet, View } from 'react-native';
import { useAuthStore } from '@/shared/store/authStore';
import { Text } from '@/shared/components/base';
import { Layout } from '@/shared/components/layout';
import { Button } from '@/shared/components/ui';
import { Header } from '@/shared/components/layout';
import { overlay } from '@/shared/overlay';
import { colors } from '@/shared/constants/colors';
import { BaseModal } from '@/shared/components/overlay';
import { useMainTabBarSpace } from '@/shared/hooks/useMainTabBarSpace';
import { MAIN_TAB_SCREEN_EDGES, SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { NotificationButton } from '@/domains/notification/components';

export default function SettingScreen() {
  const logout = useAuthStore(state => state.logout);
  const mainTabBarSpace = useMainTabBarSpace();

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
    <Layout edges={MAIN_TAB_SCREEN_EDGES}>
      <Header
        left={
          <Text typography="t4" weight="bold">
            설정
          </Text>
        }
        right={<NotificationButton />}
      />
      <ScrollView contentContainerStyle={[styles.container, { paddingBottom: mainTabBarSpace }]}>
        <Button onPress={handleLogoutPress}>로그아웃</Button>
        <Text typography="t1">Setting Screen</Text>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
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
