import Foundation

enum MeshSerializerError: Error {
  case unsupportedFormat(String)
  case writeError(String)
  case invalidMeshData
}

class MeshSerializer {

  static func serialize(
    mesh: [Any],
    format: String,
    outputPath: String
  ) throws -> String {
    guard let meshAnchors = mesh as? [Any] else {
      throw MeshSerializerError.invalidMeshData
    }

    let extractor = MeshExtractor()
    // For now, work with raw float arrays extracted from anchors
    // In production, this would accept ARMeshAnchor array directly

    switch format.lowercased() {
    case "obj":
      return try serializeOBJ(outputPath: outputPath)
    case "dae":
      return try serializeDAE(outputPath: outputPath)
    case "stl":
      return try serializeSTL(outputPath: outputPath)
    default:
      throw MeshSerializerError.unsupportedFormat(format)
    }
  }

  static func serializeFromData(
    vertices: [Float],
    faces: [Int],
    normals: [Float],
    format: String,
    outputPath: String
  ) throws -> String {
    switch format.lowercased() {
    case "obj":
      return try writeOBJ(vertices: vertices, faces: faces, normals: normals, path: outputPath)
    case "dae":
      return try writeDAE(vertices: vertices, faces: faces, normals: normals, path: outputPath)
    case "stl":
      return try writeSTL(vertices: vertices, faces: faces, normals: normals, path: outputPath)
    default:
      throw MeshSerializerError.unsupportedFormat(format)
    }
  }

  // MARK: - OBJ Format

  private static func writeOBJ(
    vertices: [Float], faces: [Int], normals: [Float], path: String
  ) throws -> String {
    var output = "# ScanDo OBJ Export\n"
    output += "# Vertices: \(vertices.count / 3)\n"
    output += "# Faces: \(faces.count / 3)\n\n"

    // Write vertices
    for i in stride(from: 0, to: vertices.count, by: 3) {
      output += "v \(vertices[i]) \(vertices[i + 1]) \(vertices[i + 2])\n"
    }

    output += "\n"

    // Write normals
    for i in stride(from: 0, to: normals.count, by: 3) {
      output += "vn \(normals[i]) \(normals[i + 1]) \(normals[i + 2])\n"
    }

    output += "\n"

    // Write faces (OBJ uses 1-based indices)
    for i in stride(from: 0, to: faces.count, by: 3) {
      let a = faces[i] + 1
      let b = faces[i + 1] + 1
      let c = faces[i + 2] + 1
      output += "f \(a)//\(a) \(b)//\(b) \(c)//\(c)\n"
    }

    let filePath = path.hasSuffix(".obj") ? path : "\(path).obj"
    try output.write(toFile: filePath, atomically: true, encoding: .utf8)
    return filePath
  }

  // MARK: - DAE (Collada) Format

