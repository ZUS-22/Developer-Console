SANAS DEVELOPER CONSOLE
Phase 1 — User Journeys & Roles
Internal working document · March 2026

================================================================================

1. SYSTEM OVERVIEW
================================================================================

The Sanas Developer Console is a multi-tenant platform that allows Sanas staff
to provision and manage developer accounts, and allows those accounts to generate
and manage API keys for SDK integration. Access is governed by a layered role
hierarchy across two organisational tiers: Sanas (internal) and Account (customer).

Top-level group structure (pre-seeded):
  - Sanas (root)
      - Direct CX
      - Self Serve

Note: Accounts are created under one of these two groups by a Supervisor.
Additional top-level Sanas groups require a direct DB change.


================================================================================

2. ROLES & PERMISSIONS
================================================================================

There are six roles across two tiers. Sanas-tier roles have platform-wide scope;
Account-tier roles are scoped to their account or group.

--- Sanas-Tier Roles ---

Supervisor
  - Full platform access.
  - The only role that can add other Supervisors (via direct DB entry).
  - Can create Accounts, Sanas Admins, and Sanas Members.
  - Pre-seeded users: muthu.krishnan@sanas.ai and zupudi.uday@sanas.ai.

Sanas Admin
  - Can create and manage Accounts and account-level users.
  - Cannot create or promote Supervisors.

Sanas Member
  - Read-only access across all developer accounts.
  - API key values are always masked — Sanas Members cannot see the raw key.

--- Account-Tier Roles ---

Account Admin
  - Full control within their account: team members, API keys, groups, and usage.
  - Can invite Group Admins and Members, and can assign and change roles.

Group Admin
  - Can be assigned to one or more groups simultaneously.
  - Manages team members, API keys, and sub-groups within their assigned group scope.
  - Can promote Members to Group Admin within their scope.

Member
  - Can create API keys within their assigned group scope.
  - Can view usage within groups they have access to.
  - Cannot delete API keys or manage other users.

--- Permission Matrix ---

Action                  | Supervisor | Sanas Admin | Sanas Member | Acct Admin | Group Admin    | Member
------------------------|------------|-------------|--------------|------------|----------------|----------------
Create Accounts         | Yes        | Yes         | No           | No         | No             | No
Manage Accounts         | Yes        | Yes         | No           | No         | No             | No
Add Supervisors         | Yes        | No          | No           | No         | No             | No
Add Sanas Admins/Members| Yes        | Yes         | No           | No         | No             | No
Create API Keys         | Yes        | Yes         | No           | Yes        | Yes (scope)    | Yes (scope)
Delete API Keys         | Yes        | Yes         | No           | Yes        | Yes (scope)    | No
View API Keys           | Yes        | Yes         | Masked only  | Yes        | Yes (scope)    | Yes (scope)
Manage Groups           | Yes        | Yes         | No           | Yes        | Yes (scope)    | No
Manage Team Members     | Yes        | Yes         | No           | Yes        | Yes (scope)    | No
View Usage              | Yes        | Yes         | Yes          | Yes        | Yes (scope)    | Yes (scope)

(scope) = limited to the user's assigned group(s) and their descendants.


================================================================================

3. INVITATION & ONBOARDING RULES
================================================================================

  - All invitations are sent via a welcome email with a CTA link to the console.
  - Invitation links expire. Exact TTL to be confirmed by engineering
    (72 hours recommended).
  - A resend invitation flow must be supported from the admin UI.
  - If an invited email already exists in the system (i.e. the user belongs to
    another account), they gain access to both accounts under a single login.
    No duplicate account is created.


================================================================================

4. SUPERVISOR USER JOURNEY
================================================================================

Supervisors are the top-level administrators of the platform. Their primary
responsibilities are account provisioning and Sanas-level team management.

--- 4.1 Create an Account ---

  Step 1: Log in to the console with pre-seeded credentials.
  Step 2: Navigate to Accounts → Create Account.
  Step 3: Fill in account details — Account Name, Account Admin Email,
          Parent Group (Direct CX or Self Serve), and Billing Plan.
  Step 4: Submit. The system creates the account and sends a welcome email to
          the Account Admin with a CTA to log in. The invite link expires after
          the agreed TTL.

