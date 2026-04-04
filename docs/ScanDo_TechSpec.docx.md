| TECHNICAL SPECIFICATION ScanDo As-built. LiDAR scanning for iPhone Pro with SketchUp-ready export. |
| :------------------------------------------------------------------------------------------------: |

| Developer         | Jonathan Pohlner — TurtleWolfe (jonpohlner@gmail.com)                   |
| :---------------- | :---------------------------------------------------------------------- |
| **Brand**         | ScanDo — TurtleWolfe                                                    |
| **Platform**      | iOS (iPhone 12 Pro and newer, LiDAR required)                           |
| **Framework**     | Expo bare workflow (React Native \+ TypeScript \+ Swift native modules) |
| **App Store URL** | https://scando.app (pending)                                            |
| **Builds**        | EAS Cloud (Expo Application Services)                                   |
| **Date**          | April 2026                                                              |

# **1\. Project Vision & Strategic Context**

## **1.1 Core Objective**

ScanDo is a LiDAR scanning app for iPhone Pro that lets architects, contractors, remodelers, and developers capture as-built conditions of physical spaces and export SketchUp-ready 3D models — without a paywall on core functionality, without creating an account, and without bullshit.

## **1.2 Business Services / Offerings**

| Tier                           | Description                                                                                                                                                                                                                           |
| :----------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Free (forever)                 | Unlimited LiDAR scans. OBJ \+ DAE \+ STL export. Basic scan library. AirDrop / Files / email share. No account required. Ever.                                                                                                        |
| Pro — $9.99/mo or $79 one-time | Multi-scan stitching, auto mesh cleanup, floor plan generation, measurement tools, CAD export (DWG/IFC/RVT), cloud backup, batch export, scan annotation, geolocation / KML export. Apple ID via StoreKit 2 only — no separate login. |

## **1.3 Relationship to Other Projects**

ScanDo is a TurtleWolfe product, independent from client work. It is developed alongside SpokeToWork (bicycle-based job hunting PWA) and ScriptHammer (Next.js 15.5 starter kit), sharing workspace conventions: pnpm, TypeScript strict mode, Vitest, ESLint flat config, and spec-driven development.

# **2\. App Architecture & Screen Structure**

## **2.1 Screen Map**

| Route                         | Screen                | Type           | Tier     |
| :---------------------------- | :-------------------- | :------------- | :------- |
| /(tabs)/scan                  | Scan                  | Camera / LiDAR | Free     |
| /(tabs)/scan/\[id\]           | Scan Detail           | Viewer         | Free     |
| /(tabs)/library               | Library               | List           | Free     |
| /(tabs)/library/\[id\]        | Scan Detail (library) | Viewer         | Free     |
| /(tabs)/library/\[id\]/export | Export                | Sheet          | Free/Pro |
| /(tabs)/settings              | Settings              | Form           | Free     |
| /(tabs)/settings/subscription | Subscription          | Paywall        | Pro      |

## **2.2 Tab Navigation**

- Scan — primary camera \+ LiDAR scanning interface

- Library — saved scan history, local \+ cloud (Pro)

- Settings — preferences, subscription management

## **2.3 Native Modules**

| Module          | Language     | Purpose                                                                                                       |
| :-------------- | :----------- | :------------------------------------------------------------------------------------------------------------ |
| scando-lidar    | Swift \+ JSI | ARKit LiDAR mesh capture, extraction, serialization, stitching, cleanup, floor plan, measurement, geolocation |
| scando-storekit | Swift        | StoreKit 2 — subscription \+ one-time purchase, restore, entitlement checking                                 |
| scando-cloudkit | Swift        | iCloud CloudKit — scan backup, cross-device sync, conflict resolution (Pro)                                   |

# **3\. Design & Branding**

| App name      | ScanDo                                                               |
| :------------ | :------------------------------------------------------------------- |
| Tagline       | As-built.                                                            |
| Domain        | scando.app (target)                                                  |
| CSS framework | React Native StyleSheet \+ custom theme tokens                       |
| Color palette | TBD — steampunk/industrial aesthetic aligning with TurtleWolfe brand |
| Typography    | System font (SF Pro) on iOS                                          |
| Icon          | TBD — LiDAR / mesh visual motif                                      |

# **4\. Modules & Functionality**

## **4.1 Free Tier — Core Features**

- Unlimited LiDAR scanning (ARWorldTrackingConfiguration \+ sceneReconstruction: .mesh)

- Real-time mesh preview (three.js / expo-gl)

- Export: OBJ, DAE/Collada, STL

- AirDrop, Files app, email share

- Local scan library with metadata

- No account required

## **4.2 Pro Tier — $9.99/month or $79 one-time**

- Multi-scan stitching — ARWorldMap save/load for session resume; ARKit world origin alignment for multi-pass merging

