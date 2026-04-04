import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { spacing, borderRadius } from '@/theme/spacing';

interface ScanCardProps {
  scanName: string;
  date: string;
  fileSize: string;
  vertexCount: string;
  onPress: () => void;
}

/**
 * Diamond wireframe thumbnail rendered purely with View borders.
 * 48x48, cyan outline, no images needed.
 */
function WireframeThumbnail() {
  return (
    <View style={thumbnailStyles.container}>
      {/* Outer diamond (rotated square) */}
      <View style={thumbnailStyles.diamondOuter}>
        {/* Inner diamond */}
        <View style={thumbnailStyles.diamondInner} />
      </View>
      {/* Horizontal cross line */}
      <View style={thumbnailStyles.crossH} />
      {/* Vertical cross line */}
      <View style={thumbnailStyles.crossV} />
    </View>
  );
}

const thumbnailStyles = StyleSheet.create({
  container: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diamondOuter: {
    width: 30,
    height: 30,
    borderWidth: 1.5,
    borderColor: colors.accent.secondary,
    transform: [{ rotate: '45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  diamondInner: {
    width: 14,
    height: 14,
    borderWidth: 1,
    borderColor: colors.accent.secondaryDark,
    transform: [{ rotate: '0deg' }],
  },
  crossH: {
    position: 'absolute',
    width: 42,
    height: 1,
    backgroundColor: colors.accent.secondaryDark,
    opacity: 0.25,
  },
  crossV: {
    position: 'absolute',
    width: 1,
    height: 42,
    backgroundColor: colors.accent.secondaryDark,
    opacity: 0.25,
  },
});

const ScanCard: React.FC<ScanCardProps> = ({
  scanName,
  date,
  fileSize,
  vertexCount,
  onPress,
}) => {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Scan: ${scanName}, ${date}, ${fileSize}, ${vertexCount} vertices`}
    >
      {/* Cyan left accent border */}
      <View style={styles.accentBorder} />

      {/* Wireframe thumbnail */}
      <View style={styles.thumbnailWrap}>
        <WireframeThumbnail />
      </View>

      {/* Scan info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {scanName}
        </Text>
        <Text style={styles.meta}>
          {date} {'\u00B7'} {fileSize} {'\u00B7'} {vertexCount} verts
        </Text>
      </View>

      {/* Chevron indicator */}
      <Text style={styles.chevron}>{'\u203A'}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.default,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    paddingLeft: 0,
    overflow: 'hidden',
  },
  cardPressed: {
    backgroundColor: colors.surface.hover,
  },
  accentBorder: {
    width: 3,
    alignSelf: 'stretch',
    backgroundColor: colors.accent.secondary,
    borderTopLeftRadius: borderRadius.sm,
    borderBottomLeftRadius: borderRadius.sm,
  },
  thumbnailWrap: {
    marginLeft: spacing.md,
    marginRight: spacing.md,
  },
  info: {
    flex: 1,
  },
  name: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  meta: {
    color: colors.text.secondary,
    fontSize: 12,
    fontFamily: 'monospace',
    marginTop: spacing.xs,
    letterSpacing: 0.4,
  },
  chevron: {
    color: colors.text.tertiary,
    fontSize: 22,
    fontWeight: '300',
    marginLeft: spacing.sm,
    marginRight: spacing.sm,
  },
});

export default ScanCard;
