# Account Context Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the shared Sanas-tier layout used in `AccountDetailView` with a dedicated Account context layout that shows a group tree sidebar and account-scoped navigation.

**Architecture:** Two distinct UI contexts — the existing `AppLayout` (Sanas-tier: Supervisor/Admin) and a new `AccountLayout` (Account-tier: Account Admin / Group Admin / Member). When a user drills into an account from the Accounts list, they enter the Account context. The Account sidebar shows the account name, a back link, a recursive group tree (select a group to scope the view), and nav items for API Keys, Team, and Usage — all scoped to that account/group.

**Tech Stack:** Vue 3 (Composition API / `<script setup>`), Vue Router 4, Tailwind CSS (custom design tokens in `tailwind.config.js`), Vite.

> **No test infrastructure exists in this project — skip test steps. Commit after each task.**

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `src/data/mockGroups.js` | Mock group-tree data keyed by account ID |
| Create | `src/components/GroupTreeNode.vue` | Recursive tree node (expand/collapse, active highlight) |
| Create | `src/components/AccountSidebar.vue` | Account sidebar: back link, account name, group tree, nav items |
| Create | `src/components/AccountLayout.vue` | Layout wrapper using `AccountSidebar` |
| Modify | `src/views/AccountDetailView.vue` | Switch from `AppLayout` → `AccountLayout`; remove back button; pass account props |
| Create | `src/views/AccountApiKeysView.vue` | API Keys scoped to the selected account/group |
| Create | `src/views/AccountTeamView.vue` | Team management scoped to the selected account/group |
| Create | `src/views/AccountUsageView.vue` | Usage metrics scoped to the selected account/group |
| Modify | `src/components/AppHeader.vue` | Add title entries for the three new account sub-routes |
| Modify | `src/router/index.js` | Add flat account routes: `/accounts/:id/api-keys`, `/accounts/:id/team`, `/accounts/:id/usage` |

---

## Task 1: Mock group-tree data

**Files:**
- Create: `src/data/mockGroups.js`

The group tree is a recursive structure. Each node has `id`, `name`, and `children: []`. Each account gets its own tree. This file is imported by `AccountSidebar` (and later by account views).

- [ ] **Step 1: Create `src/data/mockGroups.js`**

```js
// Mock group trees keyed by account ID.
// Shape: { id, name, children: [...] }
export const mockGroupTrees = {
  ACC001: {
    id: 'g1', name: 'Acme Corp', children: [
      { id: 'g2', name: 'Engineering', children: [
        { id: 'g4', name: 'Backend',  children: [] },
        { id: 'g5', name: 'Frontend', children: [] },
      ]},
      { id: 'g3', name: 'Sales', children: [
        { id: 'g6', name: 'EMEA', children: [] },
      ]},
    ],
  },
  ACC002: {
    id: 'g10', name: 'Globex', children: [
      { id: 'g11', name: 'Support', children: [] },
      { id: 'g12', name: 'R&D',     children: [] },
    ],
  },
}

// Fallback tree used when account ID is unknown.
export const fallbackTree = {
  id: 'root', name: 'Root', children: [],
}
```

- [ ] **Step 2: Commit**

```bash
git add src/data/mockGroups.js
git commit -m "feat: add mock group tree data"
```

---

## Task 2: GroupTreeNode component

**Files:**
- Create: `src/components/GroupTreeNode.vue`

A recursive component. Receives `node` (one tree node) and `selectedId` (the currently active group ID). Emits `select` with the node's ID when clicked. Shows a chevron toggle for nodes that have children.

- [ ] **Step 1: Create `src/components/GroupTreeNode.vue`**

