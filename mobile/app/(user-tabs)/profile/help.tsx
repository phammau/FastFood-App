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
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  box: {
    padding: 16,
    borderRadius: 12,
  },
});