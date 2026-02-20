import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

export default function AddressScreen() {
  const { darkMode } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: darkMode ? '#121212' : '#f5f5f5' },
      ]}
    >
      <Text
        style={[
          styles.title,
          { color: darkMode ? '#fff' : '#000' },
        ]}
      >
        Địa chỉ giao hàng
      </Text>

      <View
        style={[
          styles.addressBox,
          { backgroundColor: darkMode ? '#1e1e1e' : '#fff' },
        ]}
      >
        <Text style={{ color: darkMode ? '#fff' : '#000' }}>
          🏠 Nhà riêng
        </Text>
        <Text style={{ color: darkMode ? '#ccc' : '#555' }}>
          123 Nguyễn Văn A, Quận 1
        </Text>
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