```vue
<template>
  <div>
    <!-- Row -->
    <div
      :style="{ paddingLeft: depth * 12 + 'px' }"
      :class="[
        'flex items-center gap-[7px] px-2 py-[5px] rounded-rxs cursor-pointer text-[12px] transition-all duration-[130ms] select-none',
        selectedId === node.id
          ? 'text-white bg-grn/10'
          : 'text-g4 hover:text-g2 hover:bg-card',
      ]"
      @click.stop="handleClick"
    >
      <!-- Chevron (only when has children) -->
      <svg
        v-if="node.children.length"
        :class="['w-3 h-3 shrink-0 transition-transform duration-150', open ? 'rotate-90' : '']"
        fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"
      >
        <polyline points="9 18 15 12 9 6"/>
      </svg>
      <!-- Spacer when leaf node -->
      <span v-else class="w-3 shrink-0" />

      <!-- Folder icon -->
      <svg class="w-3 h-3 shrink-0 opacity-60" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
      </svg>

      <span class="truncate">{{ node.name }}</span>
    </div>

    <!-- Children (recursive) -->
    <div v-if="open && node.children.length">
      <GroupTreeNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :depth="depth + 1"
        :selected-id="selectedId"
        @select="$emit('select', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  node:       { type: Object,  required: true },
  depth:      { type: Number,  default: 0 },
  selectedId: { type: String,  default: '' },
})
const emit = defineEmits(['select'])

const open = ref(true) // start expanded

function handleClick() {
  if (props.node.children.length) open.value = !open.value
  emit('select', props.node.id)
}
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/GroupTreeNode.vue
git commit -m "feat: add recursive GroupTreeNode component"
```

---

## Task 3: AccountSidebar component

**Files:**
- Create: `src/components/AccountSidebar.vue`

Props: `accountId` (String), `accountName` (String), `activeNav` (String — `'dashboard' | 'api-keys' | 'team' | 'usage'`).
Emits: `navigate` (navId string), `groupSelect` (groupId string).

Uses `GroupTreeNode` and `mockGroupTrees`. Renders:
1. A back-to-accounts link at the top
2. Account name as context header
3. Group tree section
4. Nav section (Dashboard, API Keys, Team, Usage)

- [ ] **Step 1: Create `src/components/AccountSidebar.vue`**

```vue
<template>
  <aside class="w-[220px] shrink-0 bg-black2 border-r border-border1 flex flex-col fixed top-0 left-0 bottom-0 z-[100] overflow-hidden">

    <!-- Back to Accounts -->
    <div class="px-3 pt-4 pb-3 border-b border-border1">
      <button
        @click="$emit('navigate', '__back__')"
        class="flex items-center gap-1.5 text-[11px] text-g4 hover:text-g2 transition-colors"
      >
        <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        All Accounts
      </button>
      <div class="mt-2.5 flex items-center gap-2">
        <div class="w-5 h-5 rounded bg-grn/20 flex items-center justify-center shrink-0">
          <svg class="w-3 h-3 text-grn" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
        </div>
        <span class="text-[12.5px] font-semibold text-white truncate">{{ accountName }}</span>
      </div>
    </div>

    <!-- Scrollable content -->
    <div class="flex-1 overflow-y-auto px-2.5 py-3 flex flex-col gap-5">

      <!-- Groups tree -->
      <div>
        <div class="text-[9.5px] font-mono text-g5 tracking-[0.08em] uppercase px-2 mb-[5px]">Groups</div>
        <GroupTreeNode
          v-if="tree"
          :node="tree"
          :selected-id="selectedGroupId"
          @select="onGroupSelect"
        />
        <div v-else class="text-[11px] text-g5 px-2">No groups</div>
      </div>

      <!-- Nav -->
      <div>
        <div class="text-[9.5px] font-mono text-g5 tracking-[0.08em] uppercase px-2 mb-[5px]">Navigate</div>
        <div
          v-for="item in navItems"
          :key="item.id"
          :class="[
            'flex items-center gap-[9px] px-[9px] py-[7px] rounded-rxs cursor-pointer text-[12.5px] transition-all duration-[130ms] border select-none',
            activeNav === item.id
              ? 'text-white bg-grn/10 border-grn/[0.13]'
              : 'text-g3 border-transparent hover:text-white hover:bg-card',
          ]"
          @click="$emit('navigate', item.id)"
        >
          <svg
            :class="['w-[14px] h-[14px] shrink-0', activeNav === item.id ? 'text-grn opacity-100' : 'opacity-55']"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
            v-html="item.icon"
          />
          <span>{{ item.label }}</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import GroupTreeNode from './GroupTreeNode.vue'
import { mockGroupTrees, fallbackTree } from '../data/mockGroups.js'

const props = defineProps({
  accountId:   { type: String, required: true },
  accountName: { type: String, default: 'Account' },
  activeNav:   { type: String, default: 'dashboard' },
})
const emit = defineEmits(['navigate', 'groupSelect'])

const tree = computed(() => mockGroupTrees[props.accountId] ?? fallbackTree)

const selectedGroupId = ref(tree.value?.id ?? '')

function onGroupSelect(id) {
  selectedGroupId.value = id
  emit('groupSelect', id)
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard',  icon: '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>' },
  { id: 'api-keys',  label: 'API Keys',   icon: '<path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>' },
  { id: 'team',      label: 'Team',       icon: '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>' },
  { id: 'usage',     label: 'Usage',      icon: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>' },
]
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/AccountSidebar.vue
git commit -m "feat: add AccountSidebar with group tree and nav"
```

