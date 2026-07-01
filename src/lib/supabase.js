import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const SUPABASE_URL  = 'https://whiejaorazomkbrtwogw.supabase.co';
const SUPABASE_KEY  = 'sb_publishable_c2ZsTijv7QVHvb_NCSJFrA_obUib6nt';

// SecureStore works on iOS/Android; fall back to localStorage on web
const ExpoSecureStoreAdapter = Platform.OS === 'web'
  ? {
      getItem:    (key) => Promise.resolve(localStorage.getItem(key)),
      setItem:    (key, value) => Promise.resolve(localStorage.setItem(key, value)),
      removeItem: (key) => Promise.resolve(localStorage.removeItem(key)),
    }
  : {
      getItem:    (key) => SecureStore.getItemAsync(key),
      setItem:    (key, value) => SecureStore.setItemAsync(key, value),
      removeItem: (key) => SecureStore.deleteItemAsync(key),
    };

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage:          ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession:   true,
    detectSessionInUrl: false,
  },
});
