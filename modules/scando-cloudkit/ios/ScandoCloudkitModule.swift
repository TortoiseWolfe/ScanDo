import ExpoModulesCore
import CloudKit

public class ScandoCloudkitModule: Module {
  private let syncManager = CloudSyncManager()

  public func definition() -> ModuleDefinition {
    Name("ScandoCloudkit")

    Events("onSyncProgress", "onSyncComplete")

    AsyncFunction("sync") { (promise: Promise) in
      Task {
        do {
          let result = try await self.syncManager.sync()
          promise.resolve(result)
        } catch {
          promise.reject("SYNC_ERROR", error.localizedDescription)
        }
      }
    }

    AsyncFunction("upload") { (scanId: String, filePath: String, promise: Promise) in
      Task {
        do {
          let recordId = try await self.syncManager.upload(scanId: scanId, filePath: filePath)
          promise.resolve(recordId)
        } catch {
          promise.reject("UPLOAD_ERROR", error.localizedDescription)
        }
      }
    }

    AsyncFunction("download") { (scanId: String, promise: Promise) in
      Task {
        do {
          let localPath = try await self.syncManager.download(scanId: scanId)
          promise.resolve(localPath)
        } catch {
          promise.reject("DOWNLOAD_ERROR", error.localizedDescription)
        }
      }
    }

    AsyncFunction("listRemoteScans") { (promise: Promise) in
      Task {
        do {
          let scans = try await self.syncManager.listRemoteScans()
          promise.resolve(scans)
        } catch {
          promise.reject("LIST_ERROR", error.localizedDescription)
        }
      }
    }
  }
}
