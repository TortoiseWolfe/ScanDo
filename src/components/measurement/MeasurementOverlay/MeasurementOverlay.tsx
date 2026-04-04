import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MeasurementOverlayProps {
  value: number;
  unit: string;
  visible: boolean;
}

const MeasurementOverlay: React.FC<MeasurementOverlayProps> = ({
  value,
  unit,
  visible,
}) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay} pointerEvents="none">
      <View style={styles.badge}>
        <Text style={styles.value}>{value.toFixed(2)}</Text>
        <Text style={styles.unit}>{unit}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: 'rgba(10, 126, 164, 0.85)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  value: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  unit: {
    color: '#ccc',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 6,
  },
});

export default MeasurementOverlay;
