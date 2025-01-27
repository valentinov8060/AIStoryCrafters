import React , { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import mobileAds from 'react-native-google-mobile-ads';

import { saveSecureValue } from '@/utils/secureStore';
import { initializeDatabase } from '@/utils/storiesDatabase';

export default function RootLayout() {
  useEffect(() => {
    initializeDatabase();
    saveSecureValue(
      process.env.EXPO_PUBLIC_KEY_SECURE_STORE_API_KEY_GROQ as string, 
      process.env.EXPO_PUBLIC_API_KEY_GROQ as string
    );
    mobileAds()
    .initialize()
    .then(adapterStatuses => {
      console.log("Adapters status: ",adapterStatuses);
    });
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
