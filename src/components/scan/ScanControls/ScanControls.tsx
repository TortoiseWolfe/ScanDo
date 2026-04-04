import React from 'react';
import { View, StyleSheet } from 'react-native';
import Button from '../../common/Button';

interface ScanControlsProps {
  onStart?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  isScanning?: boolean;
  isPaused?: boolean;
}

const ScanControls: React.FC<ScanControlsProps> = ({
  onStart,
  onPause,
  onStop,
  isScanning = false,
  isPaused = false,
}) => {
  return (
    <View style={styles.container}>
      <Button
        title={isPaused ? 'Resume' : 'Start'}
        onPress={onStart}
        variant="primary"
        disabled={isScanning && !isPaused}
      />
      <Button
        title="Pause"
        onPress={onPause}
        variant="secondary"
        disabled={!isScanning || isPaused}
      />
      <Button
        title="Stop"
        onPress={onStop}
        variant="outline"
        disabled={!isScanning}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    gap: 12,
  },
});

export default ScanControls;
