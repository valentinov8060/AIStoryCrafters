import React from 'react';
import { Tabs } from 'expo-router';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <Tabs screenOptions={{ 
      headerShown: false,
      tabBarActiveTintColor: isDarkMode ? Colors.dark.tabIconSelected : Colors.light.tabIconSelected,
      tabBarInactiveTintColor: isDarkMode ? Colors.dark.tabIconDefault : Colors.light.tabIconDefault,
      tabBarStyle: {
        backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
      }
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Crafting',
          tabBarIcon: ({ color }) => <FontAwesome5 name="pen-alt" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color }) => <FontAwesome5 name="save" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
