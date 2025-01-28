import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { NativeAd, NativeAdView, TestIds } from "react-native-google-mobile-ads";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

const adUnitId = __DEV__ ? TestIds.NATIVE : process.env.EXPO_PUBLIC_ID_NATIVE_ADVANCED_ADS as string;

export default function NativeComponentAds() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const [nativeAd, setNativeAd] = useState<NativeAd | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch native ad data
    NativeAd.createForAdRequest(adUnitId)
      .then((ad) => {
        setNativeAd(ad);
        setError(null);
      })
      .catch((err) => {
        console.error("Native advanced ad failed to load: ", err);
        setError("Failed to load ad.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Display a loading indicator while the ad is being fetched
  if (isLoading) {
    return (
      <View style={styles.adContainer}>
        <ActivityIndicator size="large" color={isDarkMode ? Colors.dark.tint : Colors.light.tint} />
        <Text>Loading ad...</Text>
      </View>
    );
  }

  // Display an error message if the ad failed to load
  if (error) {
    return (
      <View style={styles.adContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Return null if no ad is available
  if (!nativeAd) {
    return null;
  }

  return (
    <NativeAdView nativeAd={nativeAd} style={styles.adContainer}>
      <Text style={styles.adHeadline}>{nativeAd.headline}</Text>
      <Text>{nativeAd.body}</Text>
    </NativeAdView>
  );
}

const styles = StyleSheet.create({
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  adContainer: {
    margin: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  adHeadline: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
});