---

## Task 4: AccountLayout component

**Files:**
- Create: `src/components/AccountLayout.vue`

Props: `accountId`, `accountName`, `activeNav`.
Handles sidebar navigation by pushing the correct account-scoped route. Passes `groupSelect` events up (or stores selected group in a composable later — for now emit to parent).

`AccountLayout` uses `provide` to share `selectedGroupId` with child views via `inject`. This avoids scoped slot complexity — child views that need the selected group call `inject('selectedGroupId')`.

- [ ] **Step 1: Create `src/components/AccountLayout.vue`**

```vue
<template>
  <div class="flex min-h-screen bg-black1 text-white font-body">
    <AccountSidebar
      :account-id="accountId"
      :account-name="accountName"
      :active-nav="activeNav"
      @navigate="onNavigate"
      @group-select="selectedGroupId = $event"
    />
    <div class="flex flex-col flex-1 min-w-0 ml-[220px]">
      <AppHeader />
      <main class="flex-1 p-6 fade-in">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import { useRouter } from 'vue-router'
import AccountSidebar from './AccountSidebar.vue'
import AppHeader from './AppHeader.vue'

const props = defineProps({
  accountId:   { type: String, required: true },
  accountName: { type: String, default: 'Account' },
  activeNav:   { type: String, default: 'dashboard' },
})

const router = useRouter()
const selectedGroupId = ref('')

// Make selectedGroupId available to any descendant that needs it
provide('selectedGroupId', selectedGroupId)

function onNavigate(navId) {
  if (navId === '__back__') {
    router.push('/accounts')
    return
  }
  const routeMap = {
    dashboard:  `/accounts/${props.accountId}`,
    'api-keys': `/accounts/${props.accountId}/api-keys`,
    team:       `/accounts/${props.accountId}/team`,
    usage:      `/accounts/${props.accountId}/usage`,
  }
  if (routeMap[navId]) router.push(routeMap[navId])
}
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/AccountLayout.vue
git commit -m "feat: add AccountLayout using AccountSidebar"
```

---

## Task 5: Migrate AccountDetailView to AccountLayout

**Files:**
- Modify: `src/views/AccountDetailView.vue`

Replace `AppLayout` with `AccountLayout`. Remove the manual back button and breadcrumb (the sidebar handles both). Pass `accountId`, `accountName` from route params/query.

- [ ] **Step 1: Update imports and layout tag in `AccountDetailView.vue`**

Replace the `<script setup>` imports block — remove `AppLayout`, add `AccountLayout`:

```js
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AccountLayout from '../components/AccountLayout.vue'
```

- [ ] **Step 2: Replace the template wrapper and remove back button / breadcrumb**

