import { View, Text, FlatList, StyleSheet } from 'react-native';

const NOTIFICATIONS = [
  { id: '1', text: 'Đơn hàng #123 đang được giao 🚴‍♂️' },
  { id: '2', text: 'Khuyến mãi 20% cho đơn tiếp theo 🎉' },
];

export default function NotificationsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông báo</Text>

      <FlatList
        data={NOTIFICATIONS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{item.text}</Text>
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
