import ExpoModulesCore
import ARKit

public class ScandoLidarModule: Module {
  // Static reference to the current manager so ARSceneView can lazily find it.
  // Weak to avoid retain cycles.
  static weak var currentManager: ARSessionManager?

  private var sessionManager: ARSessionManager?

  public func definition() -> ModuleDefinition {
    Name("ScandoLidar")

    Events("onMeshUpdate", "onSessionStateChange", "onError")

    View(ARSceneView.self) {
      // No custom props for now
    }

    Function("isLidarAvailable") { () -> Bool in
      return ARWorldTrackingConfiguration.supportsSceneReconstruction(.mesh)
    }

    AsyncFunction("startSession") { (promise: Promise) in
      guard ARWorldTrackingConfiguration.supportsSceneReconstruction(.mesh) else {
        promise.reject("LIDAR_UNAVAILABLE", "This device does not have a LiDAR sensor.")
        return
      }

      let manager = ARSessionManager()
      manager.onMeshUpdate = { [weak self] event in
        self?.sendEvent("onMeshUpdate", event)
      }
      manager.onStateChange = { [weak self] state, message in
        self?.sendEvent("onSessionStateChange", [
          "state": state,
          "message": message ?? ""
        ])
      }
      manager.onError = { [weak self] code, message in
        self?.sendEvent("onError", ["code": code, "message": message])
      }

      self.sessionManager = manager
      ScandoLidarModule.currentManager = manager
      manager.start()
      promise.resolve(nil)
    }

    AsyncFunction("stopSession") { (promise: Promise) in
      self.sessionManager?.stop()
      self.sessionManager = nil
      ScandoLidarModule.currentManager = nil
      promise.resolve(nil)
    }

    AsyncFunction("pauseSession") { (promise: Promise) in
      self.sessionManager?.pause()
      promise.resolve(nil)
    }

    AsyncFunction("resumeSession") { (promise: Promise) in
      self.sessionManager?.resume()
      promise.resolve(nil)
    }

    AsyncFunction("getMeshSnapshot") { (promise: Promise) in
      guard let manager = self.sessionManager else {
        promise.reject("NO_SESSION", "No active scanning session.")
        return
      }
      let snapshot = manager.getMeshSnapshot()
      promise.resolve(snapshot)
    }

    AsyncFunction("exportToFile") { (format: String, outputPath: String, promise: Promise) in
      guard let manager = self.sessionManager else {
        promise.reject("NO_SESSION", "No active scanning session.")
        return
      }

      do {
        let filePath = try MeshSerializer.serialize(
          mesh: manager.getCurrentMesh(),
          format: format,
          outputPath: outputPath
        )
        promise.resolve(filePath)
      } catch {
        promise.reject("EXPORT_ERROR", error.localizedDescription)
      }
    }
  }
}
