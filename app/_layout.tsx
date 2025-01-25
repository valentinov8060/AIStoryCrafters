import React , { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { saveSecureValue } from '@/utils/secureStore';
import { initializeDatabase } from '@/utils/storiesDatabase';

export default function RootLayout() {
    useEffect(() => {
      initializeDatabase();
      saveSecureValue(
        process.env.EXPO_PUBLIC_KEY_SECURE_STORE_API_KEY_GROQ as string, 
        process.env.EXPO_PUBLIC_API_KEY_GROQ as string
      );
    }, []);
  
  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
