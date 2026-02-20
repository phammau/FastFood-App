import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

const NOTIFICATIONS = [
  { id: '1', text: 'Đơn hàng #123 đang được giao 🚴‍♂️' },
  { id: '2', text: 'Khuyến mãi 20% cho đơn tiếp theo 🎉' },
];

export default function NotificationsScreen() {
  const { darkMode } = useTheme();

  return (
    <View style={[
      styles.container,
      { backgroundColor: darkMode ? '#121212' : '#f3f4f6' },
    ]}>
      <Text style={[
        styles.title,
        { color: darkMode ? '#fff' : '#000' },
      ]}>Thông báo</Text>

      <FlatList
        data={NOTIFICATIONS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[
            styles.card,
            { backgroundColor: darkMode ? '#1e1e1e' : '#fff' },
          ]}>
            <Text
              style={{
                color: darkMode ? '#e5e5e5' : '#111',
              }}
            >
              {item.text}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
});
