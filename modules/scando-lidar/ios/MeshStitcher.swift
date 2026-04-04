import ARKit

/// Multi-scan stitching via ARKit world origin alignment (Pro feature).
/// Combines mesh data from multiple scan sessions into a single unified mesh.
class MeshStitcher {

  struct StitchedMesh {
    var vertices: [Float]
    var faces: [Int]
    var normals: [Float]
    var vertexCount: Int
    var faceCount: Int
  }

  /// Stitch multiple mesh snapshots into a single mesh.
  /// Each snapshot is expected to contain vertices, faces, and normals as flat arrays.
  static func stitch(snapshots: [[String: Any]]) -> StitchedMesh {
    var allVertices: [Float] = []
    var allFaces: [Int] = []
    var allNormals: [Float] = []
    var vertexOffset = 0

    for snapshot in snapshots {
      guard
        let vertices = snapshot["vertices"] as? [Float],
        let faces = snapshot["faces"] as? [Int],
        let normals = snapshot["normals"] as? [Float],
        let vertexCount = snapshot["vertexCount"] as? Int
      else {
        continue
      }

      allVertices.append(contentsOf: vertices)
      allNormals.append(contentsOf: normals)

      let offsetFaces = faces.map { $0 + vertexOffset }
      allFaces.append(contentsOf: offsetFaces)

      vertexOffset += vertexCount
    }

    return StitchedMesh(
      vertices: allVertices,
      faces: allFaces,
      normals: allNormals,
      vertexCount: vertexOffset,
      faceCount: allFaces.count / 3
    )
  }
}
