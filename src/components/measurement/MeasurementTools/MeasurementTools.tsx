import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export type MeasurementTool = 'distance' | 'area' | 'height';

interface MeasurementToolsProps {
  activeTool: MeasurementTool;
  onSelectTool: (tool: MeasurementTool) => void;
}

const TOOLS: { id: MeasurementTool; label: string }[] = [
  { id: 'distance', label: 'Distance' },
  { id: 'area', label: 'Area' },
  { id: 'height', label: 'Height' },
];

const MeasurementTools: React.FC<MeasurementToolsProps> = ({
  activeTool,
  onSelectTool,
}) => {
  return (
    <View style={styles.container}>
      {TOOLS.map((tool) => {
        const isActive = activeTool === tool.id;
        return (
          <Pressable
            key={tool.id}
            style={[styles.tool, isActive && styles.toolActive]}
            onPress={() => onSelectTool(tool.id)}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={`${tool.label} measurement tool`}
          >
            <Text
              style={[styles.toolLabel, isActive && styles.toolLabelActive]}
            >
              {tool.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#111',
    borderRadius: 10,
    padding: 4,
    marginHorizontal: 16,
  },
  tool: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  toolActive: {
    backgroundColor: '#0a7ea4',
  },
  toolLabel: {
    color: '#999',
    fontSize: 14,
    fontWeight: '600',
  },
  toolLabelActive: {
    color: '#fff',
  },
});

export default MeasurementTools;
