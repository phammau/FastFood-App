import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/constants/api';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';


export default function FoodAdd() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);

  // CHECK ADMIN
  useEffect(() => {
    const checkAdmin = async () => {
      const role = await AsyncStorage.getItem('role');
      if (role !== 'ADMIN') {

        if (Platform.OS === 'web') {
          alert('Chỉ ADMIN mới được truy cập');
        } else {
          Alert.alert('Không có quyền', 'Chỉ ADMIN mới được truy cập');
        }
        router.replace('/(auth)/user-login');
      }
    };
    checkAdmin();
  }, []);

  // chon anh
  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Cần quyền truy cập thư viện ảnh');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  //add food
  const handleAdd = async () => {
    if (!name || !price) {
      Platform.OS === 'web'
        ? alert('Vui lòng nhập tên món và giá')
        : Alert.alert('Lỗi', 'Vui lòng nhập tên món và giá');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('price', price);
      formData.append('description', description);

      if (image) {
        formData.append('image', {
          uri: image,
          name: 'food.jpg',
          type: 'image/jpeg',
        } as any);
      }


      const res = await fetch(`${API_URL}/api/foods`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error();

      // RESET FORM
      setName('');
      setPrice('');
      setDescription('');
      setImage(null);

      // SUCCESS + BACK
        Alert.alert('Thành công', 'Thêm sản phẩm thành công 🎉', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      

    } catch (err) {
      Platform.OS === 'web'
        ? alert('Không thêm được sản phẩm')
        : Alert.alert('Lỗi', 'Không thêm được sản phẩm');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>➕ Thêm món ăn</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Tên món</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập tên món"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Giá (VNĐ)</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập giá"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Mô tả</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Mô tả món ăn"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <Text style={styles.label}>Ảnh món ăn</Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#407BFF' }]}
          onPress={pickImage}
        >
          <Text style={styles.buttonText}>📷 Chọn ảnh từ điện thoại</Text>
        </TouchableOpacity>

        {image && (
          <Image
            source={{ uri: image }}
            style={{
              width: '100%',
              height: 200,
              borderRadius: 12,
              marginTop: 12,
            }}
          />
        )}

        <TouchableOpacity style={styles.button} onPress={handleAdd}>
          <Text style={styles.buttonText}>Thêm món 🍔</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f6fa',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#2f3640',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 12,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fafafa',
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#ff6f00',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 24,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
