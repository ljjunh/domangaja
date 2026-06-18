import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKey } from '@/shared/constants/storageKeys';

export const storage = {
  async get<T>(key: StorageKey): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  async set<T>(key: StorageKey, value: T): Promise<boolean> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  async remove(key: StorageKey): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(error);
    }
  },
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error(error);
    }
  },
};
