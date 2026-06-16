import { StyleSheet, Pressable, Text } from 'react-native';
import { SOCIAL_PROVIDERS, type SocialProvider } from '@/domains/auth/constants/socialProviders';

interface SocialLoginButtonProps {
  provider: SocialProvider;
  onPress: () => void;
}

export default function SocialLoginButton({ provider, onPress }: SocialLoginButtonProps) {
  const { label, Icon, backgroundColor, textColor } = SOCIAL_PROVIDERS[provider];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, { backgroundColor }, pressed && styles.pressed]}
    >
      <Icon style={styles.icon} />
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
    paddingVertical: 15,
  },
  pressed: { opacity: 0.85 },
  icon: { position: 'absolute', left: 20 },
  label: { fontSize: 15, fontWeight: '600' },
});
