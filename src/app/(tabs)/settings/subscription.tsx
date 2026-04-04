import { View, Text, StyleSheet } from 'react-native';

export default function SubscriptionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ScanDo Pro</Text>
      <Text style={styles.price}>$9.99/month or $79 one-time</Text>
      <Text style={styles.subtitle}>
        Multi-scan stitching, mesh cleanup, floor plans, CAD export, and more.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  price: {
    fontSize: 18,
    color: '#0a7ea4',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});
