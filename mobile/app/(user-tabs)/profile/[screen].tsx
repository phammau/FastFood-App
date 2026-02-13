import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function ProfileSubScreen() {
  const { screen } = useLocalSearchParams<{ screen: string }>();

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
        {screen}
      </Text>
    </View>
  );
}
