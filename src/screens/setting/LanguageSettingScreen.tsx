import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { Layout, StackHeader } from '@/shared/components/layout';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { LANGUAGES, type LanguageCode } from '@/shared/i18n/languages';
import { userMutations } from '@/domains/user/api/queries';
import { SettingSection, LanguageListItem } from './components';

export default function LanguageSettingScreen() {
  const { t, i18n } = useTranslation();
  const { mutate, isPending } = useMutation(userMutations.updateLocale());

  const handlePressItem = (code: LanguageCode) => {
    if (isPending) return;
    mutate(code);
  };

  return (
    <Layout>
      <StackHeader title={t('language.title')} />
      <View style={styles.container}>
        <SettingSection title={t('language.select')}>
          {LANGUAGES.map(language => (
            <LanguageListItem
              key={language.code}
              nativeName={language.nativeName}
              description={t(`language.names.${language.code}`)}
              selected={i18n.language === language.code}
              onPress={() => handlePressItem(language.code)}
            />
          ))}
        </SettingSection>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
  },
});
