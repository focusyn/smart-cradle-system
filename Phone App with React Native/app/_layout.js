import React, { useCallback } from 'react';
import { Slot } from 'expo-router';
import { NativeBaseProvider } from 'native-base';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
SplashScreen.preventAutoHideAsync();
export default function HomeLayout() {
  const [loaded] = useFonts({
    'Roboto-Black': require('../assets/fonts/Roboto-Black.ttf'),
    'Roboto-Bold': require('../assets/fonts/Roboto-Bold.ttf'),
    'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <NativeBaseProvider onLayout={onLayoutRootView}>
      <Slot />
    </NativeBaseProvider>
  );
}
