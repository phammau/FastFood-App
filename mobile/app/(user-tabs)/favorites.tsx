import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Food {
  id: number;
  name: string;
  image: string;
  price: number;
}

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<Food[]>([]);

  // LOAD FAVORITES MỖI LẦN VÀO MÀN
  useFocusEffect(
    useCallback(() => {
      const loadFavorites = async () => {
        try {
          const json = await AsyncStorage.getItem('favorites');
          setFavorites(json ? JSON.parse(json) : []);
        } catch (err) {
          console.log('Load favorites error:', err);
        }
      };

      loadFavorites();
    }, [])
  );

  // XOÁ FAVORITE
  const handleDelete = (id: number) => {
    Alert.alert(
      'Xoá món yêu thích',
      'Bạn có chắc muốn xoá món này không?',
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: async () => {
            const newFavorites = favorites.filter(item => item.id !== id);
            setFavorites(newFavorites);
            await AsyncStorage.setItem(
              'favorites',
              JSON.stringify(newFavorites)
            );
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>❤️ Món đã thích</Text>

      <FlatList
        data={favorites}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.empty}>Chưa có món nào được thích</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() =>
              router.push({
                pathname: '/restaurant/[id]',
                params: { id: item.id },
              })
            }
          >
            <Image source={{ uri: item.image }} style={styles.image} />

            <View style={styles.info}>
              <Text style={styles.name} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.price}>
                {item.price.toLocaleString('vi-VN')}đ
              </Text>
            </View>

            {/* NÚT XOÁ */}
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleDelete(item.id)}
            >
              <Ionicons name="trash-outline" size={22} color="#ff3b30" />
            </TouchableOpacity>
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    alignItems: 'center',
  },
  image: {
    width: 90,
    height: 90,
  },
  info: {
    flex: 1,
    padding: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  price: {
    color: '#ff6f00',
    fontWeight: 'bold',
    marginTop: 4,
  },
  deleteBtn: {
    padding: 12,
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
  },
});
