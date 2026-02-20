import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { API_URL } from '@/constants/api';
import * as Linking from 'expo-linking';

type PaymentMethod = 'COD' | 'MOMO' | 'BANK';

type CartItem = {
  foodId: number;
  foodName: string;
  size: string;
  quantity: number;
  price: number;
};

export default function PaymentScreen() {
  const [userId, setUserId] = useState<number | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [method, setMethod] =
    useState<PaymentMethod>('COD');

  const canPay = cart.length > 0;

  useEffect(() => {
    const loadData = async () => {

      // load user
      const userJson = await AsyncStorage.getItem('user');
      if (userJson) {
        const user = JSON.parse(userJson);
        console.log('USER STORAGE:', user);
        setUserId(user.id);
      }

      //load cart
      const cartJson = await AsyncStorage.getItem('cart');
      const cartData = cartJson ? JSON.parse(cartJson) : [];
      console.log('CART STORAGE:', cartData);
      setCart(cartData);
  };
    loadData();
  }, []);


  //  tính total 
  const total = cart.reduce(
     (sum, item) => sum + (item.price ?? 0) * item.quantity,
    0
  );

  const handleConfirmPay = async () => {
    try {
      if (!userId) {
        alert('Không tìm thấy user');
        return;
      }

      if (cart.length === 0) {
        alert('Giỏ hàng trống');
        return;
      }

      //KT MỞ APP THANH TOÁN
      if (method === 'MOMO') {
        const momoUrl = 'momo://';
        const supported = await Linking.canOpenURL(momoUrl);

        if (supported) {
          await Linking.openURL(momoUrl);
        } else {
          alert('Chưa cài app MoMo');
          router.replace('/(user-tabs)/home');
          return; 
        }
      }

      if (method === 'BANK') {
        const bankUrl = 'mbbank://'; // có thể đổi sang ngân hàng khác

        const supported = await Linking.canOpenURL(bankUrl);

        if (supported) {
          await Linking.openURL(bankUrl);
        } else {
          alert('Chưa cài app ngân hàng');
          router.replace('/(user-tabs)/home');
          return;
        }
      }
      
      // chi tao don khi mo app ok
      const res = await axios.post(`${API_URL}/api/orders`, {
        user_id: userId, // lấy từ auth
        items: cart.map(item => ({
          food_id: item.foodId,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      const orderId = res.data.order_id;

      // clear cart
      await AsyncStorage.removeItem('cart');

      // COD thi ko can mo app
      router.replace({
        pathname: '/(user-stack)/pay-result',
        params: {
          method,
          orderId,
        },
      });

    } catch (err) {
      console.log('Lỗi tạo đơn hàng:', err);
      alert('Thanh toán thất bại');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xác nhận đơn hàng</Text>

      <ScrollView
        style={styles.card}
        showsVerticalScrollIndicator={false}
      >
        {cart.map((item, index) => (
          <View style={styles.rowLine} key={index}>
            <Text style={styles.foodName} numberOfLines={1}>
              🍔 {item.foodName}
            </Text>

            <Text style={styles.meta}>
              Size {item.size} | SL: {item.quantity}
            </Text>
          </View>
        ))}

        <Text style={styles.total}>
          Tổng tiền: {total.toLocaleString()}đ
        </Text>
      </ScrollView>

      <Text style={styles.section}>
        Hình thức thanh toán
      </Text>

      {(['COD', 'MOMO', 'BANK'] as PaymentMethod[]).map(
        m => (
          <TouchableOpacity
            key={m}
            style={[
              styles.method,
              method === m && styles.methodActive,
            ]}
            onPress={() => setMethod(m)}
          >
            <Text
              style={[
                styles.methodText,
                method === m &&
                styles.methodTextActive,
              ]}
            >
              {m === 'COD'
                ? '💵 Thanh toán khi nhận hàng'
                : m === 'MOMO'
                  ? '📱 Ví MoMo'
                  : '🏦 Chuyển khoản ngân hàng'}
            </Text>
          </TouchableOpacity>
        )
      )}

      <TouchableOpacity
        disabled={!canPay}
        style={[
          styles.payButton,
          !canPay && { opacity: 0.5 },
        ]}
        onPress={handleConfirmPay}
      >
        <Text style={styles.payText}>
          Xác nhận & Thanh toán
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f6f6f6',
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },

  row: {
    fontSize: 16,
    marginBottom: 8,
  },

  value: {
    fontWeight: 'bold',
    color: '#ff6f00',
  },

  section: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },

  method: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },

  methodActive: {
    borderColor: '#ff6f00',
    backgroundColor: '#fff5ee',
  },

  methodText: {
    fontSize: 15,
  },

  methodTextActive: {
    color: '#ff6f00',
    fontWeight: '600',
  },

  payButton: {
    marginTop: 20,
    backgroundColor: '#ff6f00',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
  },

  payText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  total: {
    marginTop: 12,
    fontSize: 17,
    fontWeight: 'bold',
    color: '#ff6f00',
  },
  rowLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  foodName: {
    flex: 1,            
    fontSize: 16,
    marginRight: 8,
  },

  meta: {
    fontSize: 15,
    color: '#555',
  },
});
