import { Stack } from 'expo-router';

export default function UserStackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="order"
        options={{ title: 'Giỏ hàng' }}
      />
      <Stack.Screen
        name="payment"
        options={{ title: 'Thanh toán' }}
      />
    </Stack>
  );
}
