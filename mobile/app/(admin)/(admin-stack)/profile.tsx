import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { useState } from 'react';

export default function AdminProfile() {
  const [name, setName] = useState('Admin');
  const [email, setEmail] = useState('admin@gmail.com');
  const [phone, setPhone] = useState('0382225326');

  const handleSave = () => {
    if (!name || !email) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    Alert.alert('Thành công', 'Cập nhật thông tin thành công');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Admin Profile</Text>

      <View style={styles.avatarContainer}>
        <Image
          source={require('../../../assets/images/profile.png')}
          style={styles.avatar}
        />
      </View>

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Phone</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    color: '#111827',
  },

  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 10,
    color: '#374151',
  },

  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  button: {
    backgroundColor: '#4f46e5',
    padding: 16,
    borderRadius: 14,
    marginTop: 24,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
