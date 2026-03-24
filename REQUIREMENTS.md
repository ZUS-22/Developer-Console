# Requirements — Sanas Developer Console

---

## Requirement 1: Login Page

### User Journey
1. Admin visits the Sanas Developer Console URL
2. Admin sees the login screen with two options
3. Admin chooses either:
   - **Option A**: Enter email and click Continue → Go to Accounts page
   - **Option B**: Click Google Sign-In → Authenticate with Google → Go to Accounts page
4. Admin is logged in and sees the accounts page

### User Story
**As a** Sanas admin
**I want to** sign in securely using either my email or Google account
**So that** I can access the developer console and manage accounts

### Acceptance Criteria
- [x] Login page displays "Welcome to Sanas Developer Console" as the heading
- [x] Sanas logo appears at the top of the login card
- [x] Dark card design on a gradient background (matching visual reference)
- [x] Email input field is present with a placeholder
- [x] Continue button is visible and changes appearance when email is entered
- [x] Google Sign-In button is present with the Google logo
- [x] Text indicates that signing in means agreeing to Terms of Use
- [x] Visual divider ("or") separates the two login methods
- [x] Design looks professional and matches the visual reference provided
- [x] Page works on both desktop and mobile screens
- [x] Clicking Continue or Google Sign-In takes user to Accounts page

### Open Questions / Missing Details
- **Passcode flow:**
  - Since we're skipping the passcode entry screen for now, how should actual authentication work in the future?
  - Should there be a separate passcode entry screen later?

---

## Requirement 2: Accounts Page

### User Journey
1. Admin logs in successfully
2. Admin lands on the Accounts page
3. Admin sees a table of all accounts with billing plan information
4. Admin can:
   - Search for specific accounts
   - Filter accounts by billing plan type
   - Click on account rows to see details
   - Click three-dot menu to edit account details or subscriptions
   - Create new accounts using the "Create Account" button

### User Story
**As a** Sanas admin
**I want to** view and manage all customer accounts in one place
**So that** I can oversee billing plans, subscriptions, and account settings

### Acceptance Criteria
- [x] Page shows after successful login
- [x] Top navigation bar with tabs: Home, Accounts, Sanas Members
- [x] Accounts tab is highlighted as active
- [x] Left sidebar shows organizational groups (Sanas, Direct CX, Self Serve)
- [x] Search box with placeholder "Search Account"
- [x] Filter dropdown showing "All Billing Plans" with options for SDK types
- [x] "Create Account" button in top right
- [x] Data table with columns:
  - [x] Account Name
  - [x] Account ID (in monospace font)
  - [x] Account Admins (avatar circles with initials)
  - [x] Parent Group (clickable links)
  - [x] Billing Plans Access (showing plan badges)
  - [x] Subscribed Licenses (number)
  - [x] Created On (date)
  - [x] Created By (username)
  - [x] Three-dot menu button
- [x] Billing plans are "Self Hosted SDK" and "Sanas Cloud SDK"
- [x] Accounts can show one or both billing plans
- [x] Three-dot menu shows "Edit Account Details" and "Edit Subscriptions"
- [x] Menu opens on click and closes when clicking outside

### Open Questions / Missing Details
- **Search functionality:**
  - Should search match on account name only, or also ID, admins, etc.?
  - Should search be instant as you type, or require pressing Enter?

- **Filter functionality:**
  - When filtering by a billing plan, should it show only accounts with that exact plan, or accounts that include that plan among others?

- **Parent Group links:**
  - What happens when clicking "Direct CX" or "Self Serve"?
  - Should it filter the table or navigate somewhere?

- **Account avatars:**
  - Where do the admin initials come from?
  - Should avatars show profile pictures or always be initials?

- **Edit actions:**
  - What fields are in "Edit Account Details"?
  - What fields are in "Edit Subscriptions"?
  - Should these open in a modal or navigate to a new page?

- **Create Account:**
  - What information is needed to create an account?
  - Should it be a modal or a separate page?

- **Pagination:**
  - How many accounts should show per page?
  - Should there be "load more" or page numbers?

- **Table sorting:**
  - Should columns be sortable?
  - What should the default sort order be?

- **User info in header:**
  - Where does "Zupudi uday@sa..." come from?
  - Should it be a dropdown with logout option?

- **Home and Sanas Members tabs:**
  - What content do these tabs show?
  - Are they part of this admin console or separate areas?

