import CloudKit

class CloudSyncManager {

  private let container = CKContainer(identifier: "iCloud.com.scando.app")
  private let recordType = "ScanData"

  func sync() async throws -> [String: Any] {
    let database = container.privateCloudDatabase

    // Fetch all remote records
    let query = CKQuery(recordType: recordType, predicate: NSPredicate(value: true))
    let (results, _) = try await database.records(matching: query)

    var uploaded = 0
    var downloaded = 0
    var conflicts = 0
    var errors: [String] = []

    for (_, result) in results {
      switch result {
      case .success:
        downloaded += 1
      case .failure(let error):
        errors.append(error.localizedDescription)
      }
    }

    return [
      "uploaded": uploaded,
      "downloaded": downloaded,
      "conflicts": conflicts,
      "errors": errors,
    ]
  }

  func upload(scanId: String, filePath: String) async throws -> String {
    let database = container.privateCloudDatabase

    let recordId = CKRecord.ID(recordName: "scan_\(scanId)")
    let record = CKRecord(recordType: recordType, recordID: recordId)

    let fileURL = URL(fileURLWithPath: filePath)
    let asset = CKAsset(fileURL: fileURL)

    record["scanId"] = scanId as CKRecordValue
    record["scanData"] = asset
    record["updatedAt"] = Date() as CKRecordValue

    let savedRecord = try await database.save(record)
    return savedRecord.recordID.recordName
  }

  func download(scanId: String) async throws -> String {
    let database = container.privateCloudDatabase

    let recordId = CKRecord.ID(recordName: "scan_\(scanId)")
    let record = try await database.record(for: recordId)

    guard let asset = record["scanData"] as? CKAsset,
          let fileURL = asset.fileURL else {
      throw CloudSyncError.assetNotFound
    }

    // Copy to local storage
    let documentsDir = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
    let localURL = documentsDir.appendingPathComponent("scans").appendingPathComponent("\(scanId).scan")

    try FileManager.default.createDirectory(
      at: localURL.deletingLastPathComponent(),
      withIntermediateDirectories: true
    )

    if FileManager.default.fileExists(atPath: localURL.path) {
      try FileManager.default.removeItem(at: localURL)
    }

    try FileManager.default.copyItem(at: fileURL, to: localURL)
    return localURL.path
  }

  func listRemoteScans() async throws -> [[String: Any]] {
    let database = container.privateCloudDatabase

    let query = CKQuery(recordType: recordType, predicate: NSPredicate(value: true))
    query.sortDescriptors = [NSSortDescriptor(key: "updatedAt", ascending: false)]

    let (results, _) = try await database.records(matching: query)

    var scans: [[String: Any]] = []

    for (_, result) in results {
      if case .success(let record) = result {
        let scan: [String: Any] = [
          "scanId": record["scanId"] as? String ?? "",
          "name": record["name"] as? String ?? "Untitled",
          "updatedAt": (record["updatedAt"] as? Date).map {
            ISO8601DateFormatter().string(from: $0)
          } ?? "",
          "fileSize": (record["scanData"] as? CKAsset)?.fileURL.flatMap {
            try? FileManager.default.attributesOfItem(atPath: $0.path)[.size] as? Int
          } ?? 0,
        ]
        scans.append(scan)
      }
    }

    return scans
  }
}

enum CloudSyncError: Error {
  case assetNotFound
  case recordNotFound
  case syncFailed(String)
}