--- 4.2 Manage Sanas-Level Team ---

  Step 1: Navigate to Team → Add Member.
  Step 2: Enter email and select role — Sanas Admin or Sanas Member.
  Step 3: Submit. Welcome email is sent.
          - Sanas Admin: can manage accounts but cannot create Supervisors.
          - Sanas Member: read-only access; API keys are always masked.


================================================================================

5. ACCOUNT ADMIN USER JOURNEY
================================================================================

Account Admins are customer-side administrators. They receive an invitation from
a Supervisor or Sanas Admin and have full control within their account.

--- 5.1 Onboarding ---

  Step 1: Receive welcome email with a CTA link.
  Step 2: Click CTA and set up login.
          Note: If the link has expired, the Account Admin must request a resend
          from the Supervisor or Sanas Admin.
  Step 3: Land on the account dashboard.

--- 5.2 Create an API Key ---

  Step 1: Navigate to API Keys → Create Key.
  Step 2: Configure the key — give it a name and optionally set an expiry date.
          No expiry means the key is valid indefinitely until manually deleted.
  Step 3: Copy and store the key. The key value is shown only once.
  Step 4: Use the key in the SDK integration by following the developer
          instructions provided in the console.

--- 5.3 Delete an API Key ---

  Step 1: Navigate to API Keys.
  Step 2: Select key → Delete. Deletion is immediate and permanent.

  Note: If a key's creator has been removed from the account, ownership of
  their keys transfers to the Account Admin before deletion.

--- 5.4 Manage Groups ---

  Step 1: Navigate to Groups → Create Group.
          Groups can be nested to unlimited depth (Group → Sub-group → ...).
  Step 2: Name the group and set a parent (account root or any existing group).
  Step 3: Assign users to the group — Group Admins or Members.
  Step 4: Update or delete groups as needed.
          Open item: behaviour when deleting a group with active API keys
          (block delete vs. transfer keys) needs to be confirmed.

--- 5.5 Invite Team Members ---

  Step 1: Navigate to Team → Invite.
  Step 2: Enter email and select role — Account Admin, Group Admin, or Member.
  Step 3: For Group Admin / Member, assign one or more groups.
          Group Admins can be assigned to multiple groups simultaneously.
  Step 4: Send invite. Welcome email is dispatched; link expires after agreed TTL.


================================================================================

6. GROUP ADMIN USER JOURNEY
================================================================================

Group Admins operate within the scope of one or more assigned groups. They can
manage their group's members, API keys, and sub-groups.

--- 6.1 Manage Team within Scope ---

  Step 1: Navigate to Team (scoped view — only sees members in assigned groups).
  Step 2: Invite a new member — can invite Members or other Group Admins
          within their scope.
  Step 3: Promote a Member to Group Admin within their scope.
  Step 4: Remove a member from the group. This removes group access only;
          it does not delete the user from the account.

--- 6.2 Manage API Keys & Sub-groups ---

  Step 1: Create or delete API keys within their group(s) and descendants.
  Step 2: Create and manage sub-groups within their assigned groups.
  Step 3: View usage — API call counts and latency metrics scoped to their
          group hierarchy.


================================================================================

7. MEMBER USER JOURNEY
================================================================================

Members have limited, scoped access. They can create API keys and view usage
within their assigned groups.

  Step 1: Accept invitation and log in.
  Step 2: Navigate to API Keys → Create Key (scoped to assigned group(s)).
  Step 3: View usage — API call counts and latency metrics for their group scope.

Note: Members cannot delete API keys or manage other users.


================================================================================

8. USAGE DATA
================================================================================

"View Usage" refers to two data points, scoped by role:

  - API call counts: number of requests made using keys within the user's scope.
  - Latency metrics: response time data for those requests.

Billing cost data is not in scope for Phase 1. The two billing plans (Self Hosted
SDK and Sanas Cloud SDK) are referenced but their feature gating is deferred
to Portal V3.


================================================================================

9. OPEN ITEMS TO RESOLVE
================================================================================

The following points require team sign-off before engineering begins:

  1. Invitation TTL — confirm the expiry window (72 hours recommended).
  2. Group delete behaviour — should deleting a group with active API keys be
     blocked, or should the keys be transferred / orphaned?
  3. Sanas Member API key masking — confirm the masking format
     (e.g. sk-••••••1234).
  4. Usage time ranges — what periods are available in the usage view?
     (e.g. last 7 days, 30 days, custom range)
  5. Billing plan gating — what, if anything, does the billing plan restrict
     in Phase 1?

================================================================================