import { vi } from 'vitest';

// Mock Expo modules that require native code
vi.mock('expo-modules-core', () => ({
  requireNativeModule: (name: string) => {
    const modules: Record<string, Record<string, unknown>> = {
      ScandoLidar: {
        isLidarAvailable: () => false,
        startSession: vi.fn(),
        stopSession: vi.fn(),
        pauseSession: vi.fn(),
        resumeSession: vi.fn(),
        getMeshSnapshot: vi.fn(),
        exportToFile: vi.fn(),
        addListener: vi.fn(),
        removeListeners: vi.fn(),
      },
      ScandoStorekit: {
        getProducts: vi.fn().mockResolvedValue([]),
        purchase: vi.fn(),
        restorePurchases: vi.fn().mockResolvedValue([]),
        getEntitlements: vi
          .fn()
          .mockResolvedValue({ tier: 'free', isActive: false }),
        addListener: vi.fn(),
        removeListeners: vi.fn(),
      },
      ScandoCloudkit: {
        sync: vi.fn(),
        upload: vi.fn(),
        download: vi.fn(),
        listRemoteScans: vi.fn().mockResolvedValue([]),
        addListener: vi.fn(),
        removeListeners: vi.fn(),
      },
    };
    return modules[name] ?? {};
  },
}));

// Mock expo-file-system
vi.mock('expo-file-system', () => ({
  documentDirectory: '/mock/documents/',
  readAsStringAsync: vi.fn(),
  writeAsStringAsync: vi.fn(),
  deleteAsync: vi.fn(),
  getInfoAsync: vi.fn().mockResolvedValue({ exists: false }),
  makeDirectoryAsync: vi.fn(),
  readDirectoryAsync: vi.fn().mockResolvedValue([]),
}));

// Mock expo-haptics
vi.mock('expo-haptics', () => ({
  impactAsync: vi.fn(),
  notificationAsync: vi.fn(),
  selectionAsync: vi.fn(),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
  },
}));

// Mock expo-sharing
vi.mock('expo-sharing', () => ({
  isAvailableAsync: vi.fn().mockResolvedValue(true),
  shareAsync: vi.fn(),
}));

// Mock react-native
vi.mock('react-native', () => ({
  Platform: { OS: 'ios', Version: 17 },
  StyleSheet: {
    create: (styles: Record<string, unknown>) => styles,
  },
  View: 'View',
  Text: 'Text',
  Pressable: 'Pressable',
  TouchableOpacity: 'TouchableOpacity',
  ActivityIndicator: 'ActivityIndicator',
  FlatList: 'FlatList',
  ScrollView: 'ScrollView',
  Alert: { alert: vi.fn() },
  Dimensions: { get: () => ({ width: 390, height: 844 }) },
}));
