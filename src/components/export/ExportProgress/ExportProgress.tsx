import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ExportProgressProps {
  progress: number;
  format: string;
  fileName: string;
}

const ExportProgress: React.FC<ExportProgressProps> = ({
  progress,
  format,
  fileName,
}) => {
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const percentage = Math.round(clampedProgress * 100);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exporting</Text>
      <Text style={styles.detail}>
        {fileName}.{format.toLowerCase()}
      </Text>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${percentage}%` }]} />
      </View>

      <Text style={styles.percentage}>{percentage}%</Text>

      {percentage === 100 && (
        <Text style={styles.complete}>Export complete</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    padding: 24,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  detail: {
    color: '#999',
    fontSize: 14,
    marginBottom: 20,
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: '#222',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0a7ea4',
    borderRadius: 3,
  },
  percentage: {
    color: '#0a7ea4',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
  },
  complete: {
    color: '#4caf50',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
});

export default ExportProgress;
