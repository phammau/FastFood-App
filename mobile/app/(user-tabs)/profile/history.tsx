import { View, Text, StyleSheet } from 'react-native';

export default function ProfileHistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lịch sử đơn hàng</Text>

      <View style={styles.order}>
        <Text>🍔 Burger House</Text>
        <Text>Trạng thái: Hoàn thành</Text>
      </View>

      <View style={styles.order}>
        <Text>🍕 Pizza Express</Text>
        <Text>Trạng thái: Đã hủy</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  order: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
});
