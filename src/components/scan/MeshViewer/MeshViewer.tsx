import React from 'react';
import { View, Text, StyleSheet, type ViewStyle } from 'react-native';

interface MeshViewerProps {
  meshUri?: string;
  style?: ViewStyle;
}

const MeshViewer: React.FC<MeshViewerProps> = ({ meshUri, style }) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.viewerArea}>
        <Text style={styles.icon}>🧊</Text>
        <Text style={styles.title}>3D Mesh Viewer</Text>
        <Text style={styles.subtitle}>
          {meshUri
            ? `Loaded: ${meshUri}`
            : 'No mesh loaded — three.js canvas will render here'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  viewerArea: {
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

export default MeshViewer;
