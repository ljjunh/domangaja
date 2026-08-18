import { useNavigation } from '@react-navigation/native';
import { NotificationOutlineIcon } from '@/assets/icons/common';
import { IconButton } from '@/shared/components/ui';

export default function NotificationButton() {
  const { navigate } = useNavigation();

  return (
    <IconButton
      icon={NotificationOutlineIcon}
      label="알림"
      onPress={() => navigate('Notification')}
    />
  );
}
