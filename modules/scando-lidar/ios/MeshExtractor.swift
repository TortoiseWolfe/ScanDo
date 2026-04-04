import ARKit

class MeshExtractor {

  func extract(from anchor: ARMeshAnchor) -> [String: Any] {
    let geometry = anchor.geometry
    let transform = anchor.transform

    let vertices = extractVertices(geometry: geometry, transform: transform)
    let faces = extractFaces(geometry: geometry)
    let normals = extractNormals(geometry: geometry, transform: transform)

    return [
      "anchorId": anchor.identifier.uuidString,
      "vertices": vertices,
      "faces": faces,
      "normals": normals,
      "vertexCount": geometry.vertices.count,
      "faceCount": geometry.faces.count,
    ]
  }

  func extractAll(from anchors: [ARMeshAnchor]) -> [String: Any] {
    var allVertices: [Float] = []
    var allFaces: [Int] = []
    var allNormals: [Float] = []
    var vertexOffset = 0

    for anchor in anchors {
      let geometry = anchor.geometry
      let transform = anchor.transform

      let vertices = extractVertices(geometry: geometry, transform: transform)
      let normals = extractNormals(geometry: geometry, transform: transform)
      let faces = extractFaces(geometry: geometry)

      allVertices.append(contentsOf: vertices)
      allNormals.append(contentsOf: normals)

      // Offset face indices by current vertex count
      let offsetFaces = faces.map { $0 + vertexOffset }
      allFaces.append(contentsOf: offsetFaces)

      vertexOffset += geometry.vertices.count
    }

    return [
      "vertices": allVertices,
      "faces": allFaces,
      "normals": allNormals,
      "vertexCount": vertexOffset,
      "faceCount": allFaces.count / 3,
    ]
  }

  // MARK: - Private

  private func extractVertices(
    geometry: ARMeshGeometry, transform: simd_float4x4
  ) -> [Float] {
    var result: [Float] = []
    result.reserveCapacity(geometry.vertices.count * 3)

    let vertexBuffer = geometry.vertices
    let vertexPointer = vertexBuffer.buffer.contents()
      .bindMemory(to: SIMD3<Float>.self, capacity: vertexBuffer.count)

    for i in 0..<vertexBuffer.count {
      let localVertex = vertexPointer[i]
      let worldVertex = transform * SIMD4<Float>(localVertex, 1.0)
      result.append(worldVertex.x)
      result.append(worldVertex.y)
      result.append(worldVertex.z)
    }

    return result
  }

  private func extractFaces(geometry: ARMeshGeometry) -> [Int] {
    var result: [Int] = []
    result.reserveCapacity(geometry.faces.count * 3)

    let faceBuffer = geometry.faces
    let indexBuffer = faceBuffer.buffer.contents()

    for i in 0..<faceBuffer.count {
      let offset = i * faceBuffer.indexCountPerPrimitive * faceBuffer.bytesPerIndex
      for j in 0..<faceBuffer.indexCountPerPrimitive {
        let indexOffset = offset + j * faceBuffer.bytesPerIndex
        if faceBuffer.bytesPerIndex == 4 {
          let index = indexBuffer.load(fromByteOffset: indexOffset, as: UInt32.self)
          result.append(Int(index))
        } else {
          let index = indexBuffer.load(fromByteOffset: indexOffset, as: UInt16.self)
          result.append(Int(index))
        }
      }
    }

    return result
  }

  private func extractNormals(
    geometry: ARMeshGeometry, transform: simd_float4x4
  ) -> [Float] {
    var result: [Float] = []
    result.reserveCapacity(geometry.normals.count * 3)

    let normalBuffer = geometry.normals
    let normalPointer = normalBuffer.buffer.contents()
      .bindMemory(to: SIMD3<Float>.self, capacity: normalBuffer.count)

    let rotationMatrix = simd_float3x3(
      SIMD3<Float>(transform.columns.0.x, transform.columns.0.y, transform.columns.0.z),
      SIMD3<Float>(transform.columns.1.x, transform.columns.1.y, transform.columns.1.z),
      SIMD3<Float>(transform.columns.2.x, transform.columns.2.y, transform.columns.2.z)
    )

    for i in 0..<normalBuffer.count {
      let localNormal = normalPointer[i]
      let worldNormal = rotationMatrix * localNormal
      result.append(worldNormal.x)
      result.append(worldNormal.y)
      result.append(worldNormal.z)
    }

    return result
  }
}
