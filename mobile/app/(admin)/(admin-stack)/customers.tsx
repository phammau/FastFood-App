import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { API_URL } from '@/constants/api';

interface Customer {
  id: number;
  name: string;
  email: string;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/customers`);
      const data: Customer[] = await res.json();
      setCustomers(data);
    } catch (error) {
      console.log('Fetch customers error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete
  const handleDelete = (id: number) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this customer?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await fetch(`${API_URL}/api/admin/customers/${id}`, {
                method: 'DELETE',
              });

              // cập nhật lại state không cần reload API
              setCustomers((prev) => prev.filter((c) => c.id !== id));
            } catch (error) {
              console.log('Delete error:', error);
            }
          },
        },
      ]
    );
  };


  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customers</Text>

      <FlatList<Customer>
        data={customers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Ionicons name="person-circle" size={36} color="#2563eb" />

            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.email}>{item.email}</Text>
            </View>

            {/* Delete button */}
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Ionicons name="trash-outline" size={22} color="#ef4444" />
            </TouchableOpacity>
          </View>

        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb', // nền xám nhạt
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    color: '#111827',
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,

    // shadow iOS
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },

    // shadow Android
    elevation: 3,
  },

  info: {
    marginLeft: 12,
    flex: 1,
  },

  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },

  email: {
    fontSize: 14,
    color: '#6b7280',
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#9ca3af',
  },
});
