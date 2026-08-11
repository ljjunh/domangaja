import { checkNotifications, openSettings, requestNotifications } from 'react-native-permissions';

// OS 알림 권한이 허용 상태인가 (denied/blocked/granted를 boolean으로 정규화)
export const isNotificationPermissionGranted = async (): Promise<boolean> => {
  const { status } = await checkNotifications();
  return status === 'granted';
};

// 시스템 권한 팝업 요청
export const requestNotificationPermission = async (): Promise<boolean> => {
  const { status } = await requestNotifications(['alert', 'sound', 'badge']);
  return status === 'granted';
};

// 시스텝 팝업 기회가 남았으면 팝업요청, 소진됐으면(blocked) 시스템 설정으로
export const enableNotificationPermission = async (): Promise<void> => {
  const { status } = await requestNotifications(['alert', 'sound', 'badge']);
  if (status === 'blocked') {
    await openSettings();
  }
};
