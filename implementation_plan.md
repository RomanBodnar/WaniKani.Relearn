# Implementation Plan: Personal WaniKani API Key Storage & Access Control

This plan details the design and implementation of Personal WaniKani API Key Storage, user token security, a dedicated WaniKani settings table, level-based licensing access control for subject mnemonics, and WaniKani integration.

---

## Responsibility Division

| Component Layer | Responsibility | Notes |
| :--- | :--- | :--- |
| **Backend API & Database** | **USER** | Implementing DB entities (`user_wanikani_settings`), DataProtection token encryption, `AccountManagementController`, level caching, and mnemonic redaction filter based on the technical specification below. |
| **Frontend Web Application** | **AGENT (AI Assistant)** | Implementing React components (`WaniKaniTokenForm`, settings page integration, token storage consent checkboxes, and API client state hooks). |

---

## Key Technical Decisions & Architecture

### 1. Token Encryption & Security (Consideration 6)
WaniKani Personal Access Tokens cannot be hashed (like passwords) because the backend must send the raw token to `api.wanikani.com`.
- **Solution:** Use **ASP.NET Core Data Protection** (`IDataProtectionProvider` / `IDataProtector`).
- **Mechanism:**
  - `IWaniKaniTokenProtector` will encrypt tokens before saving to PostgreSQL or setting cookies.
  - Symmetric key derivation ensures that even if the database is leaked, raw WaniKani API tokens cannot be decrypted without the application's Data Protection key ring.

### 2. Dedicated Database Table `user_wanikani_settings` (Architectural Isolation)
To maintain a clean separation of concerns and avoid security leakage:
- Core identity (`users` table) remains clean and light.
- WaniKani-specific settings are stored in a dedicated `user_wanikani_settings` table (mapped to `UserWaniKaniSettingsEntity`), linked via a 1-to-1 relationship to `users(id)`.

### 3. Storage Strategy & Consent (Considerations 1, 2, 5)
A new `AccountManagementController` (`/api/account`) will manage WaniKani tokens:
- **Database Storage (User Opt-In):** If `saveToDatabase: true`, the encrypted token is stored in the `user_wanikani_settings` table.
- **Cookie Storage (Fallback):** If `saveToDatabase: false`, the encrypted token is stored in a secure, HTTP-Only cookie (`WK-User-Token`).
- **Cookie Consent Note:** Added UI placeholder and backend cookie flag for future cookie consent banner integration.

### 4. WaniKani User Level Verification & Caching (Consideration 3)
- Endpoint: `GET https://api.wanikani.com/v2/user`
- Returns user's current level (`data.level`) and subscription status (`data.subscription.max_level_granted`).
- **Allowed Level Calculation:** `allowedMaxLevel = Math.Min(user.level, subscription.max_level_granted ?? 3)`.
- **Caching Strategy:**
  - Cache `allowedMaxLevel` in `IMemoryCache` (Key: `wk_level_{userId_or_tokenHash}`, Sliding Expiration: **6 hours**, Absolute Expiration: **24 hours**).
  - Also persist `max_allowed_level` and `max_allowed_level_last_checked_at` in the `user_wanikani_settings` table to prevent redundant API calls across application restarts.

### 5. Proprietary Mnemonics Access Control & TODO Markers (Consideration 4)
- **Mnemonics Protection Rule:** Subject `MeaningMnemonic`, `ReadingMnemonic`, `MeaningHint`, and `ReadingHint` are intellectual property of WaniKani.
- **Enforcement:**
  - When returning subjects in `SubjectsController`, check if the active user has a valid token **AND** `subject.Level <= userAllowedMaxLevel`.
  - If token is missing, invalid, or `subject.Level > userAllowedMaxLevel`, redact (set to `null`) all mnemonic and hint fields in the response DTO.
- **TODO Markers:** Added explicit codebase TODO comments identifying WaniKani as the proprietary source of all mnemonics.

---

## Technical Specifications for Backend (User Implementation)

### Database Layer & Entities

#### [MODIFY] [AuthEntities.cs](file:///c:/code/WaniKani.Relearn/WaniKani.Relearn/Data/Entities/AuthEntities.cs)
- Create new entity `UserWaniKaniSettingsEntity`:
  ```csharp
  public class UserWaniKaniSettingsEntity
  {
      public required string UserId { get; set; }
      public string? EncryptedWaniKaniToken { get; set; }
      public string TokenStorageType { get; set; } = "None"; // "Database", "Cookie", "None"
      public int? MaxAllowedLevel { get; set; }
      public DateTime? MaxAllowedLevelLastCheckedAt { get; set; }

      public UserEntity? User { get; set; }
  }
  ```
