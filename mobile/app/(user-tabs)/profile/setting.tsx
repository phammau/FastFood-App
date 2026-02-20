import { View, Text, StyleSheet, Switch } from 'react-native';
import { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';

export default function SettingsScreen() {
  const [notification, setNotification] = useState(true);
  const { darkMode, toggleTheme } = useTheme();

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
        Cài đặt
      </Text>

      <View
        style={[
          styles.row,
          { backgroundColor: darkMode ? '#1e1e1e' : '#fff' },
        ]}
      >
        <Text style={{ color: darkMode ? '#fff' : '#000' }}>
          🔔 Nhận thông báo
        </Text>
        <Switch
          value={darkMode}
          onValueChange={toggleTheme}
        />
      </View>

      <View
        style={[
          styles.row,
          { backgroundColor: darkMode ? '#1e1e1e' : '#fff' },
        ]}
      >
        <Text style={{ color: darkMode ? '#fff' : '#000' }}>
          🌙 Chế độ tối
        </Text>
        <Switch
          value={darkMode}
          onValueChange={toggleTheme}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  row: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});