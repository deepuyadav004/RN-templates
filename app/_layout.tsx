import { View, Text, StyleSheet  } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack } from 'expo-router'
import * as Font from 'expo-font';
import { ActivityIndicator } from 'react-native';

const rootLayout = () => {

  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Gudea-Bold': require('../assets/fonts/Gudea-Bold.ttf'),
        'Gudea-Italic': require('../assets/fonts/Gudea-Italic.ttf'),
        'Gudea-Regular': require('../assets/fonts/Gudea-Regular.ttf'),
        'Overpass-Bold-Italic': require('../assets/fonts/overpass-bold-italic.otf'),
        'SpaceMono-Regular': require('../assets/fonts/SpaceMono-Regular.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
   <Stack>
        <Stack.Screen name='(app)' options={{ headerShown: false }} />
   </Stack>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})


export default rootLayout