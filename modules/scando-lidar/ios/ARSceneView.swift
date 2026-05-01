import ExpoModulesCore
import ARKit
import SceneKit

/// Expo Module view that renders the AR camera feed using ARSCNView.
/// Lazily attaches to whatever ARSession the current ARSessionManager owns.
/// Does NOT create any ARKit resources at init time — safe to load at app launch.
class ARSceneView: ExpoView {
  private let sceneView = ARSCNView()

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    clipsToBounds = true
    sceneView.automaticallyUpdatesLighting = true
    sceneView.autoenablesDefaultLighting = true
    sceneView.showsStatistics = false
    addSubview(sceneView)
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    sceneView.frame = bounds

    // Lazily attach to the current session if one exists.
    // If no scan is active, the ARSCNView just renders a black frame.
    if let manager = ScandoLidarModule.currentManager {
      if sceneView.session !== manager.session {
        sceneView.session = manager.session
      }
    }
  }
}
