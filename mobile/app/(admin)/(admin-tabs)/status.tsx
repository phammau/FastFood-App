import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useState, useMemo } from 'react';
import { useEffect } from 'react';
import { API_URL } from '@/constants/api';


export default function OrderStatus() {
  const [active, setActive] = useState('PENDING');
  const [orders, setOrders] = useState<any[]>([]);

  const statuses = [
  { label: 'Đang xử lý', value: 'PENDING' },
  { label: 'Đang giao', value: 'SHIPPING' },
  { label: 'Hoàn thành', value: 'COMPLETED' },
  { label: 'Đã hủy', value: 'CANCELLED' },
];

  // Lọc theo status đang chọn
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => order.status === active);
  }, [active, orders]);

  const loadOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/api/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.log(err);
    }
  };

  // xu ly don
  const handleProcessOrder = async (orderId: number) => {
    try {
      const res = await fetch(
        `${API_URL}/api/orders/status/${orderId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'SHIPPING' }),
        }
      );

      const data = await res.json();
      console.log(data.message);

      // cập nhật UI ngay
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId
            ? { ...order, status: 'SHIPPING' }
            : order
        )
      );

    } catch (err) {
      console.log(err);
    }
  };

  // giao hàng xong
  const handleCompleteOrder = async (orderId: number) => {
    try {
      const res = await fetch(
        `${API_URL}/api/orders/status/${orderId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'COMPLETED' }),
        }
      );

      const data = await res.json();
      console.log(data.message);

      // cập nhật UI ngay
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId
            ? { ...order, status: 'COMPLETED' }
            : order
        )
      );

    } catch (err) {
      console.log(err);
    }
  };


  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Status</Text>

      {/* Status Buttons */}
      <View style={styles.tabRow}>
        {statuses.map((status) => (
          <TouchableOpacity
            key={status.value}
            style={[
              styles.statusBtn,
              active === status.value && styles.activeBtn,
            ]}
            onPress={() => setActive(status.value)}
          >
            <Text
              style={[
                styles.statusText,
                active === status.value && styles.activeText,
              ]}
            >
              {status.label}
            </Text>
          </TouchableOpacity>
        ))}

      </View>

      {/* Danh sách đơn */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={{ marginTop: 20 }}>
            Không có đơn nào
          </Text>
        }

        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.orderId}>Order {item.id}</Text>
            <Text>Customer: {item.customer}</Text>
            <Text>Total: {Number(item.total).toLocaleString('vi-VN')} đ</Text>

            {/* PENDING -> SHIPPING */}
            {item.status === 'PENDING' && (
              <TouchableOpacity
                style={styles.processBtn}
                onPress={() => handleProcessOrder(item.id)}
              >
                <Text style={styles.processText}>Xác nhận xử lý</Text>
              </TouchableOpacity>
            )}

            {/* SHIPPING -> COMPLETED */}
            {item.status === 'SHIPPING' && (
              <TouchableOpacity
                style={styles.completeBtn}
                onPress={() => handleCompleteOrder(item.id)}
              >
                <Text style={styles.processText}>Đã giao</Text>
              </TouchableOpacity>
            )}

          </View>
        )}
      />
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
    marginBottom: 16,
  },
  tabRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  statusBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    marginRight: 8,
    marginBottom: 8,
  },
  activeBtn: {
    backgroundColor: '#2563eb',
  },
  statusText: {
    fontWeight: '600',
    color: '#374151',
  },
  activeText: {
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
  },
  orderId: {
    fontWeight: '700',
    marginBottom: 6,
  },
  processBtn: {
    marginTop: 10,
    alignSelf: 'flex-end',
    backgroundColor: '#2563eb',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },

  processText: {
    color: '#fff',
    fontWeight: '600',
  },
  completeBtn: {
    marginTop: 10,
    alignSelf: 'flex-end',
    backgroundColor: '#16a34a', 
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
});
