import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '@/constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Food = {
  id: number;
  name: string;
  image?: string;
  price: number;
};

type CartItem = {
  foodId: number;
  foodName: string;
  size: Size;
  quantity: number;
  price: number;
};

type Size = 'S' | 'M' | 'L';

export default function RestaurantScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();

  const [food, setFood] = useState<Food | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState<Size>('M');

  const scaleAnim = useRef(new Animated.Value(1)).current;

  // ADD TO CART 
  const addToCart = async () => {
    if (!food) return;

    try {
      const json = await AsyncStorage.getItem('cart');
      const cart: CartItem[] = json ? JSON.parse(json) : [];

      const index = cart.findIndex(
        i => i.foodId === food.id && i.size === size
      );

      if (index !== -1) {
        cart[index].quantity += quantity;
      } else {
        cart.push({
          foodId: food.id,
          foodName: food.name,
          size,
          quantity,
          price: food.price,
        });
      }

      await AsyncStorage.setItem('cart', JSON.stringify(cart));

      router.push('/(user-stack)/order');
    } catch (e) {
      console.log('Add to cart error', e);
    }
  };

  useEffect(() => {
    async function fetchFood() {
      const res = await fetch(`${API_URL}/api/foods/${id}`);
      const data: Food = await res.json();
      setFood(data);
      navigation.setOptions({ title: data.name });
    }
    fetchFood();
  }, [id]);

  const animateQty = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  if (!food) {
    return <Text style={{ padding: 20 }}>Đang tải...</Text>;
  }

  return (
    <View style={styles.container}>
      {/*  CARD  */}
      <View style={styles.card}>
        <Text style={styles.title}>{food.name}</Text>

        {/*  IMAGE (GIỚI HẠN CHIỀU CAO)  */}
        <Image
          source={{
            uri:
              food.image ||
              'https://via.placeholder.com/400x250.png?text=Food',
          }}
          style={styles.image}
        />

        {/*  SIZE */}
        <Text style={styles.sectionTitle}>Chọn size</Text>
        <View style={styles.sizeOptions}>
          {(['S', 'M', 'L'] as Size[]).map(s => (
            <TouchableOpacity
              key={s}
              style={[
                styles.sizeBtn,
                size === s && styles.sizeActive,
              ]}
              onPress={() => setSize(s)}
            >
              <Text
                style={[
                  styles.sizeText,
                  size === s && styles.sizeTextActive,
                ]}
              >
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/*  QUANTITY  */}
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={[
              styles.qtyBtn,
              quantity === 1 && styles.qtyDisabled,
            ]}
            disabled={quantity === 1}
            onPress={() => {
              setQuantity(q => q - 1);
              animateQty();
            }}
          >
            <Text style={styles.qtyText}>−</Text>
          </TouchableOpacity>

          <Animated.Text
            style={[
              styles.quantity,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            {quantity}
          </Animated.Text>

          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => {
              setQuantity(q => q + 1);
              animateQty();
            }}
          >
            <Text style={styles.qtyText}>+</Text>
          </TouchableOpacity>
        </View>

        {/*  SUMMARY  */}
      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Size: <Text style={styles.summaryValue}>{size}</Text>
        </Text>
        <Text style={styles.summaryDivider}>|</Text>
        <Text style={styles.summaryText}>
          Số lượng:{' '}
          <Text style={styles.summaryValue}>{quantity}</Text>
        </Text>
      </View>

      </View>

      {/*  BUTTON */}

      {/* <TouchableOpacity
        style={styles.orderButton}
        onPress={() =>
          router.push({
            pathname: '/(user-stack)/order',
            params: {
              foodId: food.id,
              size,
              quantity,
            },
          })
        }
      >
        <Text style={styles.orderText}>🛒 Thêm vào giỏ hàng </Text>
      </TouchableOpacity> */}
      <TouchableOpacity style={styles.orderButton} onPress={addToCart}>
        <Text style={styles.orderText}>🛒 Thêm vào giỏ hàng</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    padding: 16,
    justifyContent: 'space-between', 
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  image: {
    width: '100%',
    height: 150, //  GIỚI HẠN ẢNH
    borderRadius: 14,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },

  sizeOptions: {
    flexDirection: 'row',
    marginBottom: 12,
  },

  sizeBtn: {
    width: 44,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  sizeActive: {
    backgroundColor: '#ff6f00',
    borderColor: '#ff6f00',
  },

  sizeText: {
    fontSize: 14,
    fontWeight: '600',
  },

  sizeTextActive: {
    color: '#fff',
  },

  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  qtyBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },

  qtyDisabled: {
    opacity: 0.4,
  },

  qtyText: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  quantity: {
    marginHorizontal: 24,
    fontSize: 20,
    fontWeight: 'bold',
  },

  orderButton: {
    backgroundColor: '#ff6f00',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
  },

  orderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  summary: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  summaryText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },

  summaryValue: {
    color: '#ff6f00',
    fontWeight: 'bold',
  },

  summaryDivider: {
    marginHorizontal: 10,
    color: '#aaa',
    fontWeight: 'bold',
  },

});