- Auto mesh cleanup — voxel downsampling, Poisson reconstruction, hole filling, simplification

- Floor plan generation — project mesh to XY plane, trace perimeter, export as PDF

- Measurement tools — tap-to-measure distance, area, height via raycasting against mesh geometry

- CAD-ready export — DWG (AutoCAD), IFC (BIM), RVT-compatible via IFC, PLY point cloud

- Geolocation — CoreLocation GPS tagging at scan time; ARGeoTrackingConfiguration in supported cities; getGeoLocation() for lat/lon/altitude per vertex; KML \+ GeoJSON export (Google Earth compatible)

- Cloud backup — iCloud CloudKit scan sync across devices

- Batch export — multiple scans, multiple formats

- Scan annotation — notes and markers pinned to mesh points

- Authentication — Apple ID via StoreKit 2 only, no separate login

## **4.3 Not Yet Implemented (v2/v3 — See Section 9\)**

| Feature                                 | Phase | Notes                                    |
| :-------------------------------------- | :---- | :--------------------------------------- |
| Drone photogrammetry (exterior facades) | v2    | DJI Mobile SDK 5, Apple Object Capture   |
| Waypoint mission builder                | v2    | Autonomous facade scan flight path       |
| Interior \+ exterior mesh merge         | v3    | Shared georeferenced anchor              |
| Multi-device collaborative scanning     | v3    | Multiple iPhones, same structure         |
| Web viewer (shareable link)             | v3    | Browser, no app required                 |
| Change detection / scan diff            | v3    | Construction progress, damage assessment |
| BIM platform integration                | v3    | Autodesk Construction Cloud, Procore     |
| Team workspace / org accounts           | v3    | Enterprise pricing tier                  |
| Auto PDF site report                    | v3    | Measurements, floor plans, 3D thumbnail  |

# **5\. Infrastructure & Deployment**

## **5.1 Stack**

| Framework       | Expo bare workflow (React Native 0.79, React 19\) |
| :-------------- | :------------------------------------------------ |
| Language        | TypeScript (strict) \+ Swift (native modules)     |
| Navigation      | expo-router (file-based)                          |
| State           | Zustand stores                                    |
| Validation      | Zod                                               |
| 3D Preview      | three.js \+ expo-gl                               |
| AR/LiDAR        | ARKit (iOS native, Swift)                         |
| Payments        | StoreKit 2 (Swift)                                |
| Cloud sync      | iCloud CloudKit (Swift)                           |
| Package manager | pnpm 10.x (node-linker=hoisted for Metro)         |
| Node            | \>=22.0.0                                         |
| Testing         | Vitest \+ @testing-library/react-native           |
| Linting         | ESLint flat config \+ Prettier                    |
| Git hooks       | Husky \+ lint-staged                              |

## **5.2 Deployment**

| Environment       | Details                                      | Notes                                                  |
| :---------------- | :------------------------------------------- | :----------------------------------------------------- |
| Local dev         | TypeScript / JS layer only (Linux/WSL2)      | No Xcode required for JS work                          |
| iOS builds        | EAS Cloud (Expo Application Services)        | Free tier available; Starter $19/mo for priority queue |
| Development build | EAS profile: development (dev client)        | Install on physical iPhone 12 Pro+                     |
| Preview build     | EAS profile: preview (internal distribution) | TestFlight-style internal testing                      |
| Production        | EAS profile: production → App Store          | Apple Developer Program required ($99/yr)              |
| OTA updates       | EAS Update (JS-only changes)                 | Free tier: 1,000 MAU; Starter: 3,000 MAU               |

**5.3 Backup Strategy**

| Method                  | Scope       | Details                                        |
| :---------------------- | :---------- | :--------------------------------------------- |
| On-device storage       | Free \+ Pro | expo-file-system, local scan library           |
| iCloud CloudKit sync    | Pro only    | Automatic background sync, conflict resolution |
| ARWorldMap persistence  | Free \+ Pro | Serialized to disk for session resume          |
| Export to Files/AirDrop | Free \+ Pro | User-initiated; OBJ/DAE/STL/DWG/IFC/KML        |

# **6\. Phase Roadmap**

| Phase 1 — v1 iPhone LiDAR: Interior Scanning |
| :------------------------------------------- |

## **Scope**

- iPhone 12 Pro and newer (LiDAR required), iOS 17+

- Free tier: unlimited scan \+ export (OBJ, DAE, STL) — no account ever

- Pro tier: stitching, cleanup, floor plans, measurements, CAD export, geolocation/KML, cloud backup, annotations

- StoreKit 2 subscription ($9.99/mo) \+ one-time ($79) — Apple ID only

- Expo bare workflow, three Swift native modules, expo-router navigation

- EAS Cloud builds — no macOS required for development

