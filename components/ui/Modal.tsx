import React from 'react';
import { StyleSheet, Text, View, Modal, ActivityIndicator, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';

import { Colors } from '@/constants/Colors';

export function LoadingModal({ isDarkMode, visible, message }:  Readonly<{ isDarkMode: boolean, visible: boolean, message: string }>) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background }]}>
          <ActivityIndicator size="large" color={isDarkMode ? Colors.dark.tint : Colors.light.tint} />
          <Text style={[styles.modalText, {color: isDarkMode ? Colors.dark.text : Colors.light.text }]}>{message}</Text>
        </View>
      </View>
    </Modal>
  )
}

export function ErrorModal({ isDarkMode, message, setMessage }:  Readonly<{ isDarkMode: boolean, message: string, setMessage: (message: string) => void }>) {
  return (
    <Modal
      visible={!! message}
      transparent
      animationType="fade"
      onRequestClose={() => setMessage('')}
    >
      <TouchableWithoutFeedback onPress={() => setMessage('')}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background }]}>
              <Text style={[styles.modalText, { color: isDarkMode ? Colors.dark.text : Colors.light.text }]}>{message}</Text>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: isDarkMode ? Colors.dark.tint : Colors.light.tint }]}
                onPress={() => setMessage('')}
              >
                <Text style={styles.buttonText}>Dismiss</Text>
              </TouchableOpacity>
            </View>
          </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

export function PopupNotificationModal({ isDarkMode, visible, setVisible, message }:  Readonly<{ isDarkMode: boolean, visible: boolean, setVisible: (visible: boolean) => void, message: string }>) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={() => setVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background }]}>
          <Text style={[styles.modalText, { color: isDarkMode ? Colors.dark.text : Colors.light.text }]}>
            {message}
          </Text>
        </View>
      </View>
    </Modal>
  )
}

export function ConfirmationModal({ isDarkMode, visible, setVisible, message, onConfirm }:  Readonly<{ isDarkMode: boolean, visible: boolean, setVisible: (visible: boolean) => void, message: string, onConfirm: () => void }>) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={() => setVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background }]}>
            <Text style={[styles.modalText, { color: isDarkMode ? Colors.dark.text : Colors.light.text }]}>{message}</Text>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: isDarkMode ? Colors.dark.tint : Colors.light.tint }]}
              onPress={onConfirm}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    paddingHorizontal: 10,
    paddingVertical: 20, 
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 55,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 20
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ECEDEE',
  },
});