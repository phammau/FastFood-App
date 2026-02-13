import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Settings() {
  const [loading, setLoading] = useState(false);

  const confirmLogout = () => {
    if (Platform.OS === 'web') {
      const ok = window.confirm('Bạn có chắc chắn muốn đăng xuất?');
      if (ok) {
        handleLogout();
      }
    } else {
      Alert.alert(
        'Đăng xuất',
        'Bạn có chắc chắn muốn đăng xuất?',
        [
          { text: 'Huỷ', style: 'cancel' },
          {
            text: 'Đăng xuất',
            style: 'destructive',
            onPress: handleLogout,
          },
        ],
        { cancelable: false }
      );
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await AsyncStorage.multiRemove(['token', 'role']);
      router.replace('/(auth)/user-login');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể đăng xuất');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6f00" />
        <Text style={styles.loadingText}>Đang đăng xuất...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {/* Profile */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push('/(admin)/(admin-stack)/profile')}
      >
        <View style={styles.left}>
          <Ionicons name="person-circle-outline" size={22} color="#4f46e5" />
          <Text style={styles.text}>Admin Profile</Text>
        </View>
        <Ionicons name="chevron-forward-outline" size={20} color="#9ca3af" />
      </TouchableOpacity>

      {/* Change Password */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push('/(admin)/(admin-stack)/change-password')}
      >
        <View style={styles.left}>
          <Ionicons name="lock-closed-outline" size={22} color="#f59e0b" />
          <Text style={styles.text}>Change Password</Text>
        </View>
        <Ionicons name="chevron-forward-outline" size={20} color="#9ca3af" />
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity style={styles.card} onPress={confirmLogout}>
        <Ionicons name="log-out-outline" size={22} color="#ef4444" />
        <Text style={[styles.text, { color: '#ef4444' }]}>Logout</Text>
      </TouchableOpacity>
    </View>
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
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 14,
        marginBottom: 12,
        elevation: 2,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    text: {
        marginLeft: 12,
        fontSize: 16,
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 14,
        fontSize: 16,
        color: '#333',
    },
});
