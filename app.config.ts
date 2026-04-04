import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  name: 'ScanDo',
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
    bundleIdentifier: 'com.scando.app',
    supportsTablet: false,
    infoPlist: {
      NSCameraUsageDescription:
        'ScanDo uses the camera with LiDAR for 3D scanning.',
      NSPhotoLibraryUsageDescription:
        'ScanDo saves scan exports to your photo library.',
      NSLocationWhenInUseUsageDescription:
        'ScanDo tags scans with GPS coordinates for georeferenced exports.',
      UIRequiredDeviceCapabilities: ['arkit', 'lidar'],
    },
    config: {
      usesNonExemptEncryption: false,
    },
  },
  plugins: ['expo-router', './modules/scando-lidar'],
  scheme: 'scando',
  experiments: {
    typedRoutes: true,
  },
});
