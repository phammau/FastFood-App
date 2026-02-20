import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../../context/ThemeContext';

export default function ProfileSubScreen() {
  const { screen } = useLocalSearchParams<{ screen: string }>();
  const { darkMode } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: darkMode ? '#121212' : '#f5f5f5' },
      ]}
    >
      <Text
        style={[
          styles.title,
          { color: darkMode ? '#fff' : '#000' },
        ]}
      >
        {screen}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});