# ScanDo

> As-built. LiDAR scanning for iPhone Pro with SketchUp-ready export.

<a href="https://developer.apple.com/account" target="_blank">Apple Developer Account</a> · <a href="https://expo.dev" target="_blank">Expo Dashboard</a> · <a href="https://developer.apple.com/documentation/arkit" target="_blank">ARKit Docs</a> · <a href="https://docs.expo.dev/build/introduction/" target="_blank">EAS Build Docs</a> · <a href="https://developer.apple.com/storekit/" target="_blank">StoreKit 2</a> · <a href="https://developer.apple.com/icloud/cloudkit/" target="_blank">CloudKit</a> · <a href="https://github.com/TortoiseWolfe/ScanDo" target="_blank">GitHub Repo</a>

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

## App Map

```
┌─────────────────────────────────────────────────┐
│                   TAB BAR                       │
├───────────┬─────────────┬───────────────────────┤
│   SCAN    │   LIBRARY   │        CONFIG         │
└─────┬─────┴──────┬──────┴───────────┬───────────┘
      │            │                  │
      ▼            ▼                  ▼
  ┌────────┐  ┌──────────┐     ┌──────────┐
  │ Scan   │  │ Library  │     │ Settings │
  │ Screen │  │ List     │     │ Screen   │
  │        │  │ (5 scans)│     │ toggles, │
  │ reticle│  │          │     │ quality, │
  │ + SCAN │  │          │     │ units    │
  │ button │  │          │     │          │
  └────────┘  └────┬─────┘     └────┬─────┘
      │            │                │
      │ tap a      │ tap a          │ tap
      │ scan ID    │ scan card      │ "Subscription"
      ▼            ▼                ▼
  ┌────────┐  ┌──────────┐    ┌─────────────┐
  │ Scan   │  │ Scan     │    │ Subscription│
  │ Detail │  │ Detail   │    │ Screen      │
  │        │  │          │    │             │
  │ stats  │  │ stats,   │    │ pricing,    │
  │ grid   │  │ mesh box │    │ features,   │
  └────────┘  └────┬─────┘    │ comparison  │
                   │          └─────────────┘
                   │ tap
                   │ "EXPORT"
                   ▼
              ┌──────────┐
              │ Export   │
              │ Screen   │
              │          │
              │ format   │
              │ picker → │
              │ progress │
              │ → done   │
              └──────────┘
```

| #   | Screen                  | How to get there                    |
| --- | ----------------------- | ----------------------------------- |
| 1   | **Scan**                | SCAN tab (default)                  |
| 2   | **Scan Detail**         | SCAN tab → complete a scan          |
| 3   | **Library**             | LIBRARY tab                         |
| 4   | **Library Scan Detail** | LIBRARY tab → tap any scan card     |
| 5   | **Export**              | LIBRARY tab → scan card → EXPORT    |
| 6   | **Settings**            | CONFIG tab                          |
| 7   | **Subscription**        | CONFIG tab → tap "Subscription" row |

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

## Roadmap

### v2 — Exterior Facade Scanning (Drone Photogrammetry)

- DJI Mobile SDK 5 — waypoint mission builder auto-generates flight paths
- Apple RealityKit Object Capture — on-device photogrammetry, no cloud
- Mesh merge — interior LiDAR + exterior photogrammetry = complete building
- Target hardware: DJI Mini 4 Pro (~$760, under FAA 250g threshold)

### v3 — Complete As-Built Platform

- Multi-device collaborative scanning (multiple iPhones, same structure)
- Web viewer — share a link, client views in browser
- Change detection — rescan over time, diff highlights changes
- BIM integration — publish to Autodesk Construction Cloud, Procore, Revit
- Team workspaces — org accounts, project folders, role-based access
- Report generation — auto-produce PDF site documentation

Full spec: [`docs/ROADMAP.md`](docs/ROADMAP.md)

## License

Proprietary. All rights reserved.
