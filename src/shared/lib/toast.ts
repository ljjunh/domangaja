import Toast from 'react-native-toast-message';

type ToastType = 'success' | 'error' | 'info';

// react-native-toast-message 어댑터 — 호출부는 라이브러리를 모름
export function showToast(type: ToastType, message: string) {
  Toast.show({
    type,
    text1: message,
  });
}
