# IAP Setup Guide — Japan Take-home Plus (RevenueCat + App Store Connect)

This document walks through enabling live in-app purchases for the
**Japan Take-home Plus** Pro feature. Follow each section in order.
The app code is already integrated with RevenueCat — you only need to
configure the dashboards and paste the API key into [www/js/iap.js](../../www/js/iap.js).

---

## A. App Store Connect — Create the products

You need **two** products attached to bundle ID `com.haiash.salarytracker`.

### A.1 Prerequisites
- Active paid Apple Developer account (you already have one).
- Bank account, tax forms, contact info filled out in **App Store Connect → Agreements, Tax, and Banking → Paid Apps**.
  Without this, IAP cannot be approved.
- The app record exists in App Store Connect with bundle ID `com.haiash.salarytracker`.

### A.2 Create the monthly subscription
1. ASC → **Apps** → Salary Tracker → **Monetization → Subscriptions**.
2. Create a new **Subscription Group** (e.g. "Japan Take-home Plus").
3. Inside the group, **+ Subscription** with these values:
   - **Reference Name:** `Japan Take-home Plus Monthly`
   - **Product ID:** `jp_takehome_plus_monthly_v1` ← must match exactly
   - **Subscription duration:** 1 month
   - **Pricing:** $0.99 / equivalent localized prices
4. Add **Localized Display Name** for at least English and Japanese (e.g. "Japan Take-home Plus — Monthly", "Japan Take-home Plus 月額").
5. Add a **Promotional image** (1024×1024 optional) and review notes.
6. Save.

### A.3 Create the lifetime non-consumable
1. ASC → **Monetization → In-App Purchases**.
2. **+ In-App Purchase** → **Non-Consumable**.
3. Fill in:
   - **Reference Name:** `Japan Take-home Plus Lifetime`
   - **Product ID:** `jp_takehome_plus_lifetime_v1` ← must match exactly
   - **Pricing:** $9.99 / equivalent localized prices
4. Localized name for English and Japanese.
5. Save.

### A.4 Submit for review (later)
After the app binary is uploaded, attach both IAPs to the next build
under **Monetization → In-App Purchases → Add to Submission**. Apple
reviews IAPs together with the app the first time.

---

## B. RevenueCat — Project + entitlement

### B.1 Create the project
1. Go to https://app.revenuecat.com → **+ New Project** named "Salary Tracker".
2. **Add app → Apple App Store**.
   - **App name:** Salary Tracker iOS
   - **Bundle ID:** `com.haiash.salarytracker`
   - **App Store Connect Shared Secret:** generated under **ASC → Users and Access → Integrations → Shared Secret** (App-Specific Shared Secret recommended).
3. Save. RevenueCat now connects to your ASC account.

### B.2 Import products
1. Project → **Products** → **Import** → tick the two ASC products above.
   - `jp_takehome_plus_monthly_v1`
   - `jp_takehome_plus_lifetime_v1`
2. Both should show "Imported from App Store Connect".

### B.3 Create the entitlement
1. Project → **Entitlements** → **+ New entitlement**.
   - **Identifier:** `jp_takehome_plus` ← must match exactly
   - **Description:** "Unlocks Japan Take-home Plus features"
2. Click into the new entitlement → **Attach products** → tick both products.
3. Save. Both products now grant the same entitlement.

### B.4 Build the offering
1. Project → **Offerings** → there is a default "current" offering.
2. Add two **Packages** to it:
   - Package identifier: `$rc_monthly` → Product: `jp_takehome_plus_monthly_v1`
   - Package identifier: `$rc_lifetime` → Product: `jp_takehome_plus_lifetime_v1`
3. Mark the offering as **Current**.

### B.5 Get the iOS public API key
1. Project → **Project settings → API keys**.
2. Copy the **Public app-specific API key** for the iOS app (starts with `appl_...`).

---

## C. Wire the API key into the app

Open [www/js/iap.js](../../www/js/iap.js) and paste the key:

```js
const JP_IAP_CONFIG = {
  entitlement: 'jp_takehome_plus',
  monthlyProductId: 'jp_takehome_plus_monthly_v1',
  lifetimeProductId: 'jp_takehome_plus_lifetime_v1',

  // ▼▼▼ Insert RevenueCat public SDK keys here ▼▼▼
  revenueCatApiKeyIos: 'appl_xxxxxxxxxxxxxxxxxxxxxxxx',  // ← paste here
  revenueCatApiKeyAndroid: ''                            // leave empty for now
  // ▲▲▲ Insert RevenueCat public SDK keys here ▲▲▲
};
```

