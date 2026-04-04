import ARKit
import simd

/// Raycasting-based measurement engine for measuring distances, areas,
/// and heights on the reconstructed mesh.
class MeasurementEngine {

  enum MeasurementType {
    case distance
    case area
    case height
  }

  struct MeasurementResult {
    var type: MeasurementType
    var value: Double // meters
    var points: [SIMD3<Float>]
  }

  private let session: ARSession

  init(session: ARSession) {
    self.session = session
  }

  /// Cast a ray from screen point to find intersection with mesh.
  func raycast(
    from screenPoint: CGPoint,
    viewSize: CGSize
  ) -> SIMD3<Float>? {
    let query = ARRaycastQuery(
      origin: SIMD3<Float>(0, 0, 0),
      direction: SIMD3<Float>(0, 0, -1),
      allowing: .existingPlaneGeometry,
      alignment: .any
    )

    guard let results = session.raycast(query).first else { return nil }
    let column = results.worldTransform.columns.3
    return SIMD3<Float>(column.x, column.y, column.z)
  }

  /// Measure distance between two 3D points.
  static func measureDistance(
    from pointA: SIMD3<Float>,
    to pointB: SIMD3<Float>
  ) -> MeasurementResult {
    let distance = simd_distance(pointA, pointB)
    return MeasurementResult(
      type: .distance,
      value: Double(distance),
      points: [pointA, pointB]
    )
  }

  /// Measure height (vertical distance) between two points.
  static func measureHeight(
    from pointA: SIMD3<Float>,
    to pointB: SIMD3<Float>
  ) -> MeasurementResult {
    let height = abs(pointB.y - pointA.y)
    return MeasurementResult(
      type: .height,
      value: Double(height),
      points: [pointA, pointB]
    )
  }

  /// Calculate area of a polygon defined by 3+ coplanar points.
  static func measureArea(points: [SIMD3<Float>]) -> MeasurementResult {
    guard points.count >= 3 else {
      return MeasurementResult(type: .area, value: 0, points: points)
    }

    // Use the Shoelace formula projected onto the best-fit plane
    var area: Float = 0
    let n = points.count

    // Calculate normal of the polygon
    let normal = simd_normalize(
      simd_cross(points[1] - points[0], points[2] - points[0])
    )

    for i in 0..<n {
      let j = (i + 1) % n
      let cross = simd_cross(points[i], points[j])
      area += simd_dot(normal, cross)
    }

    return MeasurementResult(
      type: .area,
      value: Double(abs(area) / 2.0),
      points: points
    )
  }
}
