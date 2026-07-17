import { ScrollView, StyleSheet } from 'react-native';
import { Text } from '@/shared/components/base';
import { Layout } from '@/shared/components/layout';
import { MAIN_TAB_SCREEN_EDGES, SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { useMainTabBarSpace } from '@/shared/hooks/useMainTabBarSpace';

export default function MapScreen() {
  const mainTabBarSpace = useMainTabBarSpace();

  return (
    <Layout edges={MAIN_TAB_SCREEN_EDGES}>
      <ScrollView contentContainerStyle={[styles.container, { paddingBottom: mainTabBarSpace }]}>
        <Text typography="t1">Map Screen</Text>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
  },
});
