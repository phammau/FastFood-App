import { Stack } from 'expo-router';

export default function AdminStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: 'Quay lại',
      }}
    >
      <Stack.Screen
        name="food-add"
        options={{
          title: 'Thêm món ăn',
        }}
      />

      <Stack.Screen
        name="food-edit"
        options={{
          title: 'Sửa món ăn',
        }}
      />
    </Stack>
  );
}
