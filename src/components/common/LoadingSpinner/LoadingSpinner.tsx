import React from 'react';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';

interface LoadingSpinnerProps {
  label?: string;
  size?: 'small' | 'large';
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label,
  size = 'large',
  color = '#2563eb',
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {label && <Text style={styles.label}>{label}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  label: {
    color: '#ffffff',
    fontSize: 14,
    marginTop: 12,
  },
});

export default LoadingSpinner;