---

## Requirement 3: Account Detail Page Tab Navigation

### User Journey
1. Admin navigates to an account detail page
2. Admin sees a navigation bar with tabs at the top
3. Admin can click on tabs to view different sections: Home, API Keys, Users, Usage, and Settings
4. Tabs are arranged in a specific order that matches the priority and workflow

### User Story
**As a** Sanas admin viewing an account
**I want to** see the account navigation tabs in a logical order
**So that** I can quickly access the most important sections first

### Acceptance Criteria
- [x] Tabs appear in this exact order: Home, API Keys, Users, Usage, Settings
- [x] Home tab is first and active by default
- [x] API Keys tab is second
- [x] Users tab is third
- [x] Usage tab is fourth
- [x] Settings tab is fifth
- [x] All tabs retain their original functionality
- [x] Clicking each tab navigates to the appropriate section

### Open Questions / Missing Details
- None — tab order is clearly defined and implemented

---

## Requirement 4: Group Hierarchy Navigation

### User Journey
1. Admin views any account detail page (API Keys, Users, Usage, Home)
2. Admin sees "My Assigned Groups" section in the left sidebar
3. Admin sees groups organized hierarchically (Production, Staging, UAT)
4. Admin clicks on Production to expand and see subgroups (OnePlus, Real Me, OnePay)
5. Admin clicks on a subgroup to filter the view to that specific group
6. Admin can collapse the expanded group by clicking it again

### User Story
**As a** Sanas admin managing multiple groups
**I want to** navigate through a hierarchical group structure
**So that** I can view data filtered by specific groups and subgroups

### Acceptance Criteria
- [x] Groups are displayed hierarchically in the sidebar (Production, Staging, UAT)
- [x] Parent groups with children show a chevron (›) indicator
- [x] Clicking a parent group expands/collapses the children without navigation
- [x] Clicking a leaf group (no children) or subgroup navigates to that group's view
- [x] Expanded groups show indented subgroups beneath them
- [x] Chevron rotates when group is expanded
- [x] Selected group is highlighted
- [x] Expansion state persists until user manually changes it

### Open Questions / Missing Details
- None — hierarchy navigation is fully implemented

---

## Requirement 5: Accounts Page Group Hierarchy Display

### User Journey
1. Admin views the Accounts page
2. Admin sees the Parent Group column in the accounts table
3. For accounts in subgroups, the full hierarchy path is shown (e.g., "Production > OnePlus")
4. For accounts in top-level groups, only the group name is shown (e.g., "Production")

### User Story
**As a** Sanas admin reviewing accounts
**I want to** see the full group hierarchy for each account
**So that** I understand the organizational structure and nesting of accounts

### Acceptance Criteria
- [x] Parent Group column shows full hierarchy path using ">" separator
- [x] Subgroup accounts display as "ParentGroup > SubGroup" (e.g., "Production > OnePlus")
- [x] Top-level group accounts display just the group name (e.g., "Production")
- [x] Format is consistent across all accounts

### Open Questions / Missing Details
- None — hierarchy display is implemented

---

## Requirement 6: Unified API Key Creation

### User Journey
1. Admin clicks "Create API Key" button on the API Keys page
2. Modal opens with a simple form
3. Admin enters an API key name
4. A unified API key is automatically generated and displayed
5. Admin copies the key and creates it
6. Key is added to the API keys table

### User Story
**As a** Sanas admin creating API keys
**I want to** create API keys with a simple, unified process
**So that** I can quickly generate keys without complexity

### Acceptance Criteria
- [x] Create API Key button opens a modal
- [x] Modal shows API key name input field
- [x] API key is automatically generated in sk_live_ format
- [x] No deployment type selection needed
- [x] All accounts can create keys regardless of billing plan
- [x] Keys are added to the table without deployment type column
- [x] Warning shown that key will only be displayed once

### Open Questions / Missing Details
- None — simplified API key creation is implemented

---

## Requirement 7: Auto-Confirm API Key Copy

### User Journey
1. Admin creates a new API key
2. Key is generated and displayed in the modal
3. Admin clicks "Copy Key" button
4. Key is copied to clipboard
5. "I have copied the key" checkbox is automatically checked
6. "Create Key" button becomes enabled

### User Story
**As a** Sanas admin creating API keys
**I want to** have the confirmation checkbox automatically checked when I copy the key
**So that** I can quickly save the key without an extra manual step

