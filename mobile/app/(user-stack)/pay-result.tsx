import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

type CartItem = {
  foodId: number;
  foodName: string;
  size: string;
  quantity: number;
  price: number;
};

export default function PayResultScreen() {
  const { method } = useLocalSearchParams<{ method: string }>();
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const loadCart = async () => {
      const json = await AsyncStorage.getItem('cart');
      setCart(json ? JSON.parse(json) : []);
      await AsyncStorage.removeItem('cart'); // ✅ clear giỏ sau khi đặt
    };
    loadCart();
  }, []);

  const getMethodText = () => {
    switch (method) {
      case 'COD':
        return 'Thanh toán khi nhận hàng';
      case 'MOMO':
        return 'Ví MoMo';
      case 'BANK':
        return 'Chuyển khoản ngân hàng';
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>✅</Text>
      <Text style={styles.title}>Đặt hàng thành công</Text>
      <Text style={styles.desc}>
        Đơn hàng của bạn đã được ghi nhận 🎉
      </Text>

      {/* DANH SÁCH MÓN */}
      <View style={styles.card}>
        {cart.map((item, index) => (
          <View key={index} style={styles.rowLine}>
            <Text
              style={styles.foodName}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              🍔 {item.foodName}
            </Text>

            <Text style={styles.meta}>
              Size {item.size} | SL: {item.quantity}
            </Text>
          </View>
        ))}


        <Text style={styles.row}>
          💳 Thanh toán:{' '}
          <Text style={styles.value}>
            {getMethodText()}
          </Text>
        </Text>
      </View>

      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={() =>
          router.replace('/(user-tabs)/home')
        }
      >
        <Text style={styles.primaryText}>
          Về trang chủ
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryBtn}
        onPress={() =>
          router.replace('/(user-tabs)/orders')
        }
      >
        <Text style={styles.secondaryText}>
          Xem đơn hàng
        </Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f6f6f6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    fontSize: 64,
    marginBottom: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
  },

  desc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },

  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 24,
  },

  row: {
    fontSize: 15,
    marginBottom: 8,
  },

  value: {
    fontWeight: 'bold',
    color: '#ff6f00',
  },

  primaryBtn: {
    width: '100%',
    backgroundColor: '#ff6f00',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    marginBottom: 10,
  },

  primaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  secondaryBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },

  secondaryText: {
    fontSize: 15,
    color: '#333',
  },
  rowLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  foodName: {
    flex: 1,            // 🔥 tên món co giãn
    fontSize: 15,
    marginRight: 8,
  },

  meta: {
    fontSize: 14,
    color: '#555',
  },
});
