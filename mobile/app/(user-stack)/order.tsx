import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

type CartItem = {
  foodId: number;
  foodName: string;
  size: string;
  quantity: number;
  price: number;
};

export default function OrderScreen() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const loadCart = async () => {
      const json = await AsyncStorage.getItem('cart');
      setCart(json ? JSON.parse(json) : []);
    };
    loadCart();
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const deleteItem = async (index: number) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    await AsyncStorage.setItem(
      'cart',
      JSON.stringify(newCart)
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Giỏ hàng</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {cart.length === 0 && (
          <Text style={{ textAlign: 'center', marginTop: 40 }}>
            Giỏ hàng trống 🛒
          </Text>
        )}

        {cart.map((item, index) => (
          <View style={styles.card} key={index}>
            <Image
              source={{
                uri: 'https://via.placeholder.com/120x120.png?text=Food',
              }}
              style={styles.image}
            />

            <View style={styles.info}>
              <Text style={styles.name}>
                {item.foodName}
              </Text>

              <View style={styles.row}>
                <View style={styles.sizeBadge}>
                  <Text style={styles.sizeText}>
                    Size {item.size}
                  </Text>
                </View>

                <Text style={styles.price}>
                  {(item.price ?? 0).toLocaleString()}đ
                </Text>
              </View>

              <View style={styles.bottomRow}>
                <View style={styles.qtyBox}>
                  <Text style={styles.qtyText}>
                    SL: {item.quantity}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => deleteItem(index)}
                >
                  <Text style={styles.deleteText}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* TOTAL */}
      <View style={styles.totalBox}>
        <Text style={styles.totalLabel}>
          Tổng thanh toán
        </Text>
        <Text style={styles.totalPrice}>
          {total.toLocaleString()}đ
        </Text>
      </View>

      {/* BUY MORE */}
      <TouchableOpacity
        style={styles.buyMoreButton}
        onPress={() => router.replace('/(user-tabs)/home')}
      >
        <Text style={styles.buyMoreText}>➕ Mua thêm</Text>
      </TouchableOpacity>

      {/* PAY */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.button,
            cart.length === 0 && { opacity: 0.5 },
          ]}
          disabled={cart.length === 0}
          onPress={() =>
            router.push('/(user-stack)/payment')
          }
        >
          <Text style={styles.buttonText}>
            Tiến hành thanh toán →
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 16,
    paddingBottom: 110, // chừa chỗ cho button
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    marginBottom: 20,
    elevation: 4,
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 16,
    marginRight: 14,
  },

  info: {
    flex: 1,
    justifyContent: 'space-between',
  },

  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sizeBadge: {
    backgroundColor: '#fff3e0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },

  sizeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ff6f00',
  },

  price: {
    fontSize: 15,
    fontWeight: 'bold',
  },

  qtyBox: {
    backgroundColor: '#eee',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },

  qtyText: {
    fontSize: 13,
    fontWeight: '600',
  },

  totalBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  totalLabel: {
    fontSize: 15,
    color: '#555',
  },

  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6f00',
  },

  footer: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
  },

  button: {
    backgroundColor: '#ff6f00',
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 6,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buyMoreButton: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff6f00',
    marginBottom: 10,
  },

  buyMoreText: {
    color: '#ff6f00',
    fontSize: 15,
    fontWeight: 'bold',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },

  deleteText: {
    color: '#ff3b30',
    fontWeight: '600',
  },
});
