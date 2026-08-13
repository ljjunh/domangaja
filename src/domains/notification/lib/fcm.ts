import {
  getMessaging,
  getInitialNotification,
  getToken,
  onMessage,
  onNotificationOpenedApp,
  onTokenRefresh,
  type RemoteMessage,
} from '@react-native-firebase/messaging';
import { reportError } from '@/shared/lib/crashlytics';

export type PushMessage = {
  title: string | null;
  body: string | null;
  // 서버가 data 필드에 실어 보내느 값(딥링크 식별자 등
  data: Record<string, unknown>;
};

// 실패(APNs 미등록 등)를 null로 정규화
export const getFcmToken = async (): Promise<string | null> => {
  try {
    const res = await getToken(getMessaging());
    return res;
  } catch (error) {
    // 호출부는 null로 조용히 넘어가므로, 여기서 기록
    reportError(error, 'fcm/getToken');
    return null;
  }
};

export const onFcmTokenRefresh = (listener: (token: string) => void) =>
  onTokenRefresh(getMessaging(), listener);

// 외부 타입(RemoteMessage) -> 우리 타입 정규화는 전부 이 함수로
const toPushMessage = (remoteMessage: RemoteMessage): PushMessage => ({
  title: remoteMessage.notification?.title ?? null,
  body: remoteMessage.notification?.body ?? null,
  data: remoteMessage.data ?? {},
});

export const onForegroundPush = (listener: (message: PushMessage) => void) => {
  return onMessage(getMessaging(), remoteMessage => {
    listener(toPushMessage(remoteMessage));
  });
};

export const onPushOpened = (listener: (message: PushMessage) => void) => {
  // 종료 상태에서 푸쉬알림 탭으로 실행(1회성 조회, 구독 아님)
  getInitialNotification(getMessaging()).then(remoteMessage => {
    if (remoteMessage != null) {
      listener(toPushMessage(remoteMessage));
    }
  });
  // 백그라운드에서 탭(구독)
  return onNotificationOpenedApp(getMessaging(), remoteMessage => {
    listener(toPushMessage(remoteMessage));
  });
};
