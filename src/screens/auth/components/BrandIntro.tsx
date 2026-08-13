import { StyleSheet, View } from 'react-native';
import { Text } from '@/shared/components/base';
import { useTranslation } from 'react-i18next';
import { AppIcon } from '@/assets/icons/logo';

export default function BrandIntro() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <AppIcon width={120} height={120} />
      <View style={styles.textGroup}>
        <Text typography="t1" weight="bold" textAlign="center">
          {t('login.title')}
        </Text>
        <Text typography="t7" weight="semiBold" textAlign="center">
          {t('login.subtitle')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  textGroup: {
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
