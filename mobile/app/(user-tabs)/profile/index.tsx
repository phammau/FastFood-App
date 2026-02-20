import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../../context/ThemeContext';

export default function ProfileScreen() {
  const { darkMode } = useTheme();

  return (
    <View style={[
      styles.container,
      { backgroundColor: darkMode ? '#121212' : '#f5f5f5' },
    ]}>
      <Text style={[
        styles.title,
         { color: darkMode ? '#fff' : '#000' },
      ]}>Tài khoản</Text>

      <Item label="📜 Lịch sử đơn hàng" route="history" />
      <Item label="🔔 Thông báo" route="notifications" />
      <Item label="📍 Địa chỉ giao hàng" route="address" />
      <Item label="⚙️ Cài đặt" route="setting" />
      <Item label="🆘 Trung tâm trợ giúp" route="help" />
      <Item label="🚪 Đăng xuất" route="logout" />
    </View>
  );
}

function Item({ label, route }: { label: string; route: string }) {
  const { darkMode } = useTheme();
  return (
    <TouchableOpacity
      style={[
        styles.item,
        { backgroundColor: darkMode ? '#1e1e1e' : '#fff' },
      ]}
      onPress={() =>
        router.push({
          pathname: '/(user-tabs)/profile/[screen]',
          params: { screen: route },
        })
      }
    >
      <Text style={[
        styles.text,
        { color: darkMode ? '#fff' : '#111' },
      ]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  item: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
  },
  text: { fontSize: 16 },
});
