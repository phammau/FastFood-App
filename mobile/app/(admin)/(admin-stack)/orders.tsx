import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { API_URL } from '@/constants/api';
import { Alert } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);

  const loadOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/api/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteOrder = async (orderId: number) => {
    try {
      const res = await fetch(`${API_URL}/api/orders/${orderId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      Alert.alert('Thông báo', data.message);

      // cập nhật UI ngay lập tức
      setOrders(prev => prev.filter(order => order.id !== orderId));

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tất cả đơn hàng</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}

        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.orderId}>Đơn {item.id}</Text>

            <Text
              style={[
                styles.status,
                item.status === 'CANCELLED' && styles.cancelled,
                item.status === 'PENDING' && styles.pending,
                item.status === 'COMPLETED' && styles.completed,
              ]}
            >
              {item.status === 'CANCELLED'
                ? 'Đã hủy'
                : item.status === 'PENDING'
                  ? 'Đang xử lý'
                  : 'Hoàn thành'}
            </Text>

            {item.items?.map((food: any, index: number) => (
              <Text key={index}>
                • {food.name} x{food.quantity}
              </Text>
            ))}

            <Text style={styles.total}>
              Tổng: {item.total?.toLocaleString()}đ
            </Text>

            <Text style={styles.time}>
              {new Date(item.createdAt).toLocaleString()}
            </Text>

            {/* 🔥 Nút xóa */}
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() =>
                Alert.alert(
                  'Xác nhận',
                  'Bạn có chắc muốn xóa đơn này?',
                  [
                    { text: 'Hủy', style: 'cancel' },
                    {
                      text: 'Xóa',
                      style: 'destructive',
                      onPress: () => deleteOrder(item.id),
                    },
                  ]
                )
              }
            >
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() =>
                  Alert.alert(
                    'Xác nhận',
                    'Bạn có chắc muốn xóa đơn này?',
                    [
                      { text: 'Hủy', style: 'cancel' },
                      {
                        text: 'Xóa',
                        style: 'destructive',
                        onPress: () => deleteOrder(item.id),
                      },
                    ]
                  )
                }
              >
                <Ionicons name="trash-outline" size={22} color="#ef4444" />
              </TouchableOpacity>

            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },

  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },

  orderId: {
    fontWeight: 'bold',
    marginBottom: 4,
  },

  cancelled: {
    color: 'red',
  },

  pending: {
    color: 'orange',
  },

  completed: {
    color: 'green',
  },
  processBtn: {
    marginTop: 8,
    alignSelf: 'flex-end',
    backgroundColor: '#2563eb',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  processText: {
    color: '#fff',
    fontWeight: '600',
  },

  deleteBtn: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },

  user: { fontWeight: 'bold', marginBottom: 4 },
  status: { color: '#ff6f00', marginBottom: 6 },
  total: { fontWeight: 'bold', marginTop: 6 },
  time: { fontSize: 12, color: '#999', marginTop: 4 },
});
