import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import WebView from 'react-native-webview';
import { StaticScreenProps } from '@react-navigation/native';
import { Layout, StackHeader } from '@/shared/components/layout';

type PolicyType = 'terms' | 'privacy';

// TODO: 페이지가 언어별 버전을 제공하면 lang 파라미터를 붙인다 (지금은 한국어만)
const POLICY_URLS: Record<PolicyType, string> = {
  terms: 'https://api.domanggaja.site/terms',
  privacy: 'https://api.domanggaja.site/privacy',
};

type PolicyScreenProps = StaticScreenProps<{ type: PolicyType }>;

export default function PolicyScreen({ route }: PolicyScreenProps) {
  const { t } = useTranslation();
  const { type } = route.params;

  return (
    <Layout>
      <StackHeader title={type === 'terms' ? t('setting.terms') : t('setting.privacy')} />
      <WebView source={{ uri: POLICY_URLS[type] }} startInLoadingState style={styles.webview} />
    </Layout>
  );
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
  },
});
