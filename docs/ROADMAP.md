# ScanDo Roadmap

## v1 — iPhone LiDAR Interior Scanning (current)

Ship date: TBD (pending Apple Developer enrollment)

- iPhone 12 Pro+ LiDAR scanning via ARKit scene reconstruction
- Real-time mesh preview
- Free exports: OBJ, DAE, STL
- Pro exports: DWG, IFC, PLY, PDF floor plan, KML, GeoJSON
- Geolocation tagging (CoreLocation + ARGeoTracking)
- StoreKit 2 payments ($9.99/mo or $79 one-time)
- iCloud CloudKit backup
- Measurement tools, mesh cleanup, multi-scan stitching (Pro)

---

## v2 — Exterior Facade Scanning (Drone Photogrammetry)

### Concept

Complement iPhone LiDAR interior scans with drone photogrammetry exterior scans. Combined interior + exterior = complete as-built building model.

### Drone Integration

- DJI Mobile SDK 5 (Swift)
- Waypoint mission builder — user defines facade boundary, app auto-generates optimal flight path (grid pattern, consistent standoff distance, 70-80% photo overlap)
- Target hardware: DJI Mini 4 Pro (~$760, under FAA 250g registration threshold)
- Programmatic facade scan — no manual piloting required

### Photogrammetry

- Apple RealityKit Object Capture API (on-device, no third party)
- Input: drone photo set from waypoint mission
- Output: textured OBJ/USDZ mesh
- No cloud processing required

### Mesh Merge

- Align interior LiDAR mesh + exterior photogrammetry mesh at shared anchor points (georeferenced via CoreLocation)
- Unified coordinate space via ARGeoTrackingConfiguration
- Single merged export

### Architectural Constraints for v1

These constraints must be respected in v1 to avoid rework:

1. **Decoupled scan sessions** — Keep scan session management decoupled from input source (LiDAR today, photogrammetry tomorrow). `ScannerService` should not assume ARKit is the only mesh source.

2. **Source-agnostic serialization** — `MeshSerializer` must handle meshes from any source, not just `ARMeshAnchor`. The `serializeFromData(vertices, faces, normals, format, path)` API is already correct for this.

3. **Single geolocation authority** — `GeoLocationManager` should be the single source of truth for world coordinates. Both v1 LiDAR and v2 photogrammetry meshes anchor to it.

4. **Format-driven exports** — Export pipeline should be format-driven, not scan-type-driven. A mesh is a mesh regardless of whether it came from LiDAR or photogrammetry.

---

## v3 — Complete As-Built Platform

### Concept

Full building documentation platform. Interior LiDAR + exterior drone photogrammetry merged into a single georeferenced model, with collaboration and delivery tools for professional AEC workflows.

### Features

- **Unified mesh merge** — Interior LiDAR (v1) + exterior drone photogrammetry (v2) merged into one model
- **Multi-device collaborative scanning** — Multiple iPhones scanning the same structure, stitched via shared georeference
- **Web viewer** — Share a link, client views model in browser (no app required)
- **Change detection** — Rescan same structure over time, diff highlights what changed (construction progress, damage assessment, renovation documentation)
- **BIM integration** — Publish directly to Autodesk Construction Cloud, Procore, or Revit via API
- **Team workspace** — Org accounts, project folders, role-based access (this is where enterprise pricing lives)
- **Report generation** — Auto-produce PDF site documentation with measurements, floor plans, photos, and 3D model thumbnail from a single scan session

### Architectural Constraints for v1 + v2

These constraints must be respected now to avoid rework later:

1. **Extensible scan metadata** — `ScanMetadata` schema must support: device ID, operator ID, timestamp, GPS, scan type (`lidar` | `photogrammetry` | `merged`). The current schema has `id`, `geoLocation`, and timestamps — add `scanType` and `deviceId` fields when v2 work begins.

2. **Streaming-ready export pipeline** — Multi-floor buildings will exceed mobile memory limits. Export serializers must support chunked/streaming writes, not buffer-entire-mesh-in-memory.

3. **Org-aware CloudKit schema** — v1 CloudKit uses personal iCloud (`privateCloudDatabase`). Don't hardcode personal account assumptions — v3 needs org-level containers with shared databases.

4. **Web viewer URL** — Reserve `scando.app` domain now. Web viewer implies a public-facing URL for sharing scan models.
