import React from 'react';
import { View, Text, StyleSheet, type ViewStyle } from 'react-native';

interface ScanPreviewProps {
  style?: ViewStyle;
}

const ScanPreview: React.FC<ScanPreviewProps> = ({ style }) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.previewArea}>
        <Text style={styles.icon}>📡</Text>
        <Text style={styles.title}>LiDAR Preview</Text>
        <Text style={styles.subtitle}>
          Real-time mesh preview will render here
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  previewArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  icon: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: '#6b7280',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ScanPreview;