### Acceptance Criteria
- [x] Clicking "Copy Key" button copies the key to clipboard
- [x] "I have copied the key" checkbox is automatically checked after copying
- [x] Button text changes to "Copied!" briefly
- [x] "Create Key" button becomes enabled after checkbox is checked
- [x] Admin can still manually check/uncheck the checkbox

### Open Questions / Missing Details
- None — auto-confirm is implemented

---

## Requirement 8: Billing Plan Naming and Home Page Distinction

### User Journey
1. Admin views the Accounts page and sees billing plans labeled "Self Hosted SDK" and "Sanas Cloud SDK"
2. Admin navigates to an account with Self Hosted SDK billing plan
3. On the home page, admin sees the SDK keys section for quick key generation
4. Admin navigates to an account with Sanas Cloud SDK billing plan
5. On the home page, the SDK keys section is not displayed
6. Both billing plans have identical access to all other features (API Keys page, Users page, Usage page)

### User Story
**As a** Sanas admin managing different account types
**I want to** understand which billing plan an account has and see appropriate features
**So that** I know what capabilities are available for each account

### Acceptance Criteria
- [x] Billing plans are named "Self Hosted SDK" and "Sanas Cloud SDK" throughout the application
- [x] Accounts page displays these plan names in the billing plans column
- [x] Create Account form shows these names as checkbox options
- [x] Filter dropdown uses these plan names
- [x] Only Self Hosted SDK accounts show the SDK keys section on the home page
- [x] Sanas Cloud SDK accounts do not see SDK keys section on home page
- [x] Both billing plans can access the API Keys page with full functionality
- [x] Both billing plans can access Users and Usage pages
- [x] No other functional differences between the two billing plans

### Open Questions / Missing Details
- None — billing plan naming and home page distinction are implemented

---

## Requirement 10: Vue.js + Tailwind CSS Migration

### User Journey
1. A developer opens the app in a browser
2. The app loads as a single page
3. Developer navigates between all pages (Login, Accounts, Account Detail, API Keys, Users, Usage, Members) using the top navigation and back buttons
4. All transitions happen instantly without a full page reload

### User Story
**As a** product manager
**I want** the HTML prototype converted to a structured Vue.js application
**So that** the codebase is easier to maintain and extend as new features are added

### Acceptance Criteria
- [x] All 7 pages exist as Vue.js views
- [x] All original visual designs are preserved exactly
- [x] Navigation between pages works via Vue Router (no page reloads)
- [x] Shared sidebar and header are defined in reusable components
- [x] All CSS is Tailwind-based (no hand-written style blocks except minimal global animations)
- [x] The app builds and runs with `npm run dev`
- [x] Original HTML files are archived in `html-originals/`

### Open Questions / Missing Details
- **Members page theme:** The Members page has a distinct light theme while all other pages use the dark theme — should it be unified with the dark theme? (Currently kept as-is from the original HTML)

---

## Requirement 9: Modern UI Design with Developer Focus

### User Journey
1. Admin visits any page of the developer console
2. Admin sees a modern, polished interface with clean typography and clear visual hierarchy
3. Technical elements like API keys, account IDs, and code blocks are displayed in monospace fonts
4. Admin interacts with buttons, forms, and tables that have smooth hover states and modern styling
5. The overall design feels professional, developer-friendly, and easy to navigate

### User Story
**As a** developer or technical admin using the Sanas Developer Console
**I want to** see a modern, well-designed interface with developer-friendly aesthetics
**So that** the console feels professional, is easy to use, and technical information is clearly presented

### Acceptance Criteria
- [x] Modern, clean typography with good hierarchy and readability
- [x] Developer-focused aesthetic with prominent use of monospace fonts for technical data
- [x] Consistent color palette with good contrast and visual depth
- [x] Buttons with smooth hover states and modern styling
- [x] Tables with clean borders, proper spacing, and hover effects
- [x] Cards and containers with subtle shadows for visual depth
- [x] Forms with clear focus states and modern input styling
- [x] Code blocks and technical elements styled like terminal/IDE output
- [x] Generous whitespace for visual breathing room
- [x] Smooth transitions and animations for interactions
- [x] Consistent design language across all pages
- [x] Professional, polished appearance throughout

### Open Questions / Missing Details
- None — modern UI design has been implemented across all pages
