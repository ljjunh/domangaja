import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <IconButton
        icon={CloseIcon}
        label={t('feed.postForm.close')}
        onPress={onClose}
        color={colors.black}
      />

      <View style={styles.title}>
        <Text typography="t4" weight="semiBold" numberOfLines={1}>
          {title}
        </Text>
      </View>

      <View style={styles.right}>
        <TextButton typography="t6" weight="semiBold" color={colors.blue[500]} onPress={onShare}>
          {t('feed.postForm.share')}
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
