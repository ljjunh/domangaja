import { useTranslation } from 'react-i18next';
import { Pressable, Text } from '@/shared/components/base';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/shared/constants/colors';
import { ArrowRightIcon, DoneIcon } from '@/assets/icons/common';

interface LanguageListItemProps {
  nativeName: string;
  description: string;
  selected: boolean;
  onPress: () => void;
}

export default function LanguageListItem({
  nativeName,
  description,
  selected,
  onPress,
}: LanguageListItemProps) {
  const { t } = useTranslation();

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.texts}>
        <Text typography="t6" weight="semiBold">
          {nativeName}
        </Text>
        <Text typography="t7" weight="medium" color={colors.grey[500]}>
          {selected ? t('language.default') : description}
        </Text>
      </View>
      {selected ? (
        <DoneIcon width={24} height={24} color={colors.blue[500]} />
      ) : (
        <ArrowRightIcon width={24} height={24} color={colors.grey[600]} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[100],
  },
  texts: {
    flexShrink: 1,
  },
});
