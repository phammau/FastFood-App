import { View, Text, StyleSheet, FlatList } from 'react-native';

const orders = [
  { id: '1', customer: 'Nguyen Van A', total: '250.000đ' },
  { id: '2', customer: 'Tran Thi B', total: '180.000đ' },
  { id: '3', customer: 'Le Van C', total: '320.000đ' },
];

export default function OrdersScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order List</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.customer}</Text>
            <Text style={styles.total}>{item.total}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f3f4f6',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  total: {
    marginTop: 4,
    color: '#ef4444',
  },
});
