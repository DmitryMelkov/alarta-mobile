import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useUiStore } from '@store/uiStore';
import { useAuthStore } from '@store/authStore';

export default function RootLayout() {
  const scheme = useColorScheme();
  const isDarkTheme = useUiStore((state) => state.isDarkTheme);
  const initFromStorage = useAuthStore((state) => state.initFromStorage);

  const theme = isDarkTheme ? MD3DarkTheme : MD3LightTheme;

  useEffect(() => {
    void initFromStorage();
  }, [initFromStorage]);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="settings" />
        </Stack>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
