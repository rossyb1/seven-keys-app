import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';

// Hybrid storage adapter - uses SecureStore for small values, AsyncStorage for large ones
const SECURE_STORE_LIMIT = 2048;

const HybridStorageAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      // First try SecureStore
      const secureValue = await SecureStore.getItemAsync(key);
      if (secureValue !== null) {
        return secureValue;
      }
      // Fall back to AsyncStorage for large values
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('HybridStorage getItem error:', error);
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (value.length > SECURE_STORE_LIMIT) {
        // Large value - use AsyncStorage and clear from SecureStore
        await AsyncStorage.setItem(key, value);
        try {
          await SecureStore.deleteItemAsync(key);
        } catch {}
      } else {
        // Small value - use SecureStore and clear from AsyncStorage
        await SecureStore.setItemAsync(key, value);
        try {
          await AsyncStorage.removeItem(key);
        } catch {}
      }
    } catch (error) {
      console.error('HybridStorage setItem error:', error);
      // Fallback to AsyncStorage if SecureStore fails
      await AsyncStorage.setItem(key, value);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {}
    try {
      await AsyncStorage.removeItem(key);
    } catch {}
  },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: HybridStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