  private static func writeDAE(
    vertices: [Float], faces: [Int], normals: [Float], path: String
  ) throws -> String {
    let vertexCount = vertices.count / 3
    let faceCount = faces.count / 3

    let vertexString = vertices.map { String(format: "%.6f", $0) }.joined(separator: " ")
    let normalString = normals.map { String(format: "%.6f", $0) }.joined(separator: " ")
    let faceString = faces.map { String($0) }.joined(separator: " ")
    let vcountString = Array(repeating: "3", count: faceCount).joined(separator: " ")

    let xml = """
    <?xml version="1.0" encoding="utf-8"?>
    <COLLADA xmlns="http://www.collada.org/2005/11/COLLADASchema" version="1.4.1">
      <asset>
        <created>\(ISO8601DateFormatter().string(from: Date()))</created>
        <modified>\(ISO8601DateFormatter().string(from: Date()))</modified>
        <unit name="meter" meter="1"/>
        <up_axis>Y_UP</up_axis>
      </asset>
      <library_geometries>
        <geometry id="mesh0" name="ScanDoMesh">
          <mesh>
            <source id="mesh0-positions">
              <float_array id="mesh0-positions-array" count="\(vertices.count)">\(vertexString)</float_array>
              <technique_common>
                <accessor source="#mesh0-positions-array" count="\(vertexCount)" stride="3">
                  <param name="X" type="float"/>
                  <param name="Y" type="float"/>
                  <param name="Z" type="float"/>
                </accessor>
              </technique_common>
            </source>
            <source id="mesh0-normals">
              <float_array id="mesh0-normals-array" count="\(normals.count)">\(normalString)</float_array>
              <technique_common>
                <accessor source="#mesh0-normals-array" count="\(vertexCount)" stride="3">
                  <param name="X" type="float"/>
                  <param name="Y" type="float"/>
                  <param name="Z" type="float"/>
                </accessor>
              </technique_common>
            </source>
            <vertices id="mesh0-vertices">
              <input semantic="POSITION" source="#mesh0-positions"/>
            </vertices>
            <polylist count="\(faceCount)">
              <input semantic="VERTEX" source="#mesh0-vertices" offset="0"/>
              <input semantic="NORMAL" source="#mesh0-normals" offset="0"/>
              <vcount>\(vcountString)</vcount>
              <p>\(faceString)</p>
            </polylist>
          </mesh>
        </geometry>
      </library_geometries>
      <library_visual_scenes>
        <visual_scene id="Scene" name="Scene">
          <node id="Mesh" name="ScanDoMesh" type="NODE">
            <instance_geometry url="#mesh0"/>
          </node>
        </visual_scene>
      </library_visual_scenes>
      <scene>
        <instance_visual_scene url="#Scene"/>
      </scene>
    </COLLADA>
    """

    let filePath = path.hasSuffix(".dae") ? path : "\(path).dae"
    try xml.write(toFile: filePath, atomically: true, encoding: .utf8)
    return filePath
  }

  // MARK: - STL Format (ASCII)

  private static func writeSTL(
    vertices: [Float], faces: [Int], normals: [Float], path: String
  ) throws -> String {
    var output = "solid ScanDoMesh\n"

    for i in stride(from: 0, to: faces.count, by: 3) {
      let ai = faces[i]
      let bi = faces[i + 1]
      let ci = faces[i + 2]

      // Use the normal of the first vertex of the face
      let nx = normals[ai * 3]
      let ny = normals[ai * 3 + 1]
      let nz = normals[ai * 3 + 2]

      output += "  facet normal \(nx) \(ny) \(nz)\n"
      output += "    outer loop\n"
      output += "      vertex \(vertices[ai * 3]) \(vertices[ai * 3 + 1]) \(vertices[ai * 3 + 2])\n"
      output += "      vertex \(vertices[bi * 3]) \(vertices[bi * 3 + 1]) \(vertices[bi * 3 + 2])\n"
      output += "      vertex \(vertices[ci * 3]) \(vertices[ci * 3 + 1]) \(vertices[ci * 3 + 2])\n"
      output += "    endloop\n"
      output += "  endfacet\n"
    }

    output += "endsolid ScanDoMesh\n"

    let filePath = path.hasSuffix(".stl") ? path : "\(path).stl"
    try output.write(toFile: filePath, atomically: true, encoding: .utf8)
    return filePath
  }

  // MARK: - Placeholder for full ARMeshAnchor serialization

  private static func serializeOBJ(outputPath: String) throws -> String {
    throw MeshSerializerError.writeError("Direct ARMeshAnchor serialization not yet implemented. Use serializeFromData instead.")
  }

  private static func serializeDAE(outputPath: String) throws -> String {
    throw MeshSerializerError.writeError("Direct ARMeshAnchor serialization not yet implemented. Use serializeFromData instead.")
  }

  private static func serializeSTL(outputPath: String) throws -> String {
    throw MeshSerializerError.writeError("Direct ARMeshAnchor serialization not yet implemented. Use serializeFromData instead.")
  }
}
