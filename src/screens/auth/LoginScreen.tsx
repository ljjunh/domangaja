import { Button, Text, View } from 'react-native';
import { useAuthStore } from '@/shared/store/authStore';

export const LoginScreen = () => {
  const login = useAuthStore(s => s.login);
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Login</Text>
      <Button title="로그인" onPress={() => login()} />
    </View>
  );
};
