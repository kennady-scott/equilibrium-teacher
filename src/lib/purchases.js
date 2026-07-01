import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';

// Fill these in after creating your RevenueCat project
const REVENUECAT_APPLE_KEY   = 'appl_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
const REVENUECAT_GOOGLE_KEY  = 'goog_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

export const ENTITLEMENT_ID  = 'pro';
export const OFFERING_ID     = 'default';

export function initPurchases(userId) {
  if (Platform.OS === 'web') return; // RevenueCat is native-only

  const apiKey = Platform.OS === 'ios' ? REVENUECAT_APPLE_KEY : REVENUECAT_GOOGLE_KEY;
  Purchases.setLogLevel(LOG_LEVEL.ERROR);
  Purchases.configure({ apiKey });

  if (userId) {
    Purchases.logIn(userId);
  }
}

export async function getSubscriptionStatus() {
  if (Platform.OS === 'web') return { isActive: true }; // always allow on web
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    const isActive = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
    return { isActive, customerInfo };
  } catch (e) {
    return { isActive: false };
  }
}

export async function getOfferings() {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current ?? null;
  } catch (e) {
    return null;
  }
}

export async function purchasePackage(pkg) {
  const { customerInfo } = await Purchases.purchasePackage(pkg);
  const isActive = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
  return { isActive, customerInfo };
}

export async function restorePurchases() {
  const customerInfo = await Purchases.restorePurchases();
  const isActive = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
  return { isActive, customerInfo };
}
