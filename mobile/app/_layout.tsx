import { Stack } from 'expo-router';
import { ThemeProvider } from '../context/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(user-tabs)" />
        <Stack.Screen name="(user-stack)" />
        <Stack.Screen name="(admin)" />
      </Stack>
    </ThemeProvider>
)};
