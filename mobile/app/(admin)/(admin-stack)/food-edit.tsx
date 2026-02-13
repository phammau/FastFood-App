import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { API_URL } from '@/constants/api';
import * as ImagePicker from 'expo-image-picker';
import { Image, Platform } from 'react-native';


export default function FoodEdit() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  
  const [image, setImage] = useState<string | null>(null); // ảnh mới
  const [oldImage, setOldImage] = useState<string>('');    // ảnh cũ

  // LOAD FOOD 
  useEffect(() => {
    if (!id) return;

    fetch(`${API_URL}/api/foods/${id}`)
      .then(res => res.json())
      .then(data => {
        setName(data.name);
        setPrice(String(data.price));
        setDescription(data.description || '');
        setOldImage(data.image || '');
      })
      .catch(() => {
        Alert.alert('Lỗi', 'Không tải được dữ liệu món ăn');
      });
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

  const handleUpdate = async () => {
    if (!name || !price) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên món và giá');
      return;
    }

    try {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('description', description);

    // chi gui file neu chon anh moi
    if (image) {
      formData.append('image', {
        uri: image,
        name: 'food.jpg',
        type: 'image/jpeg',
      } as any);
    }

      const res = await fetch(`${API_URL}/api/foods/${id}`, {
        method: 'PUT',
        body: formData, //không set headers
      });

      if (!res.ok) throw new Error();

      Alert.alert('Thành công', 'Cập nhật món thành công ✨');
      router.back();
    } catch {
      Alert.alert('Lỗi', 'Không cập nhật được món');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>✏️ Sửa món ăn</Text>

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

        <Text style={styles.label}>Ảnh</Text>

        {(image || oldImage) && (
        <Image
            source={{
              uri: image || oldImage,
            }}
            style={{
              width: '100%',
              height: 200,
              borderRadius: 12,
              marginBottom: 12,
            }}
          />
        )}

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#407BFF' }]}
          onPress={pickImage}
        >
          <Text style={styles.buttonText}>📷 Đổi ảnh</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Lưu thay đổi ✨</Text>
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
