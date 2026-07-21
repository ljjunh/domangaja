import { ScrollView, StyleSheet } from 'react-native';
import { Text } from '@/shared/components/base';
import { Layout, StackHeader } from '@/shared/components/layout';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';

export default function MyInfoScreen() {
  return (
    <Layout>
      <StackHeader title="내 정보" />
      <ScrollView style={styles.container}>
        <Text typography="t1">MyInfoScreen</Text>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
  },
});
