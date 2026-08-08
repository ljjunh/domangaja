import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/shared/constants/storageKeys';

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

// 메모리 사본 - 요청 인터셉터가 동기적으로 읽음
let tokens: Tokens | null = null;

export const tokenStorage = {
  get() {
    return tokens;
  },
  async save(next: Tokens) {
    tokens = next;
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, JSON.stringify(next));
  },
  async clear() {
    tokens = null;
    await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
  },
  // 앱 부팅 시 1회 - 저장돼 있던 토큰을 메모리로  복원
  async load() {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    tokens = raw != null ? (JSON.parse(raw) as Tokens) : null;
    return tokens;
  },
};
