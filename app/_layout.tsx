import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { saveSecureValue } from '../utils/secureStore';

export default function RootLayout() {
  useEffect(() => {
    const saveApiKey = async () => {
      try {
        await saveSecureValue('valentinov', process.env.EXPO_PUBLIC_API_KEY_GROQ as string);
        console.log('API key saved during app initialization.');
      } catch (error) {
        console.error('Failed to save API key:', error);
      }
    };
    saveApiKey();
  })
  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
