import { useTranslation } from 'react-i18next';
import { StyleSheet, Pressable } from 'react-native';
import { SOCIAL_PROVIDERS, type SocialProvider } from '@/domains/auth/constants/socialProviders';
import { Text } from '@/shared/components/base';

interface SocialLoginButtonProps {
  provider: SocialProvider;
  onPress: () => void;
}

export default function SocialLoginButton({ provider, onPress }: SocialLoginButtonProps) {
  const { t } = useTranslation();
  const { Icon, backgroundColor, textColor } = SOCIAL_PROVIDERS[provider];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, { backgroundColor }, pressed && styles.pressed]}
    >
      <Icon style={styles.icon} />
      <Text typography="t6" weight="semiBold" color={textColor}>
        {t(`login.${provider}`)}
      </Text>
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
