import { getMessaging, getToken, onTokenRefresh } from '@react-native-firebase/messaging';

// 실패(APNs 미등록 등)를 null로 정규화
export const getFcmToken = async (): Promise<string | null> => {
  try {
    const res = await getToken(getMessaging());
    return res;
  } catch {
    return null;
  }
};

export const onFcmTokenRefresh = (listener: (token: string) => void) =>
  onTokenRefresh(getMessaging(), listener);
