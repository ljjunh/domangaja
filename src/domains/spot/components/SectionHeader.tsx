import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text, Pressable } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';

interface SectionHeaderProps {
  title: string;
  onPressSeeAll: () => void;
}

export default function SectionHeader({ title, onPressSeeAll }: SectionHeaderProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text typography="t6" weight="semiBold">
        {title}
      </Text>
      <Pressable onPress={onPressSeeAll} hitSlop={8} style={styles.seeAllButton}>
        <Text typography="st13" weight="semiBold" color={colors.blue[500]}>
          {t('common.seeAll')}
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
