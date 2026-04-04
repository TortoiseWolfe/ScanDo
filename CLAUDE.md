# ScanDo — CLAUDE.md

## Project Overview

LiDAR scanning app for iPhone Pro (12 Pro+). Exports SketchUp-ready 3D models.
Expo bare workflow + React Native + TypeScript + Swift native modules.

## Stack

- **Runtime**: Expo SDK 53, React Native 0.79, React 19
- **Language**: TypeScript (strict), Swift 5.9+
- **Navigation**: expo-router (file-based routing)
- **State**: Zustand v5
- **Native Modules**: Expo Modules API (Swift, in `modules/`)
- **Payments**: StoreKit 2 (Swift)
- **Cloud**: iCloud CloudKit (Swift)

## Development

### NOT Docker-first

Unlike sibling projects (ScriptHammer, SpokeToWork), this is a mobile project.
Run commands directly on host:

```bash
pnpm install
pnpm start
pnpm test
pnpm typecheck
pnpm lint
```

### iOS Builds

TypeScript can be developed on any platform. iOS builds require either:

- macOS with Xcode 16+ (`npx expo run:ios`)
- EAS Cloud Build (`eas build --platform ios`)

LiDAR features require a physical iPhone 12 Pro or later (no simulator support).

### Package Manager

pnpm@10.16.1 (workspace convention). The `.npmrc` sets `node-linker=hoisted`
which is required for Metro bundler compatibility.

## Architecture

### Directory Structure

```
src/app/          # expo-router screens (file-based routing)
src/components/   # Reusable UI components (3-file pattern: index.ts, Component.tsx, Component.test.tsx)
src/hooks/        # Custom React hooks (bridge to native, state)
src/services/     # Business logic (scanner, export, storage, subscription)
src/stores/       # Zustand state stores
src/types/        # TypeScript type definitions
src/utils/        # Utility functions
src/theme/        # Colors, spacing, typography
modules/          # Expo native modules (Swift + TypeScript)
```

### Native Modules

Three Expo Modules in `modules/`:

- **scando-lidar**: ARKit scene reconstruction, mesh extraction, export serialization, geolocation (CoreLocation + ARGeoTracking)
- **scando-storekit**: StoreKit 2 subscription and one-time purchase
- **scando-cloudkit**: iCloud CloudKit backup and sync

Each module has:

- `expo-module.config.json` — Expo autolinking config
- `index.ts` — JS entry point
- `src/` — TypeScript API surface and types
- `ios/` — Swift implementation

### Component Pattern

```
ComponentName/
  index.ts              # Barrel export
  ComponentName.tsx     # Implementation
  ComponentName.test.tsx # Unit test
```

## Testing

- **Unit**: Vitest
- **Component**: @testing-library/react-native
- **Native modules**: Mocked in `__tests__/setup.ts`

## Business Model

- **Free**: Unlimited scans, OBJ/DAE/STL export
- **Pro** ($9.99/mo or $79 one-time): Multi-scan stitching, mesh cleanup, floor plans, measurement tools, CAD export (DWG/IFC), geolocation tagging + geo export (KML/GeoJSON), cloud backup, batch export, annotations

## Target

- iPhone 12 Pro+ (LiDAR required)
- iOS 17+
- No Android (v1)
- No account required for Free tier
