import { View, Text, StyleSheet } from 'react-native';

export default function HelpScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trung tâm trợ giúp</Text>

      <View style={styles.box}>
        <Text>❓ Câu hỏi thường gặp</Text>
        <Text>📞 Liên hệ hỗ trợ</Text>
        <Text>📜 Điều khoản & chính sách</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  box: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
  },
});
