import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useState, useMemo } from 'react';

export default function OrderStatus() {
  const [active, setActive] = useState('Pending');

  // Demo data (sau này đổi thành API)
  const orders = [
    { id: '1', customer: 'Nguyen Van A', status: 'Pending', total: '250.000đ' },
    { id: '2', customer: 'Tran Thi B', status: 'Shipping', total: '540.000đ' },
    { id: '3', customer: 'Le Van C', status: 'Completed', total: '120.000đ' },
    { id: '4', customer: 'Pham Van D', status: 'Cancelled', total: '300.000đ' },
    { id: '5', customer: 'Hoang Thi E', status: 'Cancelled', total: '200.000đ' },
  ];

  const statuses = ['Pending', 'Shipping', 'Completed', 'Cancelled'];

  // Lọc theo status đang chọn
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => order.status === active);
  }, [active]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Status</Text>

      {/* Status Buttons */}
      <View style={styles.tabRow}>
        {statuses.map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.statusBtn,
              active === status && styles.activeBtn,
            ]}
            onPress={() => setActive(status)}
          >
            <Text
              style={[
                styles.statusText,
                active === status && styles.activeText,
              ]}
            >
              {status}
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
            <Text>Total: {item.total}</Text>
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
});