Old opening:
```html
<template>
  <AppLayout active-id="accounts">
    <!-- Breadcrumb -->
    <div class="text-[11px] font-mono text-g4 mb-3">Accounts › {{ accountName }}</div>

    <!-- Back button + Title row -->
    <div class="flex items-start gap-4 mb-6">
      <button
        @click="router.push('/accounts')"
        class="bg-transparent text-g2 border border-border2 hover:bg-card hover:text-white rounded-rxs px-3 py-[6px] text-xs font-medium inline-flex items-center gap-[5px] transition-colors mt-1 shrink-0"
      >
        <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Accounts
      </button>
      <div>
        <h1 class="font-display text-[22px] font-bold text-white leading-tight">{{ accountName }}</h1>
        <p class="text-g3 text-sm mt-1">Manage your SDK keys and developer resources</p>
      </div>
    </div>
```

New opening:
```html
<template>
  <AccountLayout
    :account-id="accountId"
    :account-name="accountName"
    active-nav="dashboard"
  >
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="font-display text-[22px] font-bold text-white leading-tight">Dashboard</h1>
      <p class="text-g3 text-sm mt-1">Manage your SDK keys and developer resources</p>
    </div>
```

Replace closing `</AppLayout>` with `</AccountLayout>`.

- [ ] **Step 3: Remove unused `router` import (it's now handled by AccountLayout)**

Remove `useRouter` from the import line and delete `const router = useRouter()`. The only place `router` was used was the back button, which is now gone. Keep `useRoute` — it is still needed for `route.query` and `route.params`.

- [ ] **Step 4: Commit**

```bash
git add src/views/AccountDetailView.vue
git commit -m "feat: migrate AccountDetailView to AccountLayout"
```

---

## Task 6: AccountApiKeysView

**Files:**
- Create: `src/views/AccountApiKeysView.vue`

A trimmed-down version of the Sanas-tier `ApiKeysView` scoped to this account. Shows keys filtered to the account. Uses `AccountLayout` with `active-nav="api-keys"`. Gets `accountId` and `accountName` from route params/query.

- [ ] **Step 1: Create `src/views/AccountApiKeysView.vue`**

```vue
<template>
  <AccountLayout
    :account-id="accountId"
    :account-name="accountName"
    active-nav="api-keys"
  >
    <!-- Page Header -->
    <div class="flex items-start justify-between mb-6">
      <div>
        <h1 class="font-display text-[22px] font-bold text-white leading-tight">API Keys</h1>
        <p class="text-g3 text-sm mt-1">Manage API keys for your groups and deployments.</p>
      </div>
      <button
        @click="showCreateForm = true"
        class="bg-grn text-black hover:bg-grn/90 rounded-rxs px-3 py-[6px] text-xs font-medium inline-flex items-center gap-[5px] transition-colors"
      >
        <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        Create Key
      </button>
    </div>

    <!-- Create form -->
    <div v-if="showCreateForm" class="bg-card border border-border1 rounded-r p-4 mb-5">
      <div class="mb-3">
        <label class="block text-xs font-medium text-g3 mb-1.5">Key Name</label>
        <input v-model="newKeyName" type="text" placeholder="e.g., Production Key"
          class="w-full px-3 py-2 bg-card2 border border-border2 rounded-rxs text-sm text-white placeholder-g5 focus:border-grn/40 outline-none transition-colors" />
      </div>
      <div class="mb-4">
        <label class="block text-xs font-medium text-g3 mb-1.5">Expiry Date <span class="text-g5">(optional)</span></label>
        <input v-model="newKeyExpiry" type="date"
          class="w-full px-3 py-2 bg-card2 border border-border2 rounded-rxs text-sm text-g2 focus:border-grn/40 outline-none transition-colors" />
      </div>
      <div class="flex gap-2">
        <button @click="showCreateForm = false; newKeyName = ''; newKeyExpiry = ''"
          class="bg-transparent text-g2 border border-border2 hover:bg-card hover:text-white rounded-rxs px-3 py-[6px] text-xs font-medium transition-colors">Cancel</button>
        <button @click="createKey"
          class="bg-grn text-black hover:bg-grn/90 rounded-rxs px-3 py-[6px] text-xs font-medium transition-colors">Create Key</button>
      </div>
    </div>

    <!-- Keys table -->
    <div class="bg-card border border-border1 rounded-r overflow-hidden">
      <table class="w-full border-collapse">
        <thead>
          <tr class="border-b border-border1">
            <th class="text-left px-4 py-3 text-[10px] font-mono text-g4 uppercase tracking-wider">Name</th>
            <th class="text-left px-4 py-3 text-[10px] font-mono text-g4 uppercase tracking-wider">Key</th>
            <th class="text-left px-4 py-3 text-[10px] font-mono text-g4 uppercase tracking-wider">Created</th>
            <th class="text-left px-4 py-3 text-[10px] font-mono text-g4 uppercase tracking-wider">Expires</th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="key in keys" :key="key.id" class="border-b border-border1 last:border-0 hover:bg-card2 transition-colors">
            <td class="px-4 py-3 text-sm text-white font-medium">{{ key.name }}</td>
            <td class="px-4 py-3 font-mono text-[11px] text-g3">{{ key.revealed ? key.fullKey : key.maskedKey }}</td>
            <td class="px-4 py-3 text-xs text-g4">{{ key.createdAt }}</td>
            <td class="px-4 py-3 text-xs text-g4">{{ key.expiry || '—' }}</td>
            <td class="px-4 py-3 text-right">
              <div class="flex items-center justify-end gap-1.5">
                <button @click="key.revealed = !key.revealed"
                  class="bg-transparent text-g3 border border-border2 hover:bg-card2 hover:text-white rounded-rxs px-2 py-1 text-xs transition-colors">
                  {{ key.revealed ? 'Hide' : 'Show' }}
                </button>
                <button @click="deleteKey(key.id)"
                  class="bg-transparent text-red1/70 border border-red1/20 hover:bg-red1/10 hover:text-red1 rounded-rxs px-2 py-1 text-xs transition-colors">
                  Delete
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="keys.length === 0">
            <td colspan="5" class="px-4 py-10 text-center text-g5 text-sm">No API keys yet.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </AccountLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import AccountLayout from '../components/AccountLayout.vue'

const route = useRoute()
const accountId   = computed(() => route.params.id || 'ACC001')
const accountName = computed(() => route.query.name || 'Account')

const showCreateForm = ref(false)
const newKeyName     = ref('')
const newKeyExpiry   = ref('')

const keys = ref([
  { id: 1, name: 'Production Key', fullKey: 'sanas-live-Kf9mNpQ2xRsT5vWyZ8aB3cD6eF1g', maskedKey: 'sanas-live-Kf9m...F1g', createdAt: '2026-01-10', expiry: '2026-12-31', revealed: false },
  { id: 2, name: 'Staging Key',    fullKey: 'sanas-test-Mn3pQr7sT9uVwXyZ2aB5cD8eF0gH', maskedKey: 'sanas-test-Mn3p...0gH', createdAt: '2026-02-05', expiry: '2026-06-30', revealed: false },
])
let nextId = 3

function createKey() {
  if (!newKeyName.value.trim()) return
  const prefix  = newKeyName.value.toLowerCase().includes('prod') ? 'sanas-live' : 'sanas-test'
  const chars   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let raw = prefix + '_'
  for (let i = 0; i < 24; i++) raw += chars[Math.floor(Math.random() * chars.length)]
  keys.value.push({
    id: nextId++,
    name: newKeyName.value.trim(),
    fullKey: raw,
    maskedKey: raw.slice(0, 12) + '...' + raw.slice(-3),
    createdAt: new Date().toISOString().slice(0, 10),
    expiry: newKeyExpiry.value || null,
    revealed: false,
  })
  showCreateForm.value = false
  newKeyName.value = ''
  newKeyExpiry.value = ''
}

function deleteKey(id) {
  keys.value = keys.value.filter(k => k.id !== id)
}
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/views/AccountApiKeysView.vue
git commit -m "feat: add AccountApiKeysView"
```

---

## Task 7: AccountTeamView

**Files:**
- Create: `src/views/AccountTeamView.vue`

Shows team members scoped to this account. Roles: Account Admin, Group Admin, Member. Has an Invite button. Uses `AccountLayout` with `active-nav="team"`.

- [ ] **Step 1: Create `src/views/AccountTeamView.vue`**

```vue
<template>
  <AccountLayout
    :account-id="accountId"
    :account-name="accountName"
    active-nav="team"
  >
    <!-- Header -->
    <div class="flex items-start justify-between mb-6">
      <div>
        <h1 class="font-display text-[22px] font-bold text-white leading-tight">Team</h1>
        <p class="text-g3 text-sm mt-1">Manage team members and roles for this account.</p>
      </div>
      <button
        @click="showInviteForm = true"
        class="bg-grn text-black hover:bg-grn/90 rounded-rxs px-3 py-[6px] text-xs font-medium inline-flex items-center gap-[5px] transition-colors"
      >
        <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        Invite Member
      </button>
    </div>

    <!-- Invite form -->
    <div v-if="showInviteForm" class="bg-card border border-border1 rounded-r p-4 mb-5">
      <div class="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label class="block text-xs font-medium text-g3 mb-1.5">Email</label>
          <input v-model="inviteEmail" type="email" placeholder="user@example.com"
            class="w-full px-3 py-2 bg-card2 border border-border2 rounded-rxs text-sm text-white placeholder-g5 focus:border-grn/40 outline-none transition-colors" />
        </div>
        <div>
          <label class="block text-xs font-medium text-g3 mb-1.5">Role</label>
          <select v-model="inviteRole"
            class="w-full px-3 py-2 bg-card2 border border-border2 rounded-rxs text-sm text-g2 focus:border-grn/40 outline-none appearance-none cursor-pointer transition-colors">
            <option value="account-admin">Account Admin</option>
            <option value="group-admin">Group Admin</option>
            <option value="member">Member</option>
          </select>
        </div>
      </div>
      <div class="flex gap-2">
        <button @click="showInviteForm = false; inviteEmail = ''; inviteRole = 'member'"
          class="bg-transparent text-g2 border border-border2 hover:bg-card hover:text-white rounded-rxs px-3 py-[6px] text-xs font-medium transition-colors">Cancel</button>
        <button @click="sendInvite"
          class="bg-grn text-black hover:bg-grn/90 rounded-rxs px-3 py-[6px] text-xs font-medium transition-colors">Send Invite</button>
      </div>
    </div>

    <!-- Members table -->
    <div class="bg-card border border-border1 rounded-r overflow-hidden">
      <table class="w-full border-collapse">
        <thead>
          <tr class="border-b border-border1">
            <th class="text-left px-4 py-3 text-[10px] font-mono text-g4 uppercase tracking-wider">Name</th>
            <th class="text-left px-4 py-3 text-[10px] font-mono text-g4 uppercase tracking-wider">Email</th>
            <th class="text-left px-4 py-3 text-[10px] font-mono text-g4 uppercase tracking-wider">Role</th>
            <th class="text-left px-4 py-3 text-[10px] font-mono text-g4 uppercase tracking-wider">Status</th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="member in members" :key="member.id" class="border-b border-border1 last:border-0 hover:bg-card2 transition-colors">
            <td class="px-4 py-3 text-sm text-white">{{ member.name }}</td>
            <td class="px-4 py-3 text-xs text-g3 font-mono">{{ member.email }}</td>
            <td class="px-4 py-3">
              <span :class="roleBadge(member.role)">{{ roleLabel(member.role) }}</span>
            </td>
            <td class="px-4 py-3">
              <span :class="statusBadge(member.status)">{{ member.status }}</span>
            </td>
            <td class="px-4 py-3 text-right">
              <button @click="removeMember(member.id)"
                class="text-g5 hover:text-red1 text-xs transition-colors">Remove</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </AccountLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import AccountLayout from '../components/AccountLayout.vue'

const route = useRoute()
const accountId   = computed(() => route.params.id || 'ACC001')
const accountName = computed(() => route.query.name || 'Account')

const showInviteForm = ref(false)
const inviteEmail    = ref('')
const inviteRole     = ref('member')

const members = ref([
  { id: 1, name: 'Jordan Lee',   email: 'jordan@acme.com',  role: 'account-admin', status: 'Active' },
  { id: 2, name: 'Sam Rivera',   email: 'sam@acme.com',     role: 'group-admin',   status: 'Active' },
  { id: 3, name: 'Alex Chen',    email: 'alex@acme.com',    role: 'member',        status: 'Invited' },
])
let nextId = 4

function sendInvite() {
  if (!inviteEmail.value.trim()) return
  members.value.push({
    id: nextId++,
    name: inviteEmail.value.split('@')[0],
    email: inviteEmail.value.trim(),
    role: inviteRole.value,
    status: 'Invited',
  })
  showInviteForm.value = false
  inviteEmail.value = ''
  inviteRole.value = 'member'
}

function removeMember(id) {
  members.value = members.value.filter(m => m.id !== id)
}

const roleLabels = { 'account-admin': 'Account Admin', 'group-admin': 'Group Admin', 'member': 'Member' }
function roleLabel(role) { return roleLabels[role] || role }
function roleBadge(role) {
  const base = 'inline-flex px-2 py-[2px] rounded text-[10px] font-medium font-mono'
  if (role === 'account-admin') return base + ' bg-grn/10 text-grn border border-grn/20'
  if (role === 'group-admin')   return base + ' bg-pur/10 text-pur border border-pur/20'
  return base + ' bg-card2 text-g3 border border-border2'
}
function statusBadge(status) {
  const base = 'inline-flex px-2 py-[2px] rounded text-[10px] font-medium font-mono'
  if (status === 'Active') return base + ' bg-grn/10 text-grn border border-grn/20'
  return base + ' bg-amb/10 text-amb border border-amb/20'
}
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/views/AccountTeamView.vue
git commit -m "feat: add AccountTeamView"
```

---

## Task 8: AccountUsageView

**Files:**
- Create: `src/views/AccountUsageView.vue`

Usage metrics scoped to the account. Simple stat cards + placeholder for chart area. Uses `AccountLayout` with `active-nav="usage"`.

- [ ] **Step 1: Create `src/views/AccountUsageView.vue`**

```vue
<template>
  <AccountLayout
    :account-id="accountId"
    :account-name="accountName"
    active-nav="usage"
  >
    <!-- Header -->
    <div class="mb-6">
      <h1 class="font-display text-[22px] font-bold text-white leading-tight">Usage</h1>
      <p class="text-g3 text-sm mt-1">API call counts and latency metrics for this account.</p>
    </div>

    <!-- Date range filter -->
    <div class="flex items-center gap-3 mb-6">
      <select v-model="range"
        class="px-3 py-[6px] bg-card2 border border-border2 rounded-rxs text-sm text-g2 focus:border-grn/40 outline-none appearance-none cursor-pointer transition-colors">
        <option value="7">Last 7 days</option>
        <option value="30">Last 30 days</option>
        <option value="90">Last 90 days</option>
      </select>
    </div>

    <!-- Stat cards -->
    <div class="grid grid-cols-3 gap-4 mb-6">
      <div v-for="stat in stats" :key="stat.label" class="bg-card border border-border1 rounded-r p-4">
        <div class="text-[10px] font-mono text-g4 uppercase tracking-wider mb-2">{{ stat.label }}</div>
        <div class="text-2xl font-display font-bold text-white">{{ stat.value }}</div>
        <div class="text-xs text-g4 mt-1">{{ stat.sub }}</div>
      </div>
    </div>

    <!-- Chart placeholder -->
    <div class="bg-card border border-border1 rounded-r p-5">
      <div class="text-sm font-semibold text-white mb-1">API Calls Over Time</div>
      <div class="text-xs text-g4 mb-4">Daily call volume for selected period</div>
      <div class="h-40 flex items-end gap-1">
        <div
          v-for="(bar, i) in bars"
          :key="i"
          :style="{ height: bar + '%' }"
          class="flex-1 bg-grn/30 rounded-t-sm hover:bg-grn/50 transition-colors"
        />
      </div>
    </div>
  </AccountLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import AccountLayout from '../components/AccountLayout.vue'

const route = useRoute()
const accountId   = computed(() => route.params.id || 'ACC001')
const accountName = computed(() => route.query.name || 'Account')
const range       = ref('30')

const stats = [
  { label: 'Total API Calls', value: '124,830', sub: 'vs 98,200 prior period' },
  { label: 'Avg Latency',     value: '42 ms',   sub: 'p50 response time' },
  { label: 'Active Keys',     value: '7',        sub: 'across all groups' },
]

// Deterministic mock bar heights
const bars = Array.from({ length: 30 }, (_, i) => 20 + ((i * 37 + 11) % 65))
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/views/AccountUsageView.vue
git commit -m "feat: add AccountUsageView"
```

---

## Task 9: Fix AppHeader titles for account sub-routes

**Files:**
- Modify: `src/components/AppHeader.vue`

Currently the header computes `'Account Detail'` for any path starting with `/accounts/`. The three new sub-routes need distinct titles.

- [ ] **Step 1: Update `pageTitle` computed in `src/components/AppHeader.vue`**

Replace the existing `pageTitle` computed:

```js
const pageTitle = computed(() => {
  if (route.path.startsWith('/accounts/')) return 'Account Detail'
  return titleMap[route.path] ?? 'Dashboard'
})
```

With:

```js
const accountSubTitles = {
  'api-keys': 'API Keys',
  'team':     'Team',
  'usage':    'Usage',
}

const pageTitle = computed(() => {
  if (route.path.startsWith('/accounts/')) {
    // e.g. /accounts/ACC001/api-keys → last segment is 'api-keys'
    const segments = route.path.split('/')
    const last = segments[segments.length - 1]
    return accountSubTitles[last] ?? 'Account Detail'
  }
  return titleMap[route.path] ?? 'Dashboard'
})
```

- [ ] **Step 2: Commit**

```bash
git add src/components/AppHeader.vue
git commit -m "fix: update AppHeader titles for account sub-routes"
```

---

## Task 10: Wire up router

**Files:**
- Modify: `src/router/index.js`

Add the three new account-scoped views as child routes under `/accounts/:id`.

- [ ] **Step 1: Update `src/router/index.js`**

```js
import { createRouter, createWebHashHistory } from 'vue-router'

const LoginView           = () => import('../views/LoginView.vue')
const AccountsView        = () => import('../views/AccountsView.vue')
const AccountDetailView   = () => import('../views/AccountDetailView.vue')
const ApiKeysView         = () => import('../views/ApiKeysView.vue')
const MembersView         = () => import('../views/MembersView.vue')
const UsersView           = () => import('../views/UsersView.vue')
const UsageView           = () => import('../views/UsageView.vue')
const AccountApiKeysView  = () => import('../views/AccountApiKeysView.vue')
const AccountTeamView     = () => import('../views/AccountTeamView.vue')
const AccountUsageView    = () => import('../views/AccountUsageView.vue')

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/',                         component: LoginView },
    { path: '/home',                     redirect: '/accounts' },
    { path: '/accounts',                 component: AccountsView },
    { path: '/accounts/:id',             component: AccountDetailView },
    { path: '/accounts/:id/api-keys',    component: AccountApiKeysView },
    { path: '/accounts/:id/team',        component: AccountTeamView },
    { path: '/accounts/:id/usage',       component: AccountUsageView },
    { path: '/api-keys',                 component: ApiKeysView },
    { path: '/members',                  component: MembersView },
    { path: '/users',                    component: UsersView },
    { path: '/usage',                    component: UsageView },
  ],
})

export default router
```

- [ ] **Step 2: Commit**

```bash
git add src/router/index.js
git commit -m "feat: add account-scoped routes for api-keys, team, usage"
```

---

## Task 11: Manual smoke test

- [ ] Run `npm run dev` and verify:
  1. Accounts list loads at `/accounts`
  2. Clicking an account navigates to `/accounts/:id` → Dashboard with `AccountSidebar` visible
  3. Group tree renders with expand/collapse working
  4. "All Accounts" back link returns to `/accounts`
  5. Sidebar nav items navigate to `/accounts/:id/api-keys`, `/accounts/:id/team`, `/accounts/:id/usage`
  6. Active sidebar item highlights correctly on each page
  7. Sanas-tier sidebar pages (`/api-keys`, `/users`, `/usage`, `/members`) are unaffected
