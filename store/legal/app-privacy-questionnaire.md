# App Privacy & Data Safety Questionnaires

Answers to paste into **App Store Connect → App Privacy** and **Google Play Console → Data Safety**.

---

## Apple App Store Connect — App Privacy

### Question 1: "Do you or your third-party partners collect data from this app?"

**Answer: NO — Data Not Collected**

Rationale: Salary Tracker stores all user-entered data (name, wages, shifts, jobs, preferences) exclusively in the device's local storage. No data is transmitted to the developer or any third party. The app does not integrate analytics SDKs, crash reporting services, advertising networks, backend services, or remote font providers.

**Select the declaration:** "We do not collect data from this app"

---

## Google Play Console — Data Safety

### Section 1: Data collection and security

#### 1.1 Does your app collect or share any of the required user data types?
**Answer: No**

> "My app does not collect or share any of the required user data types."

#### 1.2 Is all of the user data collected by your app encrypted in transit?
**Answer: N/A — No data collected**

> Since no data is collected, this question is answered automatically.

#### 1.3 Do you provide a way for users to request that their data be deleted?
**Answer: Yes — Through the app itself**

> Users can delete all app data through **Settings → Clear Data** within the app. Uninstalling the app also removes all data. No data exists on the developer side to delete.

---

### Section 2: Data types — All categories marked "Not collected"

For completeness, confirm "Not collected" for every category:

| Category | Collected? | Shared? |
|---|---|---|
| **Personal info** (name, email, address, phone, race/ethnicity, political/religious beliefs, sexual orientation, other) | ❌ No | ❌ No |
| **Financial info** (payment info, purchase history, credit score, other financial info) | ❌ No | ❌ No |
| **Health & fitness** | ❌ No | ❌ No |
| **Messages** (email, SMS, other) | ❌ No | ❌ No |
| **Photos & videos** | ❌ No | ❌ No |
| **Audio files** | ❌ No | ❌ No |
| **Files & docs** | ❌ No | ❌ No |
| **Calendar** | ❌ No | ❌ No |
| **Contacts** | ❌ No | ❌ No |
| **App activity** (interactions, search history, installed apps, other user-generated content) | ❌ No | ❌ No |
| **Web browsing** | ❌ No | ❌ No |
| **App info & performance** (crash logs, diagnostics, other) | ❌ No | ❌ No |
| **Device or other IDs** | ❌ No | ❌ No |
| **Location** (approximate, precise) | ❌ No | ❌ No |

> **Important note on "Financial info":** Although the app lets users enter wage amounts, this data is entered and stored locally by the user for their own bookkeeping. Google's "collected" definition means the data is sent off-device to the developer or a third party. Since wage data never leaves the device, it is NOT considered "collected" per Google's definition.

---

### Section 3: Security practices

#### 3.1 Is your data encrypted in transit?
**Answer: N/A (no data transmitted)**

> The app does not send app data over the network during normal use.

#### 3.2 Do you follow the Families Policy?
**Answer: Not targeting children**

> Target audience is 18+ adults (working-age). The app is safe for all ages, but is not designed for or marketed to children.

---

## Apple — Age Rating Questionnaire

All answers should be **"None"** for the following categories:

- Cartoon or Fantasy Violence: **None**
- Realistic Violence: **None**
- Prolonged Graphic or Sadistic Realistic Violence: **None**
- Profanity or Crude Humor: **None**
- Mature/Suggestive Themes: **None**
- Horror/Fear Themes: **None**
- Medical/Treatment Information: **None**
- Alcohol, Tobacco, or Drug Use or References: **None**
- Simulated Gambling: **None**
- Sexual Content or Nudity: **None**
- Graphic Sexual Content and Nudity: **None**
- Contests: **None**
- Unrestricted Web Access: **No**
- Gambling and Contests: **No**

**Resulting rating:** 4+

---

## Google Play — Content Rating Questionnaire (IARC)

### Category selection
**Reference app:** Utility, Productivity, Communication, or Other

### Violence
- Contains violence: **No**
- Contains cartoon/fantasy violence: **No**

### Sexuality
- Contains sexuality or nudity: **No**

### Language
- Contains profanity or crude humor: **No**

### Controlled substances
- References drugs, tobacco, or alcohol: **No**

### User interaction
- Allows user-to-user interaction: **No**
- Shares user's physical location with others: **No**
- Allows user-generated content to be shared: **No** (CSV/PDF export is for the user only, not shared externally by the app)

### Digital purchases
- Allows purchase of digital goods: **No**

### Gambling
- Contains gambling content: **No**

**Expected rating:** Everyone (all age groups)

---

## Export Compliance (Apple)

### Does your app use encryption?
**Answer: No special encryption beyond standard Apple platform components**

If Apple prompts further:
- Uses proprietary or custom cryptography: No
- Uses only standard Apple platform encryption where applicable: Yes
- Eligible for standard exemption: Yes

---

## Summary

Because Salary Tracker is a purely offline application with no data collection, no authentication, no analytics, no ads, and no third-party network calls in normal use, both stores' privacy questionnaires reduce to the simplest possible form: **"No data collected, no data shared."** This is one of the strongest privacy positions an app can take and should not raise any flags during review.
