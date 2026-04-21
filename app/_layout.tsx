import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AuthProvider } from '@/contexts/AuthContext';
import { DevicesProvider } from '@/contexts/DevicesContext';
import { TasksProvider } from '@/contexts/TasksContext';
import { ThemeProvider, useAppTheme } from '@/contexts/ThemeContext';

function RootLayoutInner() {
  const { resolvedTheme } = useAppTheme();

  return (
    <NavThemeProvider value={resolvedTheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <DevicesProvider>
          <TasksProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="login" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="scan-device" options={{ presentation: 'modal' }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
            <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />
          </TasksProvider>
        </DevicesProvider>
      </AuthProvider>
    </NavThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutInner />
    </ThemeProvider>
  );
}
