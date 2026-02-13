import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/constants/api';

interface Food {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  favorite?: boolean;
}

export default function HomeScreen() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);

  //  LOAD FOODS + FAVORITES MỖI KHI QUAY LẠI HOME
  useFocusEffect(
    useCallback(() => {
      const fetchFoods = async () => {
        try {
          setLoading(true);

          const res = await axios.get(`${API_URL}/api/foods`);
          const json = await AsyncStorage.getItem('favorites');
          const favorites: Food[] = json ? JSON.parse(json) : [];

          const foodsWithFavorite = res.data.map((food: Food) => ({
            ...food,
            favorite: favorites.some(f => f.id === food.id),
          }));

          setFoods(foodsWithFavorite);
        } catch (err) {
          console.log('Fetch foods error:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchFoods();
    }, [])
  );

  //  TOGGLE FAVORITE
  const toggleFavorite = async (food: Food) => {
    try {
      const json = await AsyncStorage.getItem('favorites');
      let favorites: Food[] = json ? JSON.parse(json) : [];

      const exists = favorites.some(item => item.id === food.id);

      if (exists) {
        favorites = favorites.filter(item => item.id !== food.id);
      } else {
        favorites.push(food);
      }

      await AsyncStorage.setItem('favorites', JSON.stringify(favorites));

      setFoods(prev =>
        prev.map(item =>
          item.id === food.id
            ? { ...item, favorite: !item.favorite }
            : item
        )
      );
    } catch (err) {
      console.log('Favorite error:', err);
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#ff6f00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Giao đồ ăn siêu nhanh 🚀</Text>

      <FlatList
        data={foods}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: '/restaurant/[id]',
                params: { id: item.id },
              })
            }
          >
            <Image source={{ uri: item.image }} style={styles.image} />

            <View style={styles.info}>
              <View style={styles.rowBetween}>
                <Text style={styles.name}>{item.name}</Text>

                {/* Tim */}
                <TouchableOpacity
                  onPress={() => toggleFavorite(item)}
                  onPressOut={e => e.stopPropagation()} // tránh click card
                >
                  <Ionicons
                    name={item.favorite ? 'heart' : 'heart-outline'}
                    size={22}
                    color={item.favorite ? 'red' : '#999'}
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.desc}>{item.description}</Text>
              <Text style={styles.price}>
                {item.price.toLocaleString('vi-VN')}đ
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 160,
  },
  info: {
    padding: 12,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  desc: {
    color: '#777',
    marginVertical: 4,
  },
  price: {
    color: '#ff6f00',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
