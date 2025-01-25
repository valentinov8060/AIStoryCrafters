import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, ScrollView, Text, View, TouchableOpacity, Modal, TouchableWithoutFeedback } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import * as Clipboard from 'expo-clipboard';

import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { getStoriesFromDatabase, deleteStoryFromDatabase } from '@/utils/storiesDatabase';

export default function Saved() {
  const isFocused = useIsFocused();
  const scrollViewRef = useRef<ScrollView>(null);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const [stories, setStories] = useState<any[]>([]);
  const [modalStory, setModalStory] = useState("");
  const [idForDelete, setIdForDelete] = useState<number>(0);
  const [modalDeleteStoryVisible, setModalDeleteStoryVisible] = useState(false);


  const fetchStories = async () => {
    const storiesFromDatabase = await getStoriesFromDatabase();
    setStories(storiesFromDatabase);
  };

  useEffect(() => {
    if (isFocused) {
      fetchStories();
    }
  }, [isFocused]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? Colors.dark.backgroundScreen : Colors.light.backgroundScreen }}>
      <Text style={[styles.header, { color: isDarkMode ? Colors.dark.text : Colors.light.text }]}>
        Your Saved Stories
      </Text>
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContent}>

      {
        stories.map((story, index) => (
          <TouchableOpacity
            key={story.id}
            onPress={() => {
              setModalStory(story.story)
              setIdForDelete(story.id)
            }}
            style={[styles.storyCard, { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background }]}
          >
            <Text style={[styles.storyCardHeader, { color: isDarkMode ? Colors.dark.icon : Colors.light.icon }]}>
              Synopsis
            </Text>

            <Text style={[styles.storyCardContent, { color: isDarkMode ? Colors.dark.text : Colors.light.text }]}>
              {story.synopsis || "This story doesn't have synopsis."}
            </Text>
          </TouchableOpacity>
        ))
      }

        <Modal
          visible={!! modalStory}
          transparent
          animationType="slide"
          onRequestClose={() => setModalStory("")}
        >
          <View style={[styles.modalStory, { backgroundColor: isDarkMode ? Colors.dark.backgroundScreen : Colors.light.backgroundScreen }]}>
            <View style={[styles.modalStoryHeaderContainer, { backgroundColor: isDarkMode ? Colors.dark.backgroundScreen : Colors.light.backgroundScreen }]}>
              <TouchableOpacity
                onPress={() => setModalStory("")}
              >
                <Ionicons name="arrow-back" size={45} color={isDarkMode ? Colors.dark.icon : Colors.light.icon }/>              
              </TouchableOpacity>

              <Text style={[styles.modalStoryHeaderTitle, { color: isDarkMode ? Colors.dark.text : Colors.light.text }]}>
                The Story
              </Text>
  
              <Entypo name="dots-three-vertical" size={45} color={isDarkMode ? Colors.dark.backgroundScreen : Colors.light.backgroundScreen }/>            
            </View>

              <View style={[styles.modalStoryContentContainer,  {backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background}]}>
                <ScrollView >
                  <Text style={[styles.modalStoryContentText, { color: isDarkMode ? Colors.dark.text : Colors.light.text }]}>
                    {modalStory || "This story doesn't have content."}                  
                  </Text>
                </ScrollView>
                <View style={styles.modalStoryContentAction}> 
                  <FontAwesome5 name="copy" size={32} color={ isDarkMode ? Colors.dark.tint : Colors.light.tint } onPress={async () =>  await Clipboard.setStringAsync("test")} />
                  <FontAwesome5 
                    name="trash" 
                    size={32} 
                    color={ isDarkMode ? Colors.dark.tint : Colors.light.tint } 
                    onPress={async () => {
                      setModalDeleteStoryVisible(true);
                    }} />
                </View>
              </View>
          </View>
        </Modal>

        <Modal
          transparent
          animationType="slide"
          visible={modalDeleteStoryVisible}
          onRequestClose={() => setModalDeleteStoryVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setModalDeleteStoryVisible(false)}>
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background }]}>
                <Text style={[styles.modalText, { color: isDarkMode ? Colors.dark.text : Colors.light.text }]}>Are you sure you want to delete this story?</Text>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: isDarkMode ? Colors.dark.tint : Colors.light.tint }]}
                  onPress={async() => {
                    await deleteStoryFromDatabase(idForDelete);
                    setModalDeleteStoryVisible(false);
                    setModalStory("");
                    fetchStories();
                  }}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    width: '100%',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 10,
    borderBottomColor: 'gray',
    borderBottomWidth: 5,
  },

  storyCard: {
    width: '100%',
    padding: 10,
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 15,
    gap: 10,
  },
  storyCardHeader: {
    width: '100%',
    textAlign: 'center',
    fontSize: 20,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  storyCardContent: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 22,
  },
  modalStory: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  modalStoryHeaderContainer: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalStoryHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold'  
  },
  modalStoryContentContainer: {
    width: '100%',
    height: '93%',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  modalStoryContentText: {
    textAlign: 'justify',
    fontSize: 16,
    lineHeight: 22,
  },
  modalStoryContentAction: {
    borderTopColor: 'gray',
    borderTopWidth: 5,
    paddingVertical: 10,
    paddingHorizontal: 5,
    flexDirection: "row", 
    justifyContent: "flex-end", 
    gap: 15,
  },
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