Then run:

```bash
npm run sync:ios
```

---

## D. Sandbox testing

### D.1 Create a sandbox tester
1. ASC → **Users and Access → Sandbox → Testers** → **+**.
2. Use a fresh email address you control (Apple does not allow re-using
   your real Apple ID for sandbox testing).
3. Save.

### D.2 Sign in on the device
On your test iPhone:
1. **Settings → App Store → Sandbox Account → Sign In** with the tester email.
2. Do NOT sign in with the sandbox tester in iCloud — only in App Store Sandbox section.

### D.3 Test the purchase flow
1. Build & run the app to your iPhone (not the simulator — sandbox IAP only
   works on real devices).
2. Open **Settings → Japan Take-home Plus**.
3. The paywall should now show real prices pulled from RevenueCat
   (e.g. "¥160 / month" instead of the fallback "$0.99 / month").
4. Tap a price button → Apple sandbox prompt → confirm.
5. After purchase, the paywall block should hide automatically and the
   status pill should change to "Pro".
6. Test **Restore purchases** by deleting + reinstalling the app and
   tapping the restore button.

### D.4 What to watch for
- **Empty offerings:** RevenueCat returns no packages → check that
  "Offering" is marked as Current and packages are attached.
- **Buttons stay on fallback prices:** `getJpProductPriceString` returned
  null → check that products are imported and entitlement is attached.
- **"Purchase unavailable" toast:** plugin/init failed → verify API key,
  bundle ID, and that ASC products are in "Ready to Submit" or
  "Approved" status.
- **Pro doesn't unlock after purchase:** entitlement identifier
  mismatch → must be exactly `jp_takehome_plus`.

---

## E. Privacy & legal

Once IAP is live:
1. ASC → **App Privacy** → update from "No data collected" to include
   "Purchases" data type linked to RevenueCat (anonymous user ID +
   purchase identifiers — no salary or personal data leaves the device).
   Reference: [store/legal/revenuecat-privacy-notes.md](revenuecat-privacy-notes.md).
2. App Store description should mention "Japan Take-home Plus is an
   optional in-app purchase. Results are estimates only."
3. Make sure your app contains:
   - **Restore purchases** button (already wired in the paywall block).
   - **Terms of Use (EULA)** and **Privacy Policy** URLs in ASC.
   - Subscription disclosure on the paywall ("auto-renewing", price,
     duration). Required by Apple guideline 3.1.2.

---

## F. Submission checklist (before pressing "Submit for Review")

- [ ] Bank/tax info active in ASC (Section A.1)
- [ ] Both products in **Ready to Submit** state (Section A.2, A.3)
- [ ] Entitlement `jp_takehome_plus` attached to both products (Section B.3)
- [ ] Offering with monthly + lifetime packages, marked Current (Section B.4)
- [ ] iOS API key pasted in [www/js/iap.js](../../www/js/iap.js) (Section C)
- [ ] `npm run sync:ios` ran without errors
- [ ] Sandbox purchase test passed on real iPhone (Section D.3)
- [ ] Sandbox restore test passed (Section D.3)
- [ ] App Privacy answers updated in ASC (Section E.1)
- [ ] Subscription terms/EULA URLs filled in ASC (Section E.3)
- [ ] Both IAPs attached to the build under Monetization (Section A.4)

When all boxes are ticked, submit. Apple reviewer will test the IAP
themselves — make sure sandbox prices and the restore button work.

---

## G. Troubleshooting matrix

| Symptom | Likely cause | Fix |
|---|---|---|
| Paywall buttons stuck on "$0.99 / month" hardcode | RC offerings empty | Ensure offering is **Current** + products attached |
| Tap Buy → "Store is not ready yet" toast | `jpIapReady === false` | API key wrong / bundle ID mismatch |
| Tap Buy → instant cancel, no Apple prompt | Sandbox account not signed in on device | Settings → App Store → Sandbox → Sign In |
| Purchase succeeds but Pro doesn't unlock | Entitlement ID mismatch | Must be exactly `jp_takehome_plus` |
| Restore returns nothing for known purchaser | Different Apple ID in sandbox vs at original purchase | Sign in with the same sandbox tester used originally |
| Apple rejects with "guideline 3.1.1" | Missing Restore button or unclear pricing | Already wired — double-check button visible & disclosure text shown |
