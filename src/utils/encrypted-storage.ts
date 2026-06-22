import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';
import * as SecureStore from 'expo-secure-store';

const KEY_ID = 'eclipsium-master-key';
let _cachedKey: string | null = null;

async function masterKey(): Promise<string> {
  if (_cachedKey) return _cachedKey;
  let k = await SecureStore.getItemAsync(KEY_ID);
  if (!k) {
    k = CryptoJS.lib.WordArray.random(32).toString();
    await SecureStore.setItemAsync(KEY_ID, k);
  }
  _cachedKey = k;
  return k;
}

export const encryptedAsyncStorage = {
  async getItem(name: string): Promise<string | null> {
    const cipher = await AsyncStorage.getItem(name);
    if (!cipher) return null;
    try {
      const key = await masterKey();
      const plain = CryptoJS.AES.decrypt(cipher, key).toString(CryptoJS.enc.Utf8);
      return plain || null;
    } catch {
      return null;
    }
  },
  async setItem(name: string, value: string): Promise<void> {
    const key = await masterKey();
    await AsyncStorage.setItem(name, CryptoJS.AES.encrypt(value, key).toString());
  },
  async removeItem(name: string): Promise<void> {
    await AsyncStorage.removeItem(name);
  },
};
