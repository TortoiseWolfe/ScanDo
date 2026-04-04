# ScanDo

> As-built. LiDAR scanning for iPhone Pro with SketchUp-ready export.

## What is ScanDo?

ScanDo turns your iPhone's LiDAR sensor into a professional 3D scanner. Point your phone at a room, and ScanDo captures the geometry as a mesh you can import directly into SketchUp, Blender, AutoCAD, or Revit.

**Target users**: Architects, contractors, and remodelers who bill by the hour and need quick as-built documentation.

## Features

### Free (forever, no account required)

- Unlimited scans
- Real-time mesh preview
- OBJ, DAE/Collada, STL export
- Basic scan library
- AirDrop / Files / email sharing

### Pro — $9.99/month or $79 one-time

- Multi-scan stitching (combine scans into one model)
- Auto mesh cleanup (noise reduction, hole filling, simplification)
- Floor plan generation (2D plan from scan)
- Measurement tools (distance, area, height on mesh)
- CAD-ready export: DWG, IFC, PLY, PDF floor plan
- Cloud backup + cross-device sync
- Batch export (multiple scans, multiple formats)
- Scan annotations (notes + markers on mesh)
- Geolocation tagging (GPS + ARGeoTracking in supported cities)
- Georeferenced export: KML (Google Earth), GeoJSON (GIS)

## Requirements

- iPhone 12 Pro or later (LiDAR required)
- iOS 17+

## Development

### Prerequisites

- Node.js >= 22.0.0
- pnpm 10.16.1
- For iOS builds: macOS with Xcode 16+ or EAS Cloud

### Setup

```bash
pnpm install
pnpm start         # Start Expo dev server
pnpm test          # Run tests
pnpm typecheck     # TypeScript check
pnpm lint          # ESLint
```

### iOS Build (no Mac required)

ScanDo uses EAS Cloud Build — Apple hardware in the cloud compiles the app.
No Mac, no Xcode install needed locally.

**One-time setup:**

```bash
npx expo login -u YourUsername    # Log in to Expo
pnpm add -g eas-cli               # Install EAS CLI
```

**Build:**

```bash
eas build --platform ios --profile development   # Dev build
eas build --platform ios --profile production     # App Store build
eas submit --platform ios                         # Submit to App Store
```

**Apple Developer Program ($99/year) is required** for code signing.
Without it, EAS builds will fail at the signing step. Enroll at
[developer.apple.com/programs](https://developer.apple.com/programs/)
when you're ready to ship. Everything else (TypeScript, tests, lint)
works without it.

**Local macOS build (alternative):**

```bash
npx expo run:ios    # Requires macOS + Xcode 16+
```

## Architecture

```
src/app/          # Screens (expo-router file-based routing)
src/components/   # Reusable UI components
src/hooks/        # React hooks (native bridge, state)
src/services/     # Business logic
src/stores/       # Zustand state management
src/types/        # TypeScript definitions
modules/          # Native Swift modules (ARKit, StoreKit, CloudKit)
```

## Stack

- Expo SDK 53 (bare workflow)
- React Native 0.79 + React 19
- TypeScript (strict)
- Swift 5.9+ (native modules via Expo Modules API)
- New Architecture (Fabric + JSI)
- StoreKit 2 (payments)
- iCloud CloudKit (cloud backup)

## Export Formats

| Format  | Tier | Use Case                      |
| ------- | ---- | ----------------------------- |
| OBJ     | Free | SketchUp direct import        |
| DAE     | Free | SketchUp + Blender            |
| STL     | Free | 3D printing                   |
| DWG     | Pro  | AutoCAD                       |
| IFC     | Pro  | BIM workflows                 |
| PLY     | Pro  | Point cloud                   |
| PDF     | Pro  | Floor plan                    |
| KML     | Pro  | Google Earth (georeferenced)  |
| GeoJSON | Pro  | GIS workflows (georeferenced) |

## License

Proprietary. All rights reserved.
