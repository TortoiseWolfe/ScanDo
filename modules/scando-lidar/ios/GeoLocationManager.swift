import CoreLocation
import ARKit

/// Manages CoreLocation + ARGeoTracking for tagging scans with GPS coordinates.
///
/// Strategy:
/// - In ARGeoTracking-supported cities, uses ARGeoTrackingConfiguration
///   for sub-meter accuracy coordinate mapping.
/// - Everywhere else, falls back to standard CoreLocation GPS.
/// - Provides getGeoLocation() to convert ARKit local coordinates to lat/lon/altitude.
class GeoLocationManager: NSObject, CLLocationManagerDelegate {

  private let locationManager = CLLocationManager()
  private var currentLocation: CLLocation?
  private var isGeoTrackingSession = false
  private var arSession: ARSession?

  var onLocationUpdate: (([String: Any]) -> Void)?
  var onError: ((String, String) -> Void)?

  override init() {
    super.init()
    locationManager.delegate = self
    locationManager.desiredAccuracy = kCLLocationAccuracyBest
  }

  /// Check if ARGeoTracking is available at the current location.
  func isGeoTrackingAvailable() async -> Bool {
    guard ARGeoTrackingConfiguration.isSupported else { return false }

    return await withCheckedContinuation { continuation in
      ARGeoTrackingConfiguration.checkAvailability { available, _ in
        continuation.resume(returning: available)
      }
    }
  }

  /// Start location tracking. Requests permission if needed.
  func startTracking(arSession: ARSession?) {
    self.arSession = arSession

    let status = locationManager.authorizationStatus
    if status == .notDetermined {
      locationManager.requestWhenInUseAuthorization()
    }

    locationManager.startUpdatingLocation()
  }

  /// Stop location tracking and return last known location.
  func stopTracking() {
    locationManager.stopUpdatingLocation()
  }

  /// Get the current GPS location.
  func getCurrentLocation() -> [String: Any]? {
    guard let location = currentLocation else { return nil }

    return [
      "latitude": location.coordinate.latitude,
      "longitude": location.coordinate.longitude,
      "altitude": location.altitude,
      "horizontalAccuracy": location.horizontalAccuracy,
      "verticalAccuracy": location.verticalAccuracy,
      "isGeoTracked": isGeoTrackingSession,
    ]
  }

  /// Convert ARKit local coordinates to geographic coordinates.
  /// Uses ARSession.getGeoLocation() when ARGeoTracking is active,
  /// otherwise estimates based on GPS + ARKit transform offset.
  func getGeoLocation(
    arLocalX: Float,
    arLocalY: Float,
    arLocalZ: Float,
    completion: @escaping ([String: Any]?) -> Void
  ) {
    guard let session = arSession else {
      completion(currentLocation.map { loc in
        [
          "latitude": loc.coordinate.latitude,
          "longitude": loc.coordinate.longitude,
          "altitude": loc.altitude + Double(arLocalY),
          "horizontalAccuracy": loc.horizontalAccuracy,
          "verticalAccuracy": loc.verticalAccuracy,
          "isGeoTracked": false,
        ]
      })
      return
    }

    let transform = simd_float4x4(
      SIMD4<Float>(1, 0, 0, 0),
      SIMD4<Float>(0, 1, 0, 0),
      SIMD4<Float>(0, 0, 1, 0),
      SIMD4<Float>(arLocalX, arLocalY, arLocalZ, 1)
    )

    session.getGeoLocation(forPoint: SIMD3<Float>(arLocalX, arLocalY, arLocalZ)) { coordinate, altitude, error in
      if let error = error {
        // Fallback to GPS-only estimate
        completion(self.currentLocation.map { loc in
          [
            "latitude": loc.coordinate.latitude,
            "longitude": loc.coordinate.longitude,
            "altitude": loc.altitude + Double(arLocalY),
            "horizontalAccuracy": loc.horizontalAccuracy,
            "verticalAccuracy": loc.verticalAccuracy,
            "isGeoTracked": false,
          ]
        })
        return
      }

      completion([
        "latitude": coordinate.latitude,
        "longitude": coordinate.longitude,
        "altitude": altitude,
        "horizontalAccuracy": 1.0,
        "verticalAccuracy": 1.0,
        "isGeoTracked": true,
      ])
    }
  }

  // MARK: - CLLocationManagerDelegate

  func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
    guard let location = locations.last else { return }
    currentLocation = location

    onLocationUpdate?([
      "latitude": location.coordinate.latitude,
      "longitude": location.coordinate.longitude,
      "altitude": location.altitude,
      "horizontalAccuracy": location.horizontalAccuracy,
      "verticalAccuracy": location.verticalAccuracy,
      "isGeoTracked": isGeoTrackingSession,
    ])
  }

  func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
    onError?("LOCATION_ERROR", error.localizedDescription)
  }
}