- Add navigation property to `UserEntity`:
  ```csharp
  public UserWaniKaniSettingsEntity? WaniKaniSettings { get; set; }
  ```

#### [MODIFY] [BonpomDbContext.cs](file:///c:/code/WaniKani.Relearn/WaniKani.Relearn/Data/BonpomDbContext.cs)
- Map `UserWaniKaniSettingsEntity` to `user_wanikani_settings` table with 1-to-1 relationship to `users(id)` in `OnModelCreating`.

---

### Encryption & Security Infrastructure

#### [NEW] `WaniKani.Relearn/Auth/Services/IWaniKaniTokenProtector.cs`
- Interface defining `EncryptToken(string rawToken)` and `DecryptToken(string encryptedToken)`.

#### [NEW] `WaniKani.Relearn/Auth/Services/WaniKaniTokenProtector.cs`
- Implementation using ASP.NET Core `IDataProtectionProvider`.

---

### WaniKani Client Extensions

#### [MODIFY] [WaniKaniClient.cs](file:///c:/code/WaniKani.Relearn/WaniKani.Relearn/Contracts/Clients/WaniKaniClient.cs)
- Add `Task<WaniKaniUserResponse?> GetUserInformationAsync(string token)` method to query `api.wanikani.com/v2/user`.

#### [NEW] `WaniKani.Relearn/Contracts/Clients/WaniKaniUserResponse.cs`
- DTO models representing WaniKani `/v2/user` response (`Level`, `Subscription.MaxLevelGranted`).

---

### Account Management Controller & Token Services

#### [NEW] [AccountManagementController.cs](file:///c:/code/WaniKani.Relearn/WaniKani.Relearn/Auth/Api/AccountManagementController.cs)
- `POST /api/account/wanikani-token`: Accepts `{ token, saveToDatabase }`. Validates token against WaniKani, saves to `user_wanikani_settings` DB table or sets encrypted cookie `WK-User-Token`.
- `DELETE /api/account/wanikani-token`: Clears token from DB and removes cookie.
- `GET /api/account/wanikani-status`: Returns token state and allowed max level.

#### [NEW] `WaniKani.Relearn/Auth/Services/WaniKaniUserLevelService.cs`
- Evaluates user max allowed level with `IMemoryCache` (6-hour sliding TTL).

---

### Mnemonics Access Control & Response Filtering

#### [NEW] `WaniKani.Relearn/Subjects/Services/SubjectMnemonicFilter.cs`
- Evaluates if active user has access to a given subject's level.
- Redacts `MeaningMnemonic`, `ReadingMnemonic`, `MeaningHint`, and `ReadingHint` if level exceeds allowed access.
- Includes TODO comment:
  `// TODO: WaniKani Mnemonics Source: All reading and meaning mnemonics are proprietary content of WaniKani (https://www.wanikani.com). Access is restricted based on granted subscription level.`

#### [MODIFY] [SubjectsController.cs](file:///c:/code/WaniKani.Relearn/WaniKani.Relearn/Subjects/Api/SubjectsController.cs)
- Apply `SubjectMnemonicFilter` to all responses (`GetSubjects`, `GetSubjectById`, `Search`).

---

## Action Plan for Frontend UI (Agent Implementation)

#### [NEW] `WaniKani.Relearn.FE/app/components/WaniKaniTokenForm.tsx` (React Component)
- Implement interactive card component in the settings/profile view:
  - Form fields for WaniKani Personal Access Token.
  - Checkbox: *"Store token securely in my account database"* (explicit consent for DB storage).
  - Info alert: *"If left unchecked, your token will be stored locally in browser cookies."*
  - Action buttons: "Save WaniKani Integration" and "Disconnect Account".
  - Status indicator showing active connection state and current max unlocked level.

#### [NEW] `WaniKani.Relearn.FE/app/hooks/useWaniKaniToken.ts` (React Hook)
- Custom hook managing API requests to `/api/account/wanikani-token` and state synchronization with frontend UI components.

---

## Verification Plan

### Automated Tests (User & Agent)
- Backend unit tests in `BonPom.Tests` verifying token encryption, level caching, and mnemonic redaction.
- Frontend component tests for form submission and status rendering.

### Manual Verification
- Test `POST /api/account/wanikani-token` with valid & invalid tokens via UI.
- Verify `user_wanikani_settings` table contains encrypted string, not plain text.
- Verify HTTP request to `/api/subjects` redacts mnemonics for high-level subjects when no token or free-tier token is used.
