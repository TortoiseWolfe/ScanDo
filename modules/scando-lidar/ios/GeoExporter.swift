import Foundation

/// KML and GeoJSON serialization with embedded mesh reference.
/// Places scanned meshes at their real-world GPS coordinates for
/// Google Earth and GIS workflow compatibility.
class GeoExporter {

  struct GeoExportOptions {
    var latitude: Double
    var longitude: Double
    var altitude: Double
    var scanName: String
    var meshFilePath: String? // optional reference to exported OBJ/DAE file
  }

  // MARK: - KML Export (Google Earth)

  /// Serialize scan to KML format.
  /// Google Earth can load KML and place the scan model at the correct
  /// real-world location.
  static func exportKML(
    vertices: [Float],
    faces: [Int],
    options: GeoExportOptions,
    outputPath: String
  ) throws -> String {
    let coordinates = "\(options.longitude),\(options.latitude),\(options.altitude)"

    // Convert vertices to KML coordinate strings
    var vertexCoords: [String] = []
    for i in stride(from: 0, to: vertices.count, by: 3) {
      // Offset each vertex from the GPS origin
      let lon = options.longitude + Double(vertices[i]) * 0.00001
      let lat = options.latitude + Double(vertices[i + 2]) * 0.00001
      let alt = options.altitude + Double(vertices[i + 1])
      vertexCoords.append("\(lon),\(lat),\(alt)")
    }

    // Build polygon strings from faces
    var polygons = ""
    for i in stride(from: 0, to: faces.count, by: 3) {
      let a = faces[i]
      let b = faces[i + 1]
      let c = faces[i + 2]

      guard a * 3 + 2 < vertices.count,
            b * 3 + 2 < vertices.count,
            c * 3 + 2 < vertices.count else { continue }

      polygons += """
              <Polygon>
                <altitudeMode>absolute</altitudeMode>
                <outerBoundaryIs>
                  <LinearRing>
                    <coordinates>
                      \(vertexCoords[a])
                      \(vertexCoords[b])
                      \(vertexCoords[c])
                      \(vertexCoords[a])
                    </coordinates>
                  </LinearRing>
                </outerBoundaryIs>
              </Polygon>

      """
    }

    let kml = """
    <?xml version="1.0" encoding="UTF-8"?>
    <kml xmlns="http://www.opengis.net/kml/2.2">
      <Document>
        <name>\(escapeXML(options.scanName))</name>
        <description>ScanDo LiDAR scan exported with geolocation</description>
        <Style id="scanStyle">
          <PolyStyle>
            <color>cc0a7ea4</color>
            <outline>1</outline>
          </PolyStyle>
        </Style>
        <Placemark>
          <name>\(escapeXML(options.scanName))</name>
          <styleUrl>#scanStyle</styleUrl>
          <Point>
            <altitudeMode>absolute</altitudeMode>
            <coordinates>\(coordinates)</coordinates>
          </Point>
        </Placemark>
        <Placemark>
          <name>\(escapeXML(options.scanName)) - Mesh</name>
          <styleUrl>#scanStyle</styleUrl>
          <MultiGeometry>
    \(polygons)      </MultiGeometry>
        </Placemark>
      </Document>
    </kml>
    """

    let filePath = outputPath.hasSuffix(".kml") ? outputPath : "\(outputPath).kml"
    try kml.write(toFile: filePath, atomically: true, encoding: .utf8)
    return filePath
  }

  // MARK: - GeoJSON Export

  /// Serialize scan to GeoJSON format for GIS workflows.
  static func exportGeoJSON(
    vertices: [Float],
    faces: [Int],
    options: GeoExportOptions,
    outputPath: String
  ) throws -> String {
    // Build polygon features from faces
    var features: [String] = []

    // Add a point feature for the scan origin
    let originFeature = """
    {
      "type": "Feature",
      "properties": {
        "name": "\(escapeJSON(options.scanName))",
        "type": "scan_origin",
        "altitude": \(options.altitude)
      },
      "geometry": {
        "type": "Point",
        "coordinates": [\(options.longitude), \(options.latitude), \(options.altitude)]
      }
    }
    """
    features.append(originFeature)

    // Add mesh triangles as polygon features (batched to avoid huge files)
    let maxPolygons = min(faces.count / 3, 10000) // Cap at 10K triangles for GeoJSON
    for i in stride(from: 0, to: maxPolygons * 3, by: 3) {
      let a = faces[i]
      let b = faces[i + 1]
      let c = faces[i + 2]

      guard a * 3 + 2 < vertices.count,
            b * 3 + 2 < vertices.count,
            c * 3 + 2 < vertices.count else { continue }

      let coords = [a, b, c, a].map { idx -> String in
        let lon = options.longitude + Double(vertices[idx * 3]) * 0.00001
        let lat = options.latitude + Double(vertices[idx * 3 + 2]) * 0.00001
        let alt = options.altitude + Double(vertices[idx * 3 + 1])
        return "[\(lon), \(lat), \(alt)]"
      }.joined(separator: ", ")

      let feature = """
      {
        "type": "Feature",
        "properties": { "type": "mesh_triangle", "index": \(i / 3) },
        "geometry": {
          "type": "Polygon",
          "coordinates": [[\(coords)]]
        }
      }
      """
      features.append(feature)
    }

    let geojson = """
    {
      "type": "FeatureCollection",
      "properties": {
        "name": "\(escapeJSON(options.scanName))",
        "generator": "ScanDo",
        "scanDate": "\(ISO8601DateFormatter().string(from: Date()))"
      },
      "features": [
        \(features.joined(separator: ",\n    "))
      ]
    }
    """

    let filePath = outputPath.hasSuffix(".geojson") ? outputPath : "\(outputPath).geojson"
    try geojson.write(toFile: filePath, atomically: true, encoding: .utf8)
    return filePath
  }

  // MARK: - Helpers

  private static func escapeXML(_ string: String) -> String {
    return string
      .replacingOccurrences(of: "&", with: "&amp;")
      .replacingOccurrences(of: "<", with: "&lt;")
      .replacingOccurrences(of: ">", with: "&gt;")
      .replacingOccurrences(of: "\"", with: "&quot;")
      .replacingOccurrences(of: "'", with: "&apos;")
  }

  private static func escapeJSON(_ string: String) -> String {
    return string
      .replacingOccurrences(of: "\\", with: "\\\\")
      .replacingOccurrences(of: "\"", with: "\\\"")
  }
}
