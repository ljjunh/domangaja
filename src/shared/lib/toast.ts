import Toast from 'react-native-toast-message';

type ToastType = 'success' | 'error' | 'info';

// react-native-toast-message 어댑터 — 호출부는 라이브러리를 모름
export function showToast(type: ToastType, message: string) {
  Toast.show({
    type,
    text1: message,
  });
}

interface PushToastParams {
  title: string | null;
  body: string | null;
  onPress: () => void;
}

/**
 * 포그라운드 푸시 배너. 전역 <Toast>가 position="bottom"이라 여기서 상단으로 덮어쓴다.
 * topOffset을 0으로 두고 SafeArea 인셋은 PushToastView가 더한다
 */
export function showPushToast({ title, body, onPress }: PushToastParams) {
  Toast.show({
    type: 'push',
    text1: title ?? undefined,
    text2: body ?? undefined,
    position: 'top',
    topOffset: 0,
    onPress,
  });
}
