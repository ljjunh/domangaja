import { NotificationIcon } from '@/assets/icons/common';
import { IconButton } from '@/shared/components/ui';

export default function NotificationButton() {
  return (
    <IconButton
      icon={NotificationIcon}
      label="알림"
      onPress={() => console.log('Notification 이동')}
    />
  );
}
