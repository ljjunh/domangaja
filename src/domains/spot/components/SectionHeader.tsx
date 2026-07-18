import { StyleSheet, View } from 'react-native';
import { Text, Pressable } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';

interface SectionHeaderProps {
  title: string;
  onPressSeeAll: () => void;
}

export default function SectionHeader({ title, onPressSeeAll }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text typography="t6" weight="semiBold">
        {title}
      </Text>
      <Pressable onPress={onPressSeeAll} hitSlop={8} style={styles.seeAllButton}>
        <Text typography="st13" weight="medium" color={colors.grey[500]}>
          전체보기 {'>'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  seeAllButton: {
    alignSelf: 'flex-end',
  },
});
