import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';

function TabIcon({
  name,
  focused,
}: {
  name: 'scan' | 'library' | 'settings';
  focused: boolean;
}) {
  const icons = {
    scan: '⬡',
    library: '▦',
    settings: '⚙',
  };

  return (
    <View style={styles.iconContainer}>
      <View
        style={[
          styles.iconDot,
          focused && styles.iconDotActive,
          name === 'scan' && focused && styles.iconDotScan,
        ]}
      />
      <View style={styles.iconTextWrap}>
        <View style={[styles.iconInner, { opacity: focused ? 1 : 0.4 }]}>
          <View style={styles.iconText}>
            {/* Using unicode geometric shapes for a technical feel */}
            {name === 'scan' && (
              <View style={[styles.scanIcon, focused && styles.scanIconActive]}>
                <View style={styles.scanIconInner} />
              </View>
            )}
            {name === 'library' && (
              <View style={[styles.gridIcon, focused && styles.gridIconActive]}>
                <View style={styles.gridDot} />
                <View style={styles.gridDot} />
                <View style={styles.gridDot} />
                <View style={styles.gridDot} />
              </View>
            )}
            {name === 'settings' && (
              <View
                style={[styles.gearIcon, focused && styles.gearIconActive]}
              />
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background.primary,
          borderBottomWidth: 0,
          shadowOpacity: 0,
          elevation: 0,
        } as Record<string, unknown>,
        headerTitleStyle: {
          color: colors.text.primary,
          fontSize: 17,
          fontWeight: '600' as const,
          letterSpacing: 0.5,
        },
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: colors.background.primary,
          borderTopWidth: 1,
          borderTopColor: colors.border.light,
          height: 72,
          paddingBottom: 12,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.accent.secondary,
        tabBarInactiveTintColor: colors.text.tertiary,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600' as const,
          letterSpacing: 1.2,
          textTransform: 'uppercase' as const,
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="scan"
        options={{
          title: 'SCAN',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon name="scan" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'LIBRARY',
          headerTitle: 'Scan Library',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="library" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'CONFIG',
          headerTitle: 'Configuration',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="settings" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 28,
  },
  iconDot: {
    position: 'absolute',
    top: -4,
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'transparent',
  },
  iconDotActive: {
    backgroundColor: colors.accent.secondary,
  },
  iconDotScan: {
    backgroundColor: colors.accent.secondary,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  iconTextWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Scan icon: crosshair/reticle shape
  scanIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.text.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanIconActive: {
    borderColor: colors.accent.secondary,
  },
  scanIconInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.text.tertiary,
  },
  // Library icon: 2x2 grid
  gridIcon: {
    width: 20,
    height: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridIconActive: {
    opacity: 1,
  },
  gridDot: {
    width: 8,
    height: 8,
    borderRadius: 2,
    backgroundColor: colors.text.tertiary,
  },
  // Settings icon: circle with border
  gearIcon: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.text.tertiary,
  },
  gearIconActive: {
    borderColor: colors.accent.secondary,
  },
});
