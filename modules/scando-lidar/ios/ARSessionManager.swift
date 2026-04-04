import ARKit

class ARSessionManager: NSObject, ARSessionDelegate {
  private let session = ARSession()
  private var currentAnchors: [UUID: ARMeshAnchor] = [:]

  var onMeshUpdate: (([String: Any]) -> Void)?
  var onStateChange: ((String, String?) -> Void)?
  var onError: ((String, String) -> Void)?

  override init() {
    super.init()
    session.delegate = self
  }

  func start() {
    let config = ARWorldTrackingConfiguration()
    config.sceneReconstruction = .mesh
    config.environmentTexturing = .automatic
    config.planeDetection = [.horizontal, .vertical]

    session.run(config, options: [.resetTracking, .removeExistingAnchors])
    onStateChange?("running", nil)
  }

  func stop() {
    session.pause()
    onStateChange?("stopped", nil)
  }

  func pause() {
    session.pause()
    onStateChange?("paused", nil)
  }

  func resume() {
    let config = ARWorldTrackingConfiguration()
    config.sceneReconstruction = .mesh
    config.environmentTexturing = .automatic
    config.planeDetection = [.horizontal, .vertical]

    session.run(config)
    onStateChange?("running", nil)
  }

  func getMeshSnapshot() -> [String: Any] {
    let extractor = MeshExtractor()
    return extractor.extractAll(from: Array(currentAnchors.values))
  }

  func getCurrentMesh() -> [ARMeshAnchor] {
    return Array(currentAnchors.values)
  }

  // MARK: - ARSessionDelegate

  func session(_ session: ARSession, didAdd anchors: [ARAnchor]) {
    for anchor in anchors {
      guard let meshAnchor = anchor as? ARMeshAnchor else { continue }
      currentAnchors[meshAnchor.identifier] = meshAnchor
      sendMeshUpdate(for: meshAnchor)
    }
  }

  func session(_ session: ARSession, didUpdate anchors: [ARAnchor]) {
    for anchor in anchors {
      guard let meshAnchor = anchor as? ARMeshAnchor else { continue }
      currentAnchors[meshAnchor.identifier] = meshAnchor
      sendMeshUpdate(for: meshAnchor)
    }
  }

  func session(_ session: ARSession, didRemove anchors: [ARAnchor]) {
    for anchor in anchors {
      currentAnchors.removeValue(forKey: anchor.identifier)
    }
  }

  func session(_ session: ARSession, didFailWithError error: Error) {
    onError?("SESSION_FAILED", error.localizedDescription)
    onStateChange?("error", error.localizedDescription)
  }

  // MARK: - Private

  private func sendMeshUpdate(for anchor: ARMeshAnchor) {
    let extractor = MeshExtractor()
    let data = extractor.extract(from: anchor)
    onMeshUpdate?(data)
  }
}
