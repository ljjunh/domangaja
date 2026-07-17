import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { IconButton } from '@/shared/components/ui';
import { ArrowLeftIcon } from '@/assets/icons/common';
import { Text } from '@/shared/components/base';

interface StackHeaderProps {
  title?: string;
  right?: ReactNode;
}

export default function StackHeader({ title, right }: StackHeaderProps) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.side}>
        <IconButton icon={ArrowLeftIcon} label="뒤로가기" onPress={navigation.goBack} />
      </View>
      {title != null && (
        <Text typography="t7" weight="medium" numberOfLines={1}>
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
    paddingHorizontal: 15,
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
