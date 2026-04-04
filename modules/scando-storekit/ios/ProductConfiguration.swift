import Foundation

/// Central configuration for StoreKit product identifiers.
/// These must match the products configured in App Store Connect.
enum ProductConfiguration {

  /// Monthly subscription product ID
  static let monthlySubscriptionId = "com.scando.pro.monthly"

  /// One-time lifetime purchase product ID
  static let lifetimePurchaseId = "com.scando.pro.lifetime"

  /// All product IDs that grant Pro access
  static let proProductIds: Set<String> = [
    monthlySubscriptionId,
    lifetimePurchaseId,
  ]

  /// All product IDs to fetch from the App Store
  static let allProductIds: Set<String> = proProductIds
}
