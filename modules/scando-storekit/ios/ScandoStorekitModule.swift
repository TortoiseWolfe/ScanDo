import ExpoModulesCore
import StoreKit

public class ScandoStorekitModule: Module {
  private let subscriptionManager = SubscriptionManager()

  public func definition() -> ModuleDefinition {
    Name("ScandoStorekit")

    Events("onEntitlementChange")

    AsyncFunction("getProducts") { (promise: Promise) in
      Task {
        do {
          let products = try await self.subscriptionManager.getProducts()
          let mapped = products.map { product -> [String: Any] in
            return [
              "id": product.id,
              "displayName": product.displayName,
              "description": product.description,
              "displayPrice": product.displayPrice,
              "type": self.productTypeString(product.type),
            ]
          }
          promise.resolve(mapped)
        } catch {
          promise.reject("PRODUCTS_ERROR", error.localizedDescription)
        }
      }
    }

    AsyncFunction("purchase") { (productId: String, promise: Promise) in
      Task {
        do {
          let result = try await self.subscriptionManager.purchase(productId: productId)
          promise.resolve(result)
        } catch {
          promise.reject("PURCHASE_ERROR", error.localizedDescription)
        }
      }
    }

    AsyncFunction("restorePurchases") { (promise: Promise) in
      Task {
        do {
          let results = try await self.subscriptionManager.restorePurchases()
          promise.resolve(results)
        } catch {
          promise.reject("RESTORE_ERROR", error.localizedDescription)
        }
      }
    }

    AsyncFunction("getEntitlements") { (promise: Promise) in
      Task {
        do {
          let entitlement = try await self.subscriptionManager.getEntitlements()
          promise.resolve(entitlement)
        } catch {
          promise.reject("ENTITLEMENT_ERROR", error.localizedDescription)
        }
      }
    }
  }

  private func productTypeString(_ type: Product.ProductType) -> String {
    switch type {
    case .autoRenewable: return "autoRenewable"
    case .nonRenewable: return "nonRenewable"
    case .nonConsumable: return "nonConsumable"
    case .consumable: return "consumable"
    @unknown default: return "unknown"
    }
  }
}
