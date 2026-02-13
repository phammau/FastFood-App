import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function AddressScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Địa chỉ giao hàng</Text>

      <View style={styles.addressBox}>
        <Text>🏠 Nhà riêng</Text>
        <Text>123 Nguyễn Văn A, Quận 1</Text>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>+ Thêm địa chỉ mới</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  addressBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#ff6f00',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16 },
});
