import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, ScrollView, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import * as Clipboard from 'expo-clipboard';

import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { LoadingModal, ErrorModal, PopupNotificationModal } from '@/components/ui/Modal';
import { Header } from '@/components/ui/Header';
import { craftingStory } from '@/services/groqApi';
import { saveStoryToDatabase } from '@/utils/storiesDatabase';

export default function HomeScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const [storySynopsisValue, setStorySynopsisValue] = useState("");
  const [storyWordsLengthValue, setStoryWordsLengthValue] = useState(600);
  const [storyComplexityValue, setStoryComplexityValue] = useState(5);
  const [storyGenreValue, setStoryGenreValue] = useState("Fantasy");
  const [storyPointOfViewValue, setStoryPointOfViewValue] = useState("Fantasy");

  const [storyResult, setStoryResult] = useState("");
  const [isCraftingStoryLoading, setIsCraftingStoryLoading] = useState(false);
  const [errorCraftingStory, setErrorCraftingStory] = useState("");

  const [popupSaveStoryVisible, setPopupSaveStoryVisible] = useState(false);

  const getStoryResult = async () => {
    setIsCraftingStoryLoading(true);
    try {
      const result = await craftingStory({
        synopsis: storySynopsisValue, 
        wordsLength: storyWordsLengthValue, 
        complexity: storyComplexityValue, 
        genre: storyGenreValue, 
        pointOfView: storyPointOfViewValue
      });
      if (result===null) {
        throw new Error("There was an error while crafting the story. Please try later.");
      }
      setStoryResult(result.toString());

      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: 0, 
          y: 680, 
          animated: true
        });
      }, 500);
    } catch (error) {
      setErrorCraftingStory(error instanceof Error ? error.message : "There was an error while crafting the story. Please try later.");
    } finally {
      setIsCraftingStoryLoading(false);
    } 
  }
  const handleSaveStory = async () => {
    try {
      await saveStoryToDatabase(storySynopsisValue, storyResult);
      setPopupSaveStoryVisible(true);
      setTimeout(() => {
        setPopupSaveStoryVisible(false); 
      }, 2000);
    } catch (error) {
      console.error('Error saving story:', error);
    }
  };

  useEffect(() => {
  }, [storyResult]);

  const inputSlider = ({title, minValue, maxValue, step, value, setValue}: { title: string, minValue: number, maxValue: number, step: number, value: number, setValue: (value: number) => void }): JSX.Element => {
    return (
      <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: isDarkMode ? Colors.dark.text : Colors.light.text }]}>{title}:</Text>
          <Text style={[
            styles.inputSliderValue, 
            { 
              backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background, 
              color: isDarkMode ? Colors.dark.text : Colors.light.text 
            }
          ]}>{value}</Text>
          <Slider
            style={styles.inputSlider}
            minimumValue={minValue} // Nilai minimum
            maximumValue={maxValue} // Nilai maksimum
            step={step} // Langkah perubahan nilai
            value={value} // Nilai slider default
            onValueChange={(value) => setValue(value)} // Update nilai saat slider berubah
            minimumTrackTintColor={ isDarkMode ? Colors.dark.tint : Colors.light.tint } // Warna track di sebelah kiri handle
            maximumTrackTintColor= { isDarkMode ? Colors.dark.background : Colors.light.background } // Warna track di sebelah kanan handle
            thumbTintColor={ isDarkMode ? Colors.dark.tint : Colors.light.tint } // Warna handle
          />
          <View style={styles.inputSliderRangeContainer}>
            <Text style={{ color: isDarkMode ? Colors.dark.text : Colors.light.text }}>{minValue}</Text>
            <Text style={{ color: isDarkMode ? Colors.dark.text : Colors.light.text }}>{maxValue}</Text>
          </View>
        </View>
    )
  }
  const inputPicker = ({title, value, setValue, options}: { title: string, value: string, setValue: (value: string) => void, options: string[] } ): JSX.Element => {
    return (
      <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: isDarkMode ? Colors.dark.text : Colors.light.text }]}>{title}:</Text>
          <Picker
            selectedValue={value}
            onValueChange={(value) => setValue(value)}
            style={[
              styles.inputPickerItem,
              { 
                backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background, 
                color: isDarkMode ? Colors.dark.text : Colors.light.text 
              }
            ]}
          >
            {options.map((option) => (
              <Picker.Item key={option} label={option} value={option} />
            ))}
          </Picker>
        </View>
      )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? Colors.dark.backgroundScreen : Colors.light.backgroundScreen }}>
      <Header isDarkMode={isDarkMode} text="Create your story" />
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContent}>

        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: isDarkMode ? Colors.dark.text : Colors.light.text }]}>Story synopsis:</Text>
          <TextInput
            style={[
              styles.inputText,
              { 
                backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background, 
                color: isDarkMode ? Colors.dark.text : Colors.light.text 
              },
            ]}
            placeholder="Type your story synopsis here"
            placeholderTextColor={isDarkMode ? Colors.dark.text : Colors.light.text}
            multiline
            numberOfLines={8}
            value={storySynopsisValue}
            onChangeText={(value) => setStorySynopsisValue(value)}
          />
        </View>

        {inputSlider({title: 'Story words length', minValue: 200, maxValue: 1000, step: 100, value: storyWordsLengthValue, setValue: setStoryWordsLengthValue})}
        {inputSlider({title: 'Story complexity', minValue: 1, maxValue: 10, step: 1, value: storyComplexityValue, setValue: setStoryComplexityValue})}
        {inputPicker({title: 'Story genre', value: storyGenreValue, setValue: setStoryGenreValue, options: ['Fantasy', 'Horror', 'Mystery', 'Romance', 'Science fiction', 'Comedy', 'Thriller', 'Drama', 'Realistic']})}
        {inputPicker({title: 'Story point of view', value: storyPointOfViewValue, setValue: setStoryPointOfViewValue, options: ['First person point of view', 'Third person point of view']})}

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: isDarkMode ? Colors.dark.tint : Colors.light.tint }]}
          onPress={() => getStoryResult()}
        >
          <Text style={styles.buttonText}>Crafting Story</Text>
        </TouchableOpacity>

        { !!storyResult && (
          <>
            <Header isDarkMode={isDarkMode} text="Result" />

            <View style={[styles.resultContainer, { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background }]}>
              <Text style={[styles.resultText, { color: isDarkMode ? Colors.dark.text : Colors.light.text }]}>
                {storyResult}
              </Text>
              <View style={styles.resultAction}> 
                <FontAwesome5 name="copy" size={32} color={ isDarkMode ? Colors.dark.tint : Colors.light.tint } onPress={async () =>  await Clipboard.setStringAsync(storyResult)} />
                <FontAwesome5 name="save" size={32} color={ isDarkMode ? Colors.dark.tint : Colors.light.tint } onPress={handleSaveStory} />
              </View>
            </View>
          </>
        )}

        <LoadingModal isDarkMode={isDarkMode} visible={isCraftingStoryLoading} message="Crafting your story..." />
        <ErrorModal isDarkMode={isDarkMode} message={errorCraftingStory} setMessage={setErrorCraftingStory} />
        <PopupNotificationModal isDarkMode={isDarkMode} message="Story saved successfully!" visible={popupSaveStoryVisible} setVisible={setPopupSaveStoryVisible} />

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
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'left',
  },
  inputText: {
    width: '100%',
    minHeight: 75,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  inputSliderValue: {
    fontSize: 18,
    textAlign: 'center',
    borderRadius: 5,
  },
  inputSlider: {
    width: '100%',
    marginVertical: 10,
  },
  inputSliderRangeContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputPickerItem: {
    height: 50,
    width: '100%',
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
  resultContainer: {
    width: '100%',
    borderRadius: 10,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 10, 
  },
  resultText: {
    textAlign: 'justify',
    fontSize: 16,
    lineHeight: 20,
  },
  resultAction: {
    borderTopColor: 'gray',
    borderTopWidth: 2,
    paddingVertical: 10,
    flexDirection: "row", 
    justifyContent: "flex-end", 
    gap: 15,
  },
});
