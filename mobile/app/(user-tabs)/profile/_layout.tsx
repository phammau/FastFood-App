import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Tài khoản' }} />
      <Stack.Screen name="history" options={{ title: 'Lịch sử' }} />
      <Stack.Screen name="notifications" options={{ title: 'Thông báo' }} />
      <Stack.Screen name="address" options={{ title: 'Địa chỉ' }} />
      <Stack.Screen name="setting" options={{ title: 'Cài đặt' }} />
      <Stack.Screen name="help" options={{ title: 'Trợ giúp' }} />
      <Stack.Screen name="logout" options={{ title: 'Đăng xuất' }} />
    </Stack>
  );
}