## **Key Swift Components**

| File                      | Purpose                                                    |
| :------------------------ | :--------------------------------------------------------- |
| ARSessionManager.swift    | ARWorldTrackingConfiguration \+ sceneReconstruction: .mesh |
| MeshExtractor.swift       | ARMeshAnchor vertex/face/normal arrays                     |
| MeshSerializer.swift      | OBJ, DAE, STL on-device file writing                       |
| MeshStitcher.swift        | Multi-scan alignment, ARWorldMap save/load (Pro)           |
| MeshCleaner.swift         | Noise reduction, hole filling, simplification (Pro)        |
| FloorPlanExtractor.swift  | Project mesh to XY plane, trace perimeter (Pro)            |
| MeasurementEngine.swift   | Raycasting against mesh geometry (Pro)                     |
| GeoLocationManager.swift  | CoreLocation \+ ARGeoTrackingConfiguration (Pro)           |
| GeoExporter.swift         | KML \+ GeoJSON serialization (Pro)                         |
| SubscriptionManager.swift | StoreKit 2 purchase, restore, status                       |
| CloudSyncManager.swift    | CloudKit upload/download/conflict (Pro)                    |

## **Deliverables**

- CLAUDE.md \+ README.md \+ full scaffold (\~120 files)

- Three Expo native modules (scando-lidar, scando-storekit, scando-cloudkit)

- All screens, hooks, services, stores, types, utils, theme

- Vitest test setup with native module mocks

- EAS build profiles (development, preview, production)

- App Store submission (pending Apple Developer enrollment)

| Phase 2 — v2 Drone Photogrammetry: Exterior Facades |
| :-------------------------------------------------- |

## **Scope**

- Exterior building facade scanning via drone photogrammetry

- Target hardware: DJI Mini 4 Pro (\~$760, under FAA 250g registration threshold)

- DJI Mobile SDK 5 (Swift) — autonomous waypoint mission builder

- User defines facade boundary; app auto-generates grid flight path (70-80% photo overlap)

- Apple RealityKit Object Capture API — on-device photogrammetry, no cloud required

- Output: textured OBJ/USDZ mesh from drone photo set

- Mesh merge: exterior photogrammetry \+ interior LiDAR at shared georeferenced anchor

## **New Swift Components**

| File                          | Purpose                                                  |
| :---------------------------- | :------------------------------------------------------- |
| DJISessionManager.swift       | DJI Mobile SDK 5 integration, drone connection           |
| WaypointMissionBuilder.swift  | Auto-generate facade grid flight path                    |
| PhotogrammetryProcessor.swift | RealityKit Object Capture pipeline                       |
| MeshMerger.swift              | Align \+ merge LiDAR interior \+ photogrammetry exterior |

## **Architectural Constraints (v1 must respect)**

- Scan session management must be decoupled from input source (LiDAR today, photogrammetry tomorrow)

- MeshSerializer must handle meshes from any source, not just ARMeshAnchor

- GeoLocationManager is the single source of truth for world coordinates across all scan types

- Export pipeline must be format-driven, not scan-type-driven

| Phase 3 — v3 Complete As-Built Platform |
| :-------------------------------------- |

## **Scope**

- Full building documentation platform — interior \+ exterior \+ collaboration \+ delivery

- Unified interior LiDAR \+ exterior drone photogrammetry in single georeferenced model

- Multi-device collaborative scanning — multiple iPhones, same structure, stitched via shared georeference

- Web viewer — shareable link, client views 3D model in browser (no app required)

- Change detection — rescan same structure over time, diff highlights changes

- BIM integration — publish to Autodesk Construction Cloud, Procore, Revit API

- Team workspace — org accounts, project folders, role-based access

- Enterprise pricing tier

- Auto PDF site report — measurements, floor plans, photos, 3D thumbnail from single session

## **Architectural Constraints (v1 \+ v2 must respect)**

- Scan metadata schema must be extensible: device ID, operator ID, timestamp, GPS, scan type

- Export pipeline must support streaming large meshes (multi-floor buildings exceed mobile memory)

- CloudKit schema in v1 must anticipate org-level data structures — no hardcoded personal account assumptions

- Web viewer implies public-facing URL — reserve scando.app now

# **7\. Key Contacts & Roles**

| Name                           | Organization | Role                      | Contact              |
| :----------------------------- | :----------- | :------------------------ | :------------------- |
| Jonathan Pohlner (TurtleWolfe) | TurtleWolfe  | Developer / Product Owner | jonpohlner@gmail.com |

# **8\. Deliverables Status**

## **8.1 Complete**

- Product concept and naming (ScanDo, As-built.)

- Business model (Free forever \+ Pro $9.99/mo or $79 one-time)

- Full three-phase tech spec and roadmap

- Claude Code scaffold plan (\~120 files) — approved and executing

