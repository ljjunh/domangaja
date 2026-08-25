import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { IconButton } from '@/shared/components/ui';
import { ArrowLeftIcon } from '@/assets/icons/common';
import { Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';

interface StackHeaderProps {
  title?: string;
  left?: string;
  right?: ReactNode;
}

export default function StackHeader({ title, left, right }: StackHeaderProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.side}>
        <IconButton
          icon={ArrowLeftIcon}
          label={t('common.back')}
          onPress={navigation.goBack}
          color={colors.black}
        />
        {!!left && (
          <Text typography="t4" weight="semiBold" numberOfLines={1}>
            {left}
          </Text>
        )}
      </View>
      {title != null && (
        <Text typography="t4" weight="semiBold" numberOfLines={1}>
          {title}
        </Text>
      )}
      <View style={[styles.side, styles.right]}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 15,
    height: 48,
  },
  side: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    justifyContent: 'flex-end',
  },
});
