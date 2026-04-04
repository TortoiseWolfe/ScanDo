import Foundation

/// Floor plan extraction (Pro feature).
/// Projects mesh geometry onto the XY plane and traces the perimeter
/// to generate a 2D floor plan.
class FloorPlanExtractor {

  struct FloorPlan {
    var walls: [[CGPoint]]
    var boundingRect: CGRect
    var area: Double // square meters
  }

  /// Extract a 2D floor plan from mesh vertices.
  /// Projects all vertices to the XY plane at a given height slice,
  /// then traces the perimeter using a convex hull or alpha shape.
  static func extract(
    vertices: [Float],
    sliceHeight: Float = 1.0,
    sliceThickness: Float = 0.3
  ) -> FloorPlan {
    // 1. Filter vertices near the slice height
    var projectedPoints: [CGPoint] = []

    for i in stride(from: 0, to: vertices.count, by: 3) {
      let y = vertices[i + 1] // Y is up in ARKit
      if abs(y - sliceHeight) <= sliceThickness / 2.0 {
        let point = CGPoint(x: Double(vertices[i]), y: Double(vertices[i + 2]))
        projectedPoints.append(point)
      }
    }

    // 2. Calculate bounding rect
    let boundingRect = calculateBoundingRect(points: projectedPoints)

    // 3. Trace perimeter (simplified: convex hull)
    let hull = convexHull(points: projectedPoints)

    // 4. Calculate area
    let area = calculatePolygonArea(points: hull)

    return FloorPlan(
      walls: [hull],
      boundingRect: boundingRect,
      area: area
    )
  }

  // MARK: - Private

  private static func calculateBoundingRect(points: [CGPoint]) -> CGRect {
    guard !points.isEmpty else { return .zero }

    var minX = CGFloat.greatestFiniteMagnitude
    var minY = CGFloat.greatestFiniteMagnitude
    var maxX = -CGFloat.greatestFiniteMagnitude
    var maxY = -CGFloat.greatestFiniteMagnitude

    for point in points {
      minX = min(minX, point.x)
      minY = min(minY, point.y)
      maxX = max(maxX, point.x)
      maxY = max(maxY, point.y)
    }

    return CGRect(x: minX, y: minY, width: maxX - minX, height: maxY - minY)
  }

  private static func convexHull(points: [CGPoint]) -> [CGPoint] {
    guard points.count >= 3 else { return points }

    let sorted = points.sorted { $0.x == $1.x ? $0.y < $1.y : $0.x < $1.x }
    var hull: [CGPoint] = []

    // Lower hull
    for point in sorted {
      while hull.count >= 2 && cross(hull[hull.count - 2], hull[hull.count - 1], point) <= 0 {
        hull.removeLast()
      }
      hull.append(point)
    }

    // Upper hull
    let lowerCount = hull.count + 1
    for point in sorted.reversed() {
      while hull.count >= lowerCount && cross(hull[hull.count - 2], hull[hull.count - 1], point) <= 0 {
        hull.removeLast()
      }
      hull.append(point)
    }

    hull.removeLast()
    return hull
  }

  private static func cross(_ o: CGPoint, _ a: CGPoint, _ b: CGPoint) -> CGFloat {
    return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x)
  }

  private static func calculatePolygonArea(points: [CGPoint]) -> Double {
    guard points.count >= 3 else { return 0 }

    var area: Double = 0
    let n = points.count
    for i in 0..<n {
      let j = (i + 1) % n
      area += Double(points[i].x * points[j].y)
      area -= Double(points[j].x * points[i].y)
    }

    return abs(area) / 2.0
  }
}
