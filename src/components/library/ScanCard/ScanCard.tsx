import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

interface ScanCardProps {
  scanName: string;
  date: string;
  fileSize: string;
  onPress: () => void;
}

const ScanCard: React.FC<ScanCardProps> = ({
  scanName,
  date,
  fileSize,
  onPress,
}) => {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Scan: ${scanName}, ${date}, ${fileSize}`}
    >
      <View style={styles.thumbnail} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {scanName}
        </Text>
        <Text style={styles.meta}>
          {date} &middot; {fileSize}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
  },
  cardPressed: {
    backgroundColor: '#1a1a1a',
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  meta: {
    color: '#999',
    fontSize: 13,
    marginTop: 4,
  },
});

export default ScanCard;
