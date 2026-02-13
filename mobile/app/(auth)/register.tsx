import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { API_URL } from '@/constants/api';

export default function Register() {
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
            return;
        }

        try {
            setLoading(true);

            const res = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    role: 'USER',
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                Alert.alert('Lỗi', data.message || 'Đăng ký thất bại');
                return;
            }

            Alert.alert('Thành công', 'Đăng ký thành công', [
                { text: 'Đăng nhập', onPress: () => router.replace('/(auth)/user-login') },
            ]);
        } catch (error) {
            Alert.alert('Lỗi', 'Không kết nối được server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đăng ký</Text>

            <TextInput
                placeholder="Họ và tên"
                style={styles.input}
                value={name}
                onChangeText={setName}
            />
            
            <TextInput
                placeholder="Email"
                style={styles.input}
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                placeholder="Mật khẩu"
                style={styles.input}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TextInput
                placeholder="Nhập lại mật khẩu"
                style={styles.input}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />

            <TouchableOpacity
                style={[styles.button, loading && { opacity: 0.6 }]}
                onPress={handleRegister}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.link}>Quay lại đăng nhập</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#ff6f00',
    padding: 14,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  link: {
    marginTop: 16,
    textAlign: 'center',
    color: '#007AFF',
  },
});
