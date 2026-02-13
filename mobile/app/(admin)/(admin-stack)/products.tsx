import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { useEffect } from 'react';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { Platform } from 'react-native';
import { API_URL } from '@/constants/api';


type Product = {
  id: number;
  name: string;
  price: number;
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);

  // useEffect(() => {
  useFocusEffect(
    useCallback(() => {
      fetchFoods();
    }, []));

  const fetchFoods = async () => {
    try {
      const res = await fetch(`${API_URL}/api/foods`);
      const data = await res.json();
      setProducts(data);
    } catch {
      Alert.alert('Lỗi', 'Không tải được danh sách món');
    }
  };

  // DELETE
  const handleDelete = async (id: number) => {
    const doDelete = async () => {
      const res = await fetch(
        `${API_URL}/api/foods/${id}`,
        { method: 'DELETE' }
      );

      if (res.ok) {
        setProducts(prev =>
          prev.filter(item => item.id !== id)
        );
      } else {
        alert('Không xoá được');
      }
    };

    if (Platform.OS === 'web') {
      //WEB
      const ok = window.confirm('Bạn có chắc muốn xoá?');
      if (ok) await doDelete();
    } else {
      //ANDROID / IOS
      Alert.alert(
        'Xoá sản phẩm',
        'Bạn có chắc muốn xoá?',
        [
          { text: 'Huỷ', style: 'cancel' },
          {
            text: 'Xoá',
            style: 'destructive',
            onPress: doDelete,
          },
        ]
      );
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Products</Text>

      {/* ADD */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => router.push('/(admin)/(admin-stack)/food-add')}
      >
        <Ionicons name="add-circle" size={22} color="#fff" />
        <Text style={styles.addText}>Add Product</Text>
      </TouchableOpacity>

      {/* LIST */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>
                {item.price.toLocaleString()} đ
              </Text>
            </View>

            <View style={styles.actions}>
              {/* EDIT */}
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: '/(admin)/(admin-stack)/food-edit',
                    params: { id: item.id },
                  })
                }
              >
                <Ionicons name="create" size={22} color="#2563eb" />
              </TouchableOpacity>

              {/* DELETE */}
              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
              >
                <Ionicons name="trash" size={22} color="#dc2626" />
              </TouchableOpacity>
            </View>
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
    backgroundColor: '#f9fafb',
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },

  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
  },

  addText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },

  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },

  name: {
    fontSize: 16,
    fontWeight: '600',
  },

  price: {
    color: '#6b7280',
  },

  actions: {
    flexDirection: 'row',
    gap: 14,
  },
});
