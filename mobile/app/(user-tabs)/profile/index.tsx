import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tài khoản</Text>

      <Item label="📜 Lịch sử đơn hàng" route="history" />
      <Item label="🔔 Thông báo" route="notifications" />
      <Item label="💳 Thanh toán" route="payment" />
      <Item label="📍 Địa chỉ giao hàng" route="address" />
      <Item label="⚙️ Cài đặt" route="settings" />
      <Item label="🆘 Trung tâm trợ giúp" route="help" />
    </View>
  );
}

function Item({ label, route }: { label: string; route: string }) {
  return (
    <TouchableOpacity
      style={styles.item}
    //   onPress={() => router.push(`/(user-tabs)/profile/${route}`)}
    onPress={() =>
        router.push({
          pathname: '/(user-tabs)/profile/[screen]',
          params: { screen: route },
        })
      }
    >
      <Text style={styles.text}>{label}</Text>
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
