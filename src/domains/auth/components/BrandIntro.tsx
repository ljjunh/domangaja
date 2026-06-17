import { StyleSheet, View } from 'react-native';
import { Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { useTranslation } from 'react-i18next';

export default function BrandIntro() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.logo} />
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
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20 },
  logo: {
    width: 82,
    height: 82,
    backgroundColor: colors.blue[500],
    borderRadius: 12,
  },
  textGroup: {
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
