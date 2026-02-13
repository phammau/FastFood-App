import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OrdersScreen() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const data = await AsyncStorage.getItem('orders');
    if (data) {
      setOrders(JSON.parse(data));
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
          keyExtractor={item => item.id}
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
});
