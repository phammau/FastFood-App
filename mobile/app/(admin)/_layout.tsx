import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(admin-tabs)" />
      <Stack.Screen name="(admin-stack)" />
    </Stack>
  );
}
