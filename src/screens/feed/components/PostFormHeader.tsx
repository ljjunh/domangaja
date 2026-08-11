import { StyleSheet, View } from 'react-native';
import { IconButton, TextButton } from '@/shared/components/ui';
import { Text } from '@/shared/components/base';
import { CloseIcon } from '@/assets/icons/common';
import { colors } from '@/shared/constants/colors';

interface PostFormHeaderProps {
  title: string;
  onClose: () => void;
  onShare: () => void;
}

export default function PostFormHeader({ title, onClose, onShare }: PostFormHeaderProps) {
  return (
    <View style={styles.container}>
      <IconButton icon={CloseIcon} label="닫기" onPress={onClose} color={colors.black} />

      <View style={styles.title}>
        <Text typography="t4" weight="semiBold" numberOfLines={1}>
          {title}
        </Text>
      </View>

      <View style={styles.right}>
        <TextButton typography="t6" weight="semiBold" color={colors.blue[500]} onPress={onShare}>
          공유하기
        </TextButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    paddingRight: 15,
  },
  title: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    pointerEvents: 'none',
  },
  right: {
    height: '100%',
    justifyContent: 'center',
  },
});
