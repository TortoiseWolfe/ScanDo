import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  name: 'AsBuilt LiDAR',
  slug: 'scando',
  version: '0.1.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#000000',
  },
  ios: {
    bundleIdentifier: 'com.asbuilt.lidar',
    supportsTablet: false,
    infoPlist: {
      NSCameraUsageDescription:
        'AsBuilt LiDAR uses the camera with LiDAR for 3D scanning.',
      NSPhotoLibraryUsageDescription:
        'AsBuilt LiDAR saves scan exports to your photo library.',
      NSLocationWhenInUseUsageDescription:
        'AsBuilt LiDAR tags scans with GPS coordinates for georeferenced exports.',
      UIRequiredDeviceCapabilities: ['arkit', 'lidar'],
    },
    config: {
      usesNonExemptEncryption: false,
    },
  },
  web: {
    bundler: 'metro',
    favicon: './assets/icon.png',
  },
  plugins: ['expo-router'],
  scheme: 'scando',
  extra: {
    eas: {
      projectId: '81d92d4c-835c-4b34-ba85-c4512430e955',
    },
  },
  experiments: {
    typedRoutes: true,
  },
});
