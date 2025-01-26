import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { Colors } from '@/constants/Colors';

export function Header({isDarkMode, text}: Readonly<{ isDarkMode: boolean, text: string }>): JSX.Element {
  return (
    <Text style={[styles.header, { color: isDarkMode ? Colors.dark.text : Colors.light.text }]}>
      {text}
    </Text>
  )
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 10,
    borderBottomColor: 'gray',
    borderBottomWidth: 5,
  },
});
