import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import products from '../(admin-stack)/products';
import { useEffect, useState } from 'react';
import { API_URL } from '@/constants/api';


export default function AdminHome() {
  const [totalFoods, setTotalFoods] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCompletedOrders, setTotalCompletedOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const fetchTotalFood = async () => {
    try {
      const res = await fetch(`${API_URL}/api/foods/count`);
      const data = await res.json();
      setTotalFoods(data.total);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchTotalUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users/count`);
      const data = await res.json();
      setTotalUsers(data.total);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCompletedOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/api/orders/count/completed`);
      const data = await res.json();
      setTotalCompletedOrders(data.total);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchRevenue = async () => {
    try {
      const res = await fetch(`${API_URL}/api/orders/revenue`);
      const data = await res.json();
      setTotalRevenue(data.total);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTotalFood();
    fetchTotalUsers();
    fetchCompletedOrders();
    fetchRevenue();
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      <Text style={styles.title}>ADMIN FOOD</Text>

      {/* STATISTICS */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Ionicons name="receipt-outline" size={26} color="#2563eb" />
          <Text style={styles.statNumber}>{ totalCompletedOrders }</Text>
          <Text style={styles.statLabel}>Orders</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="people-outline" size={26} color="#16a34a" />
          <Text style={styles.statNumber}>{ totalUsers }</Text>
          <Text style={styles.statLabel}>Users</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Ionicons name="restaurant-outline" size={26} color="#f59e0b" />
          <Text style={styles.statNumber}>{ totalFoods }</Text>
          <Text style={styles.statLabel}>Restaurants</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="cash-outline" size={26} color="#ef4444" />
          <Text style={styles.statNumber}> { Number (totalRevenue).toLocaleString('vi-VN') } đ</Text>
          <Text style={styles.statLabel}>Revenue</Text>
        </View>
      </View>

      {/*QUICK ACTION */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>

      <TouchableOpacity 
        style={styles.card}
        onPress={() => router.push('/(admin)/(admin-stack)/orders')}
      >
        <Ionicons name="list-outline" size={22} color="#111827" />
        <Text style={styles.cardText}>Manage Orders</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.card}
        onPress={() => router.push('/(admin)/(admin-stack)/customers')}
      >
        <Ionicons name="person-outline" size={22} color="#111827" />
        <Text style={styles.cardText}>Manage Users</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.card}
        onPress={() => router.push('/(admin)/(admin-stack)/products')}
      >
        <Ionicons name="restaurant-outline" size={22} color="#111827" />
        <Text style={styles.cardText}>Manage Restaurants</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f3f4f6',
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#111827',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginVertical: 16,
    color: '#111827',
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  statCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 3,
  },

  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
    color: '#111827',
  },

  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
  },

  cardText: {
    marginLeft: 14,
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
});
