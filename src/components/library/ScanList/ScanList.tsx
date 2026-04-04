import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import ScanCard from '../ScanCard';

export interface ScanItem {
  id: string;
  scanName: string;
  date: string;
  fileSize: string;
}

interface ScanListProps {
  scans: ScanItem[];
  onSelectScan: (scanId: string) => void;
}

const ScanList: React.FC<ScanListProps> = ({ scans, onSelectScan }) => {
  if (scans.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📷</Text>
        <Text style={styles.emptyTitle}>No scans yet</Text>
        <Text style={styles.emptySubtitle}>
          Start a new scan to see it here
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={scans}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ScanCard
          scanName={item.scanName}
          date={item.date}
          fileSize={item.fileSize}
          onPress={() => onSelectScan(item.id)}
        />
      )}
      style={styles.list}
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: '#000',
  },
  listContent: {
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#999',
    fontSize: 15,
    textAlign: 'center',
  },
});

export default ScanList;
