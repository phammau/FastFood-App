import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

export default function HelpScreen() {
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
        Trung tâm trợ giúp
      </Text>

      <View
        style={[
          styles.box,
          { backgroundColor: darkMode ? '#1e1e1e' : '#fff' },
        ]}
      >
        <Text style={{ color: darkMode ? '#fff' : '#000' }}>
          ❓ Câu hỏi thường gặp
        </Text>

        <Text style={{ color: darkMode ? '#fff' : '#000', marginTop: 10 }}>
          📞 Liên hệ hỗ trợ
        </Text>

        <Text style={{ color: darkMode ? '#fff' : '#000', marginTop: 10 }}>
          📜 Điều khoản & chính sách
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f3f4f6',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  order: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
  },
  orderId: {
    fontWeight: '700',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 6,
  },
  total: {
    fontWeight: '600',
    marginBottom: 6,
  },
  item: {
    fontSize: 14,
    marginLeft: 4,
  },
  completed: {
    marginTop: 8,
    color: '#16a34a',
    fontWeight: '600',
  },
  box: {
    padding: 16,
    borderRadius: 12,
  },
});
