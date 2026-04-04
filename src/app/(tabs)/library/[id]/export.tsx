import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function ExportScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Export Scan</Text>
      <Text style={styles.id}>Scan ID: {id}</Text>
      <Text style={styles.subtitle}>Choose an export format</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
  },
  id: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 16,
  },
});
