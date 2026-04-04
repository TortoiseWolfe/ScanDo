import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';

interface ExportFormat {
  id: string;
  name: string;
  description: string;
  isPro: boolean;
}

interface ExportFormatPickerProps {
  onSelect: (formatId: string) => void;
  proEnabled: boolean;
}

const EXPORT_FORMATS: ExportFormat[] = [
  {
    id: 'obj',
    name: 'OBJ',
    description: 'Wavefront 3D object format',
    isPro: false,
  },
  {
    id: 'dae',
    name: 'DAE',
    description: 'Collada digital asset exchange',
    isPro: false,
  },
  {
    id: 'stl',
    name: 'STL',
    description: 'Stereolithography mesh format',
    isPro: false,
  },
  {
    id: 'dwg',
    name: 'DWG',
    description: 'AutoCAD drawing format',
    isPro: true,
  },
  {
    id: 'ifc',
    name: 'IFC',
    description: 'Industry Foundation Classes (BIM)',
    isPro: true,
  },
  {
    id: 'ply',
    name: 'PLY',
    description: 'Polygon file with color data',
    isPro: true,
  },
  {
    id: 'pdf',
    name: 'PDF',
    description: '3D PDF document with measurements',
    isPro: true,
  },
  {
    id: 'kml',
    name: 'KML',
    description: 'Google Earth with real-world coordinates',
    isPro: true,
  },
  {
    id: 'geojson',
    name: 'GeoJSON',
    description: 'GIS-compatible georeferenced mesh',
    isPro: true,
  },
];

const ExportFormatPicker: React.FC<ExportFormatPickerProps> = ({
  onSelect,
  proEnabled,
}) => {
  const handlePress = (format: ExportFormat) => {
    if (format.isPro && !proEnabled) return;
    onSelect(format.id);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Export Format</Text>
      {EXPORT_FORMATS.map((format) => {
        const locked = format.isPro && !proEnabled;
        return (
          <Pressable
            key={format.id}
            style={({ pressed }) => [
              styles.row,
              pressed && !locked && styles.rowPressed,
              locked && styles.rowLocked,
            ]}
            onPress={() => handlePress(format)}
            disabled={locked}
            accessibilityRole="button"
            accessibilityLabel={`${format.name} - ${format.description}${locked ? ', requires Pro' : ''}`}
          >
            <View style={styles.formatInfo}>
              <Text style={[styles.formatName, locked && styles.textLocked]}>
                {format.name}
              </Text>
              <Text
                style={[styles.formatDescription, locked && styles.textLocked]}
              >
                {format.description}
              </Text>
            </View>
            {locked && <Text style={styles.lockIcon}>🔒</Text>}
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  heading: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#222',
  },
  rowPressed: {
    backgroundColor: '#111',
  },
  rowLocked: {
    opacity: 0.45,
  },
  formatInfo: {
    flex: 1,
  },
  formatName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  formatDescription: {
    color: '#999',
    fontSize: 13,
    marginTop: 2,
  },
  textLocked: {
    color: '#666',
  },
  lockIcon: {
    fontSize: 16,
    marginLeft: 12,
  },
});

export default ExportFormatPicker;
