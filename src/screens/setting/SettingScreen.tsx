import { Button, View, Text } from 'react-native';
import { useAuthStore } from '@/shared/store/authStore';

export default function SettingScreen() {
  const logout = useAuthStore(s => s.logout);
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Setting</Text>
      <Button title="로그아웃" onPress={() => logout()} />
    </View>
  );
}