- GitHub repo initialized (\~/repos/ScanDo)

## **8.2 In Progress**

- Claude Code full project scaffold (Expo bare, native modules, screens, hooks, services, stores)

- Domain registration — scando.app (pending)

## **8.3 Pending**

| \#  | Item                                                                 | Owner    |
| :-- | :------------------------------------------------------------------- | :------- |
| 1   | Apple Developer Program enrollment ($99/yr) for App Store submission | Jonathan |
| 2   | scando.app domain registration                                       | Jonathan |
| 3   | App icon and splash screen design (steampunk/industrial motif)       | Jonathan |
| 4   | Color palette finalization                                           | Jonathan |
| 5   | StoreKit product IDs configuration in App Store Connect              | Jonathan |
| 6   | Physical iPhone 12 Pro+ for LiDAR testing                            | Jonathan |
| 7   | EAS development build \+ device install for first LiDAR test         | Jonathan |
| 8   | DJI Mini 4 Pro purchase (v2 planning)                                | Jonathan |

**9\. Known Issues & Risks**

**9.1 Technical Risks**

| Risk                                                                        | Mitigation                                                                                          |
| :-------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------- |
| ARGeoTrackingConfiguration city coverage limited — Cleveland TN not covered | Fall back to CoreLocation GPS tagging everywhere; ARGeoTracking is enhancement only, not dependency |
| Large mesh memory limits on device                                          | v1 scoped to single-floor interiors; streaming mesh export deferred to v3                           |
| DWG/IFC serialization complexity                                            | Use proven Swift libraries (LibreCAD, IFC.js Swift port); scope to v1 Pro only                      |
| EAS Cloud build queue times (free tier)                                     | Free tier is fine during solo dev; upgrade to Starter ($19/mo) when shipping to testers             |
| .io domain risk — Chagos Islands sovereignty dispute may phase out .io TLD  | Target scando.app instead of scando.io                                                              |

## **9.2 Discussion Items**

| \#  | Topic                                          | Notes                                                                                 |
| :-- | :--------------------------------------------- | :------------------------------------------------------------------------------------ |
| 1   | Scaniverse 'Choose your experience' screen bug | Cannot scroll to Continue button on iPhone 17 — resolved by building ScanDo           |
| 2   | EAS free vs paid tier                          | Free tier sufficient for solo dev; upgrade when real users need OTA updates           |
| 3   | Backend for Pro stitching                      | Confirmed: all stitching is on-device via ARWorldMap; no backend needed for v1 or v2  |
| 4   | DJI SDK licensing                              | DJI Mobile SDK 5 is free for developers; verify commercial use terms before v2 launch |

**10\. Scope & Change Log**

**10.1 Current Scope (v1)**

| Item                                                    | Phase           |
| :------------------------------------------------------ | :-------------- |
| iPhone LiDAR scanning (interior)                        | v1 — Current    |
| Free tier: unlimited scan \+ OBJ/DAE/STL export         | v1 — Current    |
| Pro tier: stitching, cleanup, floor plans, measurements | v1 — Current    |
| Pro tier: CAD export (DWG, IFC, RVT)                    | v1 — Current    |
| Pro tier: geolocation \+ KML/GeoJSON export             | v1 — Current    |
| Pro tier: cloud backup (CloudKit)                       | v1 — Current    |
| Pro tier: StoreKit 2 subscription \+ one-time purchase  | v1 — Current    |
| Android support                                         | Out of scope v1 |
| Web app                                                 | Out of scope v1 |
| Team / enterprise features                              | v3              |
| Drone photogrammetry                                    | v2              |
| Interior \+ exterior mesh merge                         | v3              |
| Web viewer                                              | v3              |
| Change detection                                        | v3              |
| BIM platform integration                                | v3              |

## **10.2 Change Log**

| Date       | Change                                                                                 | Source              |
| :--------- | :------------------------------------------------------------------------------------- | :------------------ |
| 2026-04-04 | Project initiated. Stack selected: Expo bare \+ Swift native modules \+ EAS Cloud.     | Claude.ai session   |
| 2026-04-04 | Business model finalized: Free forever \+ Pro $9.99/mo or $79 one-time.                | Claude.ai session   |
| 2026-04-04 | Geolocation added to Pro tier: CoreLocation GPS, ARGeoTracking, KML/GeoJSON export.    | Claude.ai session   |
| 2026-04-04 | v2 roadmap added: DJI drone \+ Apple Object Capture exterior photogrammetry.           | Claude.ai session   |
| 2026-04-04 | v3 roadmap added: full as-built platform, web viewer, BIM integration, team workspace. | Claude.ai session   |
| 2026-04-04 | Claude Code scaffold initiated (Opus 4.6, max effort, \~120 files).                    | Claude Code session |
