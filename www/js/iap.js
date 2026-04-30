/* =========================================================================
   IAP / RevenueCat hook for Japan Take-home Plus

   ── HOW TO ENABLE LIVE PURCHASES ─────────────────────────────────────────
   1. Create a RevenueCat project at https://app.revenuecat.com
   2. Add an iOS app and (optionally) an Android app
   3. Create products in App Store Connect and Google Play that match the
      product IDs below (jp_takehome_plus_monthly_v1, jp_takehome_plus_lifetime_v1)
   4. Link those products into a RevenueCat offering and create an
      entitlement named exactly "jp_takehome_plus" attached to both products
   5. Copy the public API keys from RevenueCat → Project settings → API keys
   6. Paste them into JP_IAP_CONFIG below, then build & submit
   ───────────────────────────────────────────────────────────────────────── */

const JP_IAP_CONFIG = {
  entitlement: 'jp_takehome_plus',
  monthlyProductId: 'jp_takehome_plus_monthly_v1',
  lifetimeProductId: 'jp_takehome_plus_lifetime_v1',

  // ▼▼▼ Insert RevenueCat public SDK keys here ▼▼▼
  revenueCatApiKeyIos: '',
  revenueCatApiKeyAndroid: ''
  // ▲▲▲ Insert RevenueCat public SDK keys here ▲▲▲
};

let jpIapReady = false;
let jpIapCustomerInfo = null;
let jpIapOfferings = null;
let jpIapLastSyncAt = 0;

function getRevenueCatPlugin() {
  try {
    if (window.Purchases) return window.Purchases;
    if (window.Capacitor && Capacitor.Plugins && Capacitor.Plugins.Purchases) return Capacitor.Plugins.Purchases;
    if (
      window.Capacitor &&
      Capacitor.registerPlugin &&
      (!Capacitor.isPluginAvailable || Capacitor.isPluginAvailable('Purchases'))
    ) {
      return Capacitor.registerPlugin('Purchases');
    }
  } catch (e) {}
  return null;
}

function getRevenueCatApiKey() {
  const platform = window.Capacitor && Capacitor.getPlatform ? Capacitor.getPlatform() : 'web';
  if (platform === 'ios') return JP_IAP_CONFIG.revenueCatApiKeyIos;
  if (platform === 'android') return JP_IAP_CONFIG.revenueCatApiKeyAndroid;
  return '';
}

async function initPurchases() {
  const plugin = getRevenueCatPlugin();
  const apiKey = getRevenueCatApiKey();
  if (!plugin || !apiKey) {
    jpIapReady = false;
    return false;
  }
  try {
    if (plugin.configure) await plugin.configure({ apiKey });
    jpIapReady = true;
    await refreshJpProStatus();
    await refreshJpOfferings();
    return true;
  } catch (e) {
    jpIapReady = false;
    return false;
  }
}

function isJpTakehomeProActive() {
  try {
    const entitlements = jpIapCustomerInfo && jpIapCustomerInfo.entitlements && jpIapCustomerInfo.entitlements.active;
    return !!(entitlements && entitlements[JP_IAP_CONFIG.entitlement]);
  } catch (e) {
    return false;
  }
}

async function refreshJpProStatus() {
  const plugin = getRevenueCatPlugin();
  if (!plugin || !jpIapReady || !plugin.getCustomerInfo) return isJpTakehomeProActive();
  try {
    const res = await plugin.getCustomerInfo();
    jpIapCustomerInfo = res && (res.customerInfo || res);
    jpIapLastSyncAt = Date.now();
    return isJpTakehomeProActive();
  } catch (e) {
    return isJpTakehomeProActive();
  }
}

async function refreshJpOfferings() {
  const plugin = getRevenueCatPlugin();
  if (!plugin || !jpIapReady || !plugin.getOfferings) return null;
  try {
    const res = await plugin.getOfferings();
    jpIapOfferings = res || null;
    return jpIapOfferings;
  } catch (e) {
    return null;
  }
}

/* Returns the localized price string for a product id, or null if unavailable.
   UI uses this to render real prices on paywall buttons. */
function getJpProductPriceString(productId) {
  try {
    const offerings = jpIapOfferings;
    const packages = offerings && offerings.current && offerings.current.availablePackages;
    if (!packages || !packages.length) return null;
    const pkg = packages.find(p => {
      const pid = p.product && (p.product.identifier || p.product.productIdentifier);
      return pid === productId || p.identifier === productId;
    });
    if (!pkg) return null;
    return (pkg.product && (pkg.product.priceString || pkg.product.price_string)) || null;
  } catch (e) {
    return null;
  }
}

async function purchaseJpTakehomePackage(packageId) {
  const plugin = getRevenueCatPlugin();
  if (!plugin || !jpIapReady) {
    const msg = (typeof jpCopy === 'function' && jpCopy().purchaseUnavailable) || 'Purchase unavailable';
    await alertDialog(msg);
    return false;
  }
  try {
    if (!jpIapOfferings) await refreshJpOfferings();
    const offerings = jpIapOfferings;
    const available = offerings && offerings.current && offerings.current.availablePackages;
    const pkg = available && available.find(p => {
      const productId = p.product && (p.product.identifier || p.product.productIdentifier);
      return p.identifier === packageId || productId === packageId;
    });
    if (!pkg) throw new Error('Package not found');
    const res = await plugin.purchasePackage({ aPackage: pkg });
    jpIapCustomerInfo = res && (res.customerInfo || res);
    return isJpTakehomeProActive();
  } catch (e) {
    if (e && (e.userCancelled || e.code === 'PURCHASE_CANCELLED')) return false;
    toast((typeof jpCopy === 'function' && jpCopy().purchaseUnavailable) || 'Purchase unavailable');
    return false;
  }
}

async function restoreJpTakehomePurchases() {
  const plugin = getRevenueCatPlugin();
  if (!plugin || !jpIapReady || !plugin.restorePurchases) {
    await alertDialog((typeof jpCopy === 'function' && jpCopy().restoreUnavailable) || 'Restore unavailable');
    return false;
  }
  try {
    const res = await plugin.restorePurchases();
    jpIapCustomerInfo = res && (res.customerInfo || res);
    return isJpTakehomeProActive();
  } catch (e) {
    toast((typeof jpCopy === 'function' && jpCopy().restoreUnavailable) || 'Restore unavailable');
    return false;
  }
}
