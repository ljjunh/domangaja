import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NotificationOutlineIcon } from '@/assets/icons/common';
import { IconButton } from '@/shared/components/ui';

export default function NotificationButton() {
  const { t } = useTranslation();
  const { navigate } = useNavigation();

  return (
    <IconButton
      icon={NotificationOutlineIcon}
      label={t('notification.buttonAccessibilityLabel')}
      onPress={() => navigate('Notification')}
    />
  );
}
