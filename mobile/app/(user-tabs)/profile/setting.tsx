import { View, Text, StyleSheet, Switch } from 'react-native';
import { useState } from 'react';

export default function SettingsScreen() {
  const [notification, setNotification] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cài đặt</Text>

      <View style={styles.row}>
        <Text>🔔 Nhận thông báo</Text>
        <Switch value={notification} onValueChange={setNotification} />
      </View>

      <View style={styles.row}>
        <Text>🌙 Chế độ tối</Text>
        <Switch />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  row: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
