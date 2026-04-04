import StoreKit

class SubscriptionManager {

  func getProducts() async throws -> [Product] {
    let productIds = ProductConfiguration.allProductIds
    return try await Product.products(for: productIds)
  }

  func purchase(productId: String) async throws -> [String: Any] {
    let products = try await Product.products(for: [productId])
    guard let product = products.first else {
      throw SubscriptionError.productNotFound
    }

    let result = try await product.purchase()

    switch result {
    case .success(let verification):
      let transaction = try checkVerified(verification)
      await transaction.finish()
      return [
        "success": true,
        "productId": productId,
        "transactionId": String(transaction.id),
      ]

    case .userCancelled:
      return [
        "success": false,
        "productId": productId,
        "error": "User cancelled",
      ]

    case .pending:
      return [
        "success": false,
        "productId": productId,
        "error": "Purchase pending approval",
      ]

    @unknown default:
      return [
        "success": false,
        "productId": productId,
        "error": "Unknown purchase result",
      ]
    }
  }

  func restorePurchases() async throws -> [[String: Any]] {
    var results: [[String: Any]] = []

    for await result in Transaction.currentEntitlements {
      if let transaction = try? checkVerified(result) {
        results.append([
          "success": true,
          "productId": transaction.productID,
          "transactionId": String(transaction.id),
        ])
      }
    }

    return results
  }

  func getEntitlements() async throws -> [String: Any] {
    var isProActive = false
    var expiresAt: String?
    var purchaseType: String = "free"

    for await result in Transaction.currentEntitlements {
      guard let transaction = try? checkVerified(result) else { continue }

      if ProductConfiguration.proProductIds.contains(transaction.productID) {
        isProActive = true

        if let expiration = transaction.expirationDate {
          expiresAt = ISO8601DateFormatter().string(from: expiration)
          purchaseType = "subscription"
        } else {
          purchaseType = "lifetime"
        }
      }
    }

    return [
      "tier": isProActive ? "pro" : "free",
      "isActive": isProActive,
      "expiresAt": expiresAt as Any,
      "purchaseType": purchaseType,
    ]
  }

  // MARK: - Private

  private func checkVerified<T>(_ result: VerificationResult<T>) throws -> T {
    switch result {
    case .unverified:
      throw SubscriptionError.verificationFailed
    case .verified(let safe):
      return safe
    }
  }
}

enum SubscriptionError: Error {
  case productNotFound
  case verificationFailed
  case purchaseFailed(String)
}
