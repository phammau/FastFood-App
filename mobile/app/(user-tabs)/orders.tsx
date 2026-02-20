import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity, Alert } from 'react-native';


const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/api`;

export default function OrdersScreen() {
  const [orders, setOrders] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [])
  );

  const loadOrders = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      if (!user) return;

      const parsedUser = JSON.parse(user);

      const res = await fetch(
        `${API_URL}/orders/user/${parsedUser.id}`
      );

      const data = await res.json();

      console.log("ORDERS FROM API:", data);

      setOrders(data);
    } catch (err) {
      console.log(err);
    }
  };

  // huy don
  const cancelOrder = async (orderId: number) => {
    try {
      const res = await fetch(
        `${API_URL}/orders/cancel/${orderId}`,
        {
          method: 'PUT',
        }
      );

      const data = await res.json();

      Alert.alert('Thông báo', data.message);

      // Cập nhật trạng thái ngay trên UI
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId
            ? { ...order, status: 'CANCELLED' }
            : order
        )
      );

      loadOrders(); // reload lại danh sách
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đơn hàng của bạn</Text>

      {orders.length === 0 ? (
        <Text style={styles.empty}>Chưa có đơn hàng nào</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item.id.toString()}
            
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.status}>{item.status}</Text>

              {item.items.map((food: any, index: number) => (
                <Text key={index} style={styles.name}>
                  • {food.name} x{food.quantity}
                </Text>
              ))}

              <Text style={styles.total}>
                Tổng tiền: {item.total.toLocaleString()}đ
              </Text>

              <Text style={styles.time}>{item.createdAt}</Text>

              <TouchableOpacity
                style={[
                  styles.cancelBtn,
                  (item.status === 'CANCELLED' || item.status === 'COMPLETED') && styles.disabledBtn,
                ]}
                disabled={item.status === 'CANCELLED' || item.status === 'COMPLETED'}
                onPress={() =>
                  item.status === 'PENDING' &&
                  Alert.alert(
                    'Xác nhận',
                    'Bạn có chắc muốn hủy đơn này?',
                    [
                      { text: 'Không' },
                      {
                        text: 'Hủy đơn',
                        onPress: () => cancelOrder(item.id),
                        style: 'destructive',
                      },
                    ]
                  )
                }
              >
                <Text style={styles.cancelText}>
                  {item.status === 'CANCELLED'
                    ? 'Đã hủy'
                    : item.status === 'COMPLETED'
                      ? 'Đã hoàn thành'
                      : 'Hủy đơn hàng'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  empty: { textAlign: 'center', marginTop: 40, color: '#999' },

  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  status: {
    color: '#ff6f00',
    fontWeight: '600',
    marginBottom: 6,
  },
  name: { fontSize: 15 },
  total: {
    marginTop: 8,
    fontWeight: 'bold',
    color: '#333',
  },
  time: {
    marginTop: 4,
    fontSize: 12,
    color: '#999',
  },
  cancelBtn: {
    marginTop: 10,
    alignSelf: 'flex-end',
    backgroundColor: '#ff3b30',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },

  cancelText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disabledBtn: {
    backgroundColor: '#999',
  },
});
