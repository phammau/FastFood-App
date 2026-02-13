import { View, Text, StyleSheet } from 'react-native';

export default function PaymentScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Phương thức thanh toán</Text>

      <View style={styles.card}>
        <Text>💳 Ví điện tử</Text>
        <Text>💵 Tiền mặt khi nhận hàng</Text>
        <Text>🏦 Thẻ ngân hàng</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
  },
});